var express = require("express");
var app = express();

var http = require("http").Server(app);

var io = require("socket.io")(http);

var redis = require("redis");
var client = redis.createClient();

client.on('connect',()=>{
  client.set('game:scoreToWin',10);
  client.set('game:team-1-score',5);
  client.set('game:team-2-score',5);
});

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



io.on("connection",(socket) => {

  socket.on("team 1 press",()=>{
    client.incr('game-team-1-score', (err,score) => {
      io.sockets.emit('update score', getCurrentScore());
    })
  })
})

function getCurrentScore(){



  client.get("game:scoreToWin", (err,score) => gameData.scoreToWin = score );

  client.get('game:team-1-score', (err,score) => gameData.scoreA = score);

  client.get('game:team-2-score', (err,score) => gameData.scoreB = score);


};


http.listen(8000,()=>console.log('working on 8000'));
