// Lean Poker scaffold (blob protocol). The croupier POSTs
// { action: 'bet_request', game, game_state } and expects { move, args } back.
// One strategy per game: edit the one your event uses.
const REVERSI_SIZE = 8;
const REVERSI_DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function gomokuMove(gameState) {
  const board = gameState.state && gameState.state.G && gameState.state.G.board;
  if (!Array.isArray(board)) return { move: 'place', args: [] };
  for (let index = 0; index < board.length; index++) {
    if (board[index] === null) return { move: 'place', args: [index] };
  }
  return { move: 'place', args: [] };
}

function reversiOpponent(player) {
  return player === '0' ? '1' : '0';
}

function reversiFlips(board, player, index) {
  if (board[index] !== null) return 0;
  const opponent = reversiOpponent(player);
  const row = Math.floor(index / REVERSI_SIZE);
  const col = index % REVERSI_SIZE;
  let flips = 0;
  for (const [dRow, dCol] of REVERSI_DIRECTIONS) {
    let r = row + dRow;
    let c = col + dCol;
    let line = 0;
    while (r >= 0 && r < REVERSI_SIZE && c >= 0 && c < REVERSI_SIZE && board[r * REVERSI_SIZE + c] === opponent) {
      line += 1;
      r += dRow;
      c += dCol;
    }
    if (line > 0 && r >= 0 && r < REVERSI_SIZE && c >= 0 && c < REVERSI_SIZE && board[r * REVERSI_SIZE + c] === player) {
      flips += line;
    }
  }
  return flips;
}

function reversiMove(gameState) {
  const { G, ctx } = gameState.state || {};
  const board = G && G.board;
  if (!Array.isArray(board)) return { move: 'pass' };
  const player = String(ctx && ctx.currentPlayer);
  for (let index = 0; index < board.length; index++) {
    if (board[index] === null && reversiFlips(board, player, index) > 0) {
      return { move: 'place', args: [index] };
    }
  }
  return { move: 'pass' };
}

function fourInARowMove(gameState) {
  const board = gameState.board || (gameState.state && gameState.state.G) || {};
  const cells = board.cells;
  const cols = board.cols || 7;
  if (!Array.isArray(cells)) return { move: 'dropDisc', args: [] };
  for (let col = 0; col < cols; col++) {
    if (cells[col] === null) return { move: 'dropDisc', args: [col] };
  }
  return { move: 'dropDisc', args: [] };
}

function holdemMove(gameState) {
  const players = gameState.players;
  const actor = Number(gameState.in_action);
  if (!Array.isArray(players) || !Number.isInteger(actor) || !players[actor]) {
    return { move: 'fold' };
  }
  const me = players[actor];
  const toCall = (gameState.current_buy_in || 0) - (me.bet || 0);
  if (toCall <= 0) return { move: 'check' };
  if ((me.stack || 0) > 0) return { move: 'call' };
  return { move: 'fold' };
}

const GAME_STRATEGIES = {
  gomoku: gomokuMove,
  reversi: reversiMove,
  'four-in-a-row': fourInARowMove,
  holdem: holdemMove,
};

class Player {
  static get VERSION() {
    return '0.3';
  }

  static betRequest(gameState, bet, game) {
    const gameName = game || (gameState && gameState.game);
    try {
      bet(GAME_STRATEGIES[gameName](gameState));
    } catch (e) {
      console.log(e);
      // Ill-formed blob: the croupier applies the game's safe default move.
      bet({});
    }
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
