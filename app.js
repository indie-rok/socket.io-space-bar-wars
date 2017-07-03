var express = require("express");
var app = express();

var http = require("http").Server(app);

var io = require("socket.io")(http);

var redis = require("redis");
var client = redis.createClient();

app.use('/public', express.static(__dirname + '/public'));

app.get("/", (req,res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.get("/team1", (req,res) => {
  res.sendFile(__dirname + '/public/team1.html');
})

app.get("/team2", (req,res) => {
  res.sendFile(__dirname + '/public/team2.html');
})

io.on("connection",() => {
  console.log("connected");
})


http.listen(8000,()=>console.log('working on 8000'));
