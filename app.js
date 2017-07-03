var express = require("express");
var app = express();

var http = require("http").Server(app);

var io = require("socket.io")(http);

var redis = require("redis");
var client = redis.createClient(process.env.REDIS_URL || null);

client.on('connect',()=>{
  client.set('game:scoreToWin',10);
  client.set('game:team-1-score',5);
  client.set('game:team-2-score',5);
})

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
  getCurrentScore( (currentScore)=>io.sockets.emit('update score', currentScore) )

  socket.on("keypress",() => {
    getCurrentScore( (gameData) => {
      if(parseInt(gameData.scoreA) >= parseInt(gameData.scoreToWin)){
        io.sockets.emit('game end',"team a")
      }
      else if (parseInt(gameData.scoreB) >= parseInt(gameData.scoreToWin)) {
        io.sockets.emit('game end',"team b")
      }
    });
  });

  socket.on("team 1 press",()=>{
    client.incr('game:team-1-score');
    client.decr('game:team-2-score')
    getCurrentScore( (currentScore)=>io.sockets.emit('update score', currentScore) )
  })

  socket.on("team 2 press",()=>{
    client.incr('game:team-2-score');
    client.decr('game:team-1-score')
    getCurrentScore( (currentScore)=>io.sockets.emit('update score', currentScore) )
  })

})

function getCurrentScore(callback){
  let gameData = {};
  client.get("game:scoreToWin", (err,score) => {
    gameData.scoreToWin = score;
    client.get('game:team-1-score', (err,scoreA) => {
      gameData.scoreA = scoreA;
      client.get('game:team-2-score', (err,scoreB) => {
        gameData.scoreB = scoreB;
        callback(gameData);
      });
    });
  });
}

http.listen(process.env.PORT|| 8000,()=>console.log('working on 8000'));
