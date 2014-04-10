var NGrams = function() {
  this.items = [];
};

// adds an item to the list of ngrams ensuring uniqueness and count occurrences
NGrams.prototype.add = function(ngram) {
  // do we have an ngram object with tokens?
  if(ngram.tokens.length > 0) {
    var aTokenString = ngram.tokens.join();
    var exists = this.items.filter(function(ng) {
      return ng.tokens.join() == aTokenString;
    });

    // does the ngram already exist?        
    if(exists.length > 0) {
      exists[0].count++;          
    }
    else {
      ngram.count++;
      this.items.push(ngram);
    }
  }  
  return this.items;
};

// sorts the ngrams first by number of tokens/words, then alphabetically
NGrams.prototype.sort = function() {
  return this.items.sort(function(a, b) {
    var aTokenLength = a.tokens.length;
    var aTokenString = a.tokens.join();
    var bTokenLength = b.tokens.length;    
    var bTokenString = b.tokens.join();
        
    return (2 * (aTokenLength > bTokenLength ? 1 : aTokenLength < bTokenLength ? -1 : 0) + 1 * (aTokenString > bTokenString ? 1 : aTokenString < bTokenString ? -1 : 0));
  });
};

module.exports = NGrams;