const PLAYER_VERSION = '0.1';

class Player {
  static getVersion() {
    return PLAYER_VERSION;
  }

  static betRequest(gameState) {
    // implement bet request logic here
    return 0;
  }

  static showdown(gameState) {
    // implement showdown logic here
  }
}

module.exports = Player;
