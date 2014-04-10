var NGram = function() {
  this.tokens = [];
  this.count = 0;
};

// adds a token to the existing array
NGram.prototype.addToken = function(token) {
  this.tokens.push(token);
  return this.tokens;
};

// clears the token list
NGram.prototype.clearTokens = function() {
  this.tokens = [];
  return this.tokens;
};

// returns a formatted string
NGram.prototype.toString = function() {
  return (this.tokens.join(" ") + " (" + this.count + ")");
};

module.exports = NGram;