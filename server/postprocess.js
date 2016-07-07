const fs = require('fs');

const file = process.argv[2] || '-'
const base = file.split('.')[0]
const idx = process.argv[3] || base.split('_')[0]
const type = process.argv[3] || base.split('_')[1]
const preamble = JSON.stringify({create:{_index:idx,_type:type}})

fs.readFile(file, (err,data) => {
  if (err) console.log(err)
  var records = JSON.parse(data)

  records.forEach(d => {
    process.stdout.write(preamble+'\n')
    process.stdout.write(JSON.stringify(d)+'\n')
  })
})
