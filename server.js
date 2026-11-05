const express = require('express');
const http = require('http');

const app = express();
const port = parseInt((process.env.PORT || 1337), 10);
const Player = require('./Player');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const { action, game, game_state: gameState } = req.body;

  switch (action) {
    case 'version':
      res.send(Player.VERSION);
      break;
    case 'bet_request':
      try {
        Player.betRequest(JSON.parse(gameState), (blob) => res.json(blob), game);
      } catch (e) {
        console.log(e);
        res.json({});
      }
      break;
    case 'showdown':
      try {
        Player.showdown(JSON.parse(gameState));
      } catch (e) {
        console.log(e);
      }
      res.send('Ok');
      break;
    case 'check':
      res.send('Ok');
      break;
    default:
      res.send('Unknown action');
  }
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server listening at: localhost:${port}`);
});
