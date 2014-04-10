var NGram = require("./ngram");
var NGrams = require("./ngrams");

// text: the text of the document
var Document = function(text) {
  this.text = text;
};

// tokenizes a string
Document.prototype._tokenize = function(text, stopWords) {
    return this._removeItems(text.replace(/[^a-zA-Z'\-]+/g, " ").replace(/^\s+/,"").replace(/\s+$/,"").split(/\s+/), stopWords).map(function(word) {
        return word.toLowerCase();
    });
};

// removes all items passed found in an array
// removeItems: array of items to remove
Document.prototype._removeItems = function(array, removeItems) {
    if(removeItems) {
        return array.filter(function(item) {
            return (removeItems.indexOf(item) < 0);
        });    
    }
    return array;
};

// extracts n-grams
// max: max number/level of n-grams to acquire
// stopWords: array of words to ignore when extracting n-grams
Document.prototype.ngram = function(max, stopWords) {
  // tokenize and sanatize the document text
  var tokens = this._tokenize(this.text, stopWords);  
  var ngrams = new NGrams();
  
  // iterate to the max number of desired ngrams
  for(var d = 0; d < (max + 1); d++) {
    for(var t = 0; t < tokens.length; t++) {
      var ngram = new NGram();
    
      // iterate the tokens to get the aquired ngrams based on the current max depth
      for(var i = 0; i < d; i++) {    

        // if we haven't reached the end of the tokens keep adding;
        if(tokens[t + i]) {
          ngram.addToken(tokens[t + i]);
        }
        // otherwise; clear the tokens      
        else {
          ngram.clearTokens();
        }
      }    
      ngrams.add(ngram);    
    }
  }  

  // return the sorted ngrams
  return ngrams.sort();
};

module.exports = Document;