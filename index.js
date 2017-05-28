// var ml = require('machine_learning');
//
// var costf = function(vec) {
//     var cost = 0;
//     for(var i =0; i<14;i++) { // 15-dimensional vector
//         cost += (0.5*i*vec[i]*Math.exp(-vec[i]+vec[i+1])/vec[i+1])
//     }
//     cost += (3.*vec[14]/vec[0]);
//     return cost;
// };
//
// var domain = [];
// for(var i=0;i<15;i++)
//     domain.push([1,70]); // domain[idx][0] : minimum of vec[idx], domain[idx][1] : maximum of vec[idx].
//
// var vec = ml.optimize.genetic({
//     domain : domain,
//     costf : costf,
//     population : 50,
//     elite : 2, // elitism. number of elite chromosomes.
//     epochs : 300,
//     q : 0.3 // Rank-Based Fitness Assignment. fitness = q * (1-q)^(rank-1)
//             // higher q --> higher selection pressure
// });
//
// console.log("vec : ",vec);
// console.log("cost : ",costf(vec));
//
// var predict = require('predict');
//
// //perform moving average with a buffer of size 10 by default
// var ma = predict.movingAverage();
// ma.pushValues([2,4,6,8,10]);
//
//
// //predict next value based on average 2+4+6+8+10 = 30 and 30/5 = 6
// var result = ma.predictNextValue();
// //result will be 6
//
// // console.log(result);

// var csv = require('fast-csv')
// var fs = require('fs')
//
// var stream = fs.createReadStream("./data/companylist.csv");
//
// var csvStream = csv()
//     .on("data", function(data){
//       if((data[1]).indexOf("Apple")>=0){
//          console.log(data);
//       }
//     })
//     .on("end", function(){
//          console.log("done");
//     });
//
// stream.pipe(csvStream);



const express = require('express')
const app = express()
const fetch = require('node-fetch');



const QUANDL_KEY = "CU5crF9_VkawsswoTN5y";
const QUANDL_API = "https://www.quandl.com/api/v3";

var response_test  = require('./data/test_response');


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static('public'))

// app.get('/', function (req, res) {
//   res.send('Hello!')
// })

app.get('/test_prediction', function (req, res) {
  res.json(response_test)
})

const symbols = require('./data/companylist_only_name');

app.get('/symbol/:search', function (req, res) {
let s = req.params.search.toLowerCase();
let r = symbols.filter(function(item) {
  return item.Name.toLowerCase().indexOf(s) != -1;
});
if(r.length>5) r = r.slice(0,5);
  res.json(r)
})


app.get('/datasets/WIKI/:SYMBOL/data.json', function (req, res) {

console.time("total_request");
  fetch(`${QUANDL_API}/datasets/WIKI/${req.params.SYMBOL}/data.json?column_index=${req.query.column_index}&start_date=${req.query.start_date}&end_date=${req.query.end_date}${typeof req.query.collapse!=='undefined'?'&collapse='+req.query.collapse:''}&api_key=${QUANDL_KEY}`)
  .then(function(res) {
  console.time("convert_json");
      return res.json();
  }).then(function(body) {
        res.json(body);

console.timeEnd("convert_json");
console.timeEnd("total_request");
    }).catch(function(err) {
        console.log(err);
        res.json(err);
    });
})

app.listen(3009, function () {
  console.log('Listen on port: 3009!')
})
