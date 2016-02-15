import React from 'react';
import d3 from 'd3';

class TreemapChart extends React.Component {

  static propTypes = {
    data : React.PropTypes.object.isRequired,
    value: React.PropTypes.string,
    options: React.PropTypes.object
  };

  static defaultProps = {
    data: {},
    margin: {top: 20, right: 0, bottom: 0, left: 0},
    width: 960,
    height: 500
  };

  constructor(props,context) {
    super(props,context)
    this.transitioning = false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.margin !== this.props.margin)
      this.margin = nextProps.margin

    if (nextProps.width !== this.props.width) {
      this.width = nextProps.width
      this.x = d3.scale.linear().domain([0, this.width]).range([0, this.width])
    }

    if (nextProps.height !== this.props.height || nextProps.margin !== this.props.margin) {
      this.height = nextProps.height - nextProps.margin.top - nextProps.margin.bottom
      this.y = d3.scale.linear().domain([0, this.height]).range([0, this.height])
    }
    this.treemap = d3.layout.treemap()
        .children((d, depth) => (depth ? null : d._children))
        .sort((a, b) => a.value - b.value)
        .ratio(this.height / this.width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    const data = this.prepareData(Object.assign({},nextProps.data),this.treemap, this.width, this.height)
    this.display(data)
  }

  componentDidMount() {
    this.treemap = d3.layout.treemap()
        .children((d, depth) => (depth ? null : d._children))
        .sort((a, b) => a.value - b.value)
        .ratio(this.height / this.width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    this.margin = this.props.margin
    this.width = this.props.width
    this.x = d3.scale.linear().domain([0, this.width]).range([0, this.width])
    this.height = this.props.height - this.props.margin.top - this.props.margin.bottom
    this.y = d3.scale.linear().domain([0, this.height]).range([0, this.height])

    const data = this.prepareData(Object.assign({},this.props.data),this.treemap, this.width, this.height)
    this.display(data)
  }


  prepareData(root,treemap, width, height) {
    const data = initialize(root)
    accumulate(data)
    return layout(data)

    function initialize(root) {
      return Object.assign({},root,{
        x: 0,
        y: 0,
        dx: width,
        dy: height,
        depth: 0,
        children: (root.children || []).map((c)=>initialize(c)),
        _children: root.children ? [].concat(root.children) : []
      })
    }

    // Aggregate the values for internal nodes. This is normally done by the
    // treemap layout, but not here because of our custom implementation.
    // We also take a snapshot of the original children (_children) to avoid
    // the children being overwritten when when layout is computed.
    function accumulate(d) {
      d.value = (!!d.children) ? d.children.reduce((p, v) => p + accumulate(v),0) : 0
    }

    // Compute the treemap layout recursively such that each group of siblings
    // uses the same size (1×1) rather than the dimensions of the parent cell.
    // This optimizes the layout for the current zoom state. Note that a wrapper
    // object is created for the parent node for each group of siblings so that
    // the parent’s dimensions are not discarded as we recurse. Since each group
    // of sibling was laid out in 1×1, we must rescale to fit using absolute
    // coordinates. This lets us use a viewport to zoom.
    function layout(d) {
      if (d._children) {
        treemap.nodes({_children: d._children});
        for (let c of d._children) {
          c.x = d.x + c.x * d.dx;
          c.y = d.y + c.y * d.dy;
          c.dx *= d.dx;
          c.dy *= d.dy;
          c.parent = d;
          layout(c);
        }
      }
      return d
    }
  }

  display(d) {
    const svg = d3.select(this.refs.svg)
    const grandparent = svg.select(".grandparent")
    const transition = this._transition.bind(this)
    const text = this._text.bind(this)
    const rect = this._rect.bind(this)
    const name = this._name.bind(this)

    grandparent
        .datum(d.parent)
        .on("click", transition)
        .select("text")
        .text(name(d));

    const g1 = svg.insert("g", ".grandparent").datum(d).attr("class", "depth");
    const g = g1.selectAll("g").data(d._children).enter().append("g");

    g.filter((d) => d._children).classed("children", true).on("click", transition);

    g.selectAll(".child").data((d) => d._children || [d])
        .enter().append("rect")
        .attr("class", "child")
        .call(rect);

    g.append("rect").attr("class", "parent")
        .call(rect)
        .append("title")
        .text((d) => formatNumber(d.value));

    g.append("text")
        .attr("dy", ".75em")
        .text((d) => d.name)
        .call(text);

    return g;
  }

  _text(text) {
    text
        .attr("x", (d) => x(d.x) + 6)
        .attr("y", (d) => y(d.y) + 6);
  }

  _rect(rect) {
    rect
        .attr("x", (d) => x(d.x))
        .attr("y", (d) => y(d.y))
        .attr("width", (d) => x(d.x + d.dx) - x(d.x))
        .attr("height", (d) => y(d.y + d.dy) - y(d.y));
  }

  _name(d) {
    return d.parent ? this._name(d.parent) + "." + d.name : d.name;
  }

  _transition(d) {
    if (this.transitioning || !d) return;
    this.transitioning = true;
    const text = this._text.bind(this)
    const rect = this._rect.bind(this)

    const svg = d3.select(this.refs.svg)
    const g2 = display(d),
        t1 = g1.transition().duration(750),
        t2 = g2.transition().duration(750);

    // Update the domain only after entering new elements.
    this.x.domain([d.x, d.x + d.dx]);
    this.y.domain([d.y, d.y + d.dy]);

    // Enable anti-aliasing during the transition.
    svg.style("shape-rendering", null);

    // Draw child nodes on top of parent nodes.
    svg.selectAll(".depth").sort((a, b) => a.depth - b.depth);

    // Fade-in entering text.
    g2.selectAll("text").style("fill-opacity", 0);

    // Transition to the new view.
    t1.selectAll("text").call(text).style("fill-opacity", 0);
    t2.selectAll("text").call(text).style("fill-opacity", 1);
    t1.selectAll("rect").call(rect);
    t2.selectAll("rect").call(rect);

    // Remove the old node when the transition is finished.
    t1.remove().each("end", function() {
      svg.style("shape-rendering", "crispEdges");
      this.transitioning = false;
    });
  }

  render() {
    const margin = this.props.margin
    const width = this.props.width
    const height = 500 - margin.top - margin.bottom

    return (<div className="chart treemap">
      <svg width={width + margin.left + margin.right} height={height + margin.bottom + margin.top}>
        <g ref="svg"
           transform={"translate(" + margin.left + "," + margin.top + ")"}
           style={{shapeRendering:'crispEdges'}}
        >
          <g className="grandparent">
            <rect y={-margin.top} width={width} height={margin.top}></rect>
            <text x="6" y={6 - margin.top} dy=".75em"></text>
          </g>
        </g>
      </svg>
    </div>)
  }
}

export default TreemapChart