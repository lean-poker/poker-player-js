var assert = require("assert")
var Player = require('../Player')

describe("Player", function() {
  describe("#bet_request", function() {
    it("should return a number", function() {
      assert.equal(typeof(Player.betRequest('{}')), "number")
    })
  })
})
