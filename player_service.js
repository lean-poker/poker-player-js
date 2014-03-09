var player = require('./player');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res){
  res.send(200, 'OK')
});

app.post('/', function(req, res){
  if(req.body.action == 'bet_request') {
    res.send(200, player.bet_request(req.body.game_state).toString());
  } else if(req.body.action == 'showdown') {
    player.showdown(req.body.game_state);
    res.send(200, 'OK');
  } else if(req.body.action == 'version') {
    res.send(200, player.VERSION);
  } else {
    res.send(200, 'OK')
  }

});

port = 1337;
app.listen(port);
console.log('Listening at http://localhost:' + port)
