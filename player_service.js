const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

// create express app
const app = express();
// port
const port = parseInt((process.env.PORT || 1337), 10);
// create player
const Player = require('./Player');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const { action, game_state } = req.body;
  // game_state need to parsed, because it is sent via from-urlencoded
  const parsedGameState = JSON.parse(game_state);

  switch (action) {
    case 'version':
      res.json(Player.getVersion());
      break;
    case 'bet_request':
      res.json(Player.betRequest(parsedGameState));
      break;
    case 'showdown':
      Player.showdown(parsedGameState);
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
