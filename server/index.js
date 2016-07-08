const express = require('express');
const es = require('elasticsearch');

var client = new es.Client({
    host: 'localhost:9200',
    log: 'trace'
});

const router = express.Router();

function parseFilters(filters,attrs) {
    const filterObj = (typeof filters == 'string' ? JSON.parse(filters) : filters ) || {}
    if (Array.isArray(attrs)) {
        attrs.forEach(attr => delete filterObj[attr])
    }
    return Object.keys(filterObj).map(key => {
        if (Array.isArray(filterObj[key])) {
            return {terms: { [key]: filterObj[key]}}
        } else if (typeof filterObj[key] == 'string') {
            return {term: { [key]: filterObj[key]}}
        } else {
            return {range: { [key]: filterObj[key]}}
        }
    });
}

router.get('/servers', (req,res) => {
    const limit = req.query.limit || 100;
    const filterParam = parseFilters(req.query.filters);
    const q = req.query.q || ""
    const from = req.query.from || 0;
    const params = {
        index: 'merged',
        size: limit,
        from: from,
        body: {}
    };
    let filterInsertPoint;

    if (q !== "") {
        params.body.query = {
            filtered:{
                query:{
                    query_string: {
                        query: q
                    }
                }
            }
        }
        filterInsertPoint = params.body.query.filtered
    } else if (filterParam.length > 0) {
        params.body.query = {
            constant_score: {}
        }
        filterInsertPoint = params.body.query.constant_score
    } else {
        params.body.query = {
            match_all: {}
        }
    }

    if (filterParam.length  > 0 ) {
        filterInsertPoint.filter = {
            bool: {
                filter: filterParam
            }
        }
    }
    client.search(params, (err,data) => {
        try {
            res.set('Cache-Control','private, max-age=600');
            res.json(data.hits.hits.map(d=>d._source));
        } catch (e) {
            res.status(500).end()
        }
    });
});

router.get('/servers/:name', (req,res) => {
    const params = {
        index: 'merged',
        body: {
            query: {
                filtered: {
                    filter: {
                        term: {
                            host_name: req.param('name')
                        }
                    }
                }
            }
        }
    };
    client.search(params, (err,data) => {
        try {
            res.set('Cache-Control','private, max-age=600');
            res.json(data.hits.hits.map(d=>d._source));
        } catch (e) {
            res.status(500).end()
        }
    });
});

router.get('/servers/by/:attrs', (req,res) => {
    const limit = 0;
    const attrs = req.params.attrs.split(',');
    const filters = JSON.parse(req.query.filters) || {};
    const filterParam = parseFilters(filters, attrs);

    const aggs =  attrs.map(attr=>({aggs:{[attr]:{terms:{field:attr}}}})).reverse()
        .reduce((acc,query)=>{
            const key = Object.keys(query.aggs)[0];
            query.aggs[key] = Object.assign({},query.aggs[key],acc);
            return query;
        },{});
    const params = {
        index: 'merged',
        size: limit,
        body: {}
    };
    if (Object.keys(filters).length > 0) {
        const filterQuery = {
            filter: {
                bool: {
                    filter: filterParam
                }
            }
        };
        params.body = {
            aggs: {
                filtered: Object.assign({},filterQuery,aggs)
            }
        }
    } else {
        params.body = aggs
    };
    client.search(params, (err,data) => {
        try {
            res.set('Cache-Control', 'private, max-age=600');

            const root = data.aggregations.hasOwnProperty('filtered') ? data.aggregations.filtered : data.aggregations;
            const finalAttr = attrs[attrs.length-1];

            for (let i=0;i < attrs.length-1; i++) {
                const attr = attrs[i];
                const nextAttr = attrs[i+1];

                root[nextAttr]= {buckets:
                    [].concat(...root[attr].buckets.map(obj=>
                        obj[nextAttr].buckets.map(nextObj=>Object.assign({},nextObj,{[attr]:obj.key})))
                    )
                }
            }
            res.json(root[finalAttr].buckets.map(d=>({
                key: attrs.length <= 1 ? d.key : attrs.map(attr=>d.hasOwnProperty(attr)?d[attr]:d.key),
                value: d.doc_count
            })));
        } catch (e) {
            res.status(500).end()
        }
    });
});

router.get('/sites', (req,res) => {
    const params = {
        index: 'merged',
        size: 0,
        body: {
            aggs:{
                site_code: {
                    terms: { "field": "site_code", "size": 1000 },
                    aggs: {
                        total_gb: { "sum": { "field": "total_sum" } },
                        avail_gb: { "sum": { "field": "avail_sum" } }
                    }
                }
            }
        }
    };
    client.search(params, (err,data) => {
        try {
            res.set('Cache-Control','private, max-age=600');
            const json = data.aggregations.site_code.buckets.map(bucket => ({
                id: bucket.key,
                name: bucket.key,
                avail_gb: bucket.avail_gb.value,
                storage_gb: bucket.total_gb.value,
                avail_percent: (bucket.total_gb.value > 0) ? bucket.avail_gb.value/bucket.total_gb.value: 0
            }));
            res.json(json);
        } catch (e) {
            res.status(500).end()
        }
    });
});

router.get('/sites/:name', (req,res) => {
    const id = req.params.name
    const params = {
        index: 'merged',
        size: 10000,
        body: {
            query: {
                constant_score: {
                    filter: {
                        term: {
                            site_code: id
                        }
                    }
                }
            }
        }
    };
    client.search(params, (err,data) => {
        try {
            res.set('Cache-Control','private, max-age=600');
            const site =  data.hits.hits.map(d=>d._source).reduce((acc,d) => {
                acc.storage_gb += d.total_sum || 0;
                acc.avail_gb += d.avail_sum || 0;
                acc.servers.push(d);
                return acc;
            },{id:id, name: id, storage_gb: 0, avail_gb: 0, servers:[]});
            site.avail_percent = (site.storage_gb > 0) ? site.avail_gb/site.storage_gb : 0 ;
            res.json(site);
        } catch (e) {
            res.status(500).end()
        }
    });
});

router.get('/sites/by/:attr', (req,res) => {
    const limit = 0;
    const attr = req.param('attr');
    const filters = parseFilters(req.query.filters,[attr])

    const termAggs =  {
        terms: {
            field: attr
        }
    };
    const params = {
        index: 'merged',
        size: limit,
        body: {}
    };
    if (Object.keys(filters).length > 0) {
        params.body = {
            aggs: {
                [attr + '_filtered']: {
                    filter: {
                        bool: {
                            filter: filterParam
                        }
                    },
                    aggs: {
                        [attr]: termAggs
                    }
                }
            }
        }
    } else {
        params.body = {
            aggs: {
                [attr]: termAggs
            }
        }
    };
    client.search(params, (err,data) => {
        try {
            const body = data.aggregations.hasOwnProperty(attr) ? data.aggregations[attr] : data.aggregations[attr+'_filtered'][attr]
            res.set('Cache-Control', 'private, max-age=600');
            res.json(body.buckets.map(d=>({key: d.key, value: d.doc_count})));
        } catch (e) {
            res.status(500).end()
        }
    });
});

module.exports = router;