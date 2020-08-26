var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express();
var services = require('./services.js')

app.use(cors())
app.use(bodyParser.json({ limit: '200mb', type: 'application/json', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true, parameterLimit: 500000 }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
    console.log('Time:', new Date())
    next()
})

app.get('/api/user', services.getUsersData);

const port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    server.timeout = 0
    console.log("process Id - " + process.pid)
    console.log("app running on port.", server.address().port);
});