var q = require("q");
var _ = require("underscore");
var document = require("./models/document");

var GramCracker = function(docs) {
    this.docs = [];
    this.addDocuments(docs);
};

GramCracker.prototype.addDocument = function(doc) {
    var that = this;
    var def = q.defer();
    
    if(doc) {
        if(doc instanceof document) {
            that.docs.push(doc);                      
        }
        else {
            that.docs.push(new document(doc));                      
        }
    }
    
    def.resolve(that.docs);;            
    
    return def.promise;
};

GramCracker.prototype.addDocuments = function(docs) {
    var that = this;
    var def = q.defer();
    
    if(docs) {
        _.chain([docs]).flatten().each(function(doc) {
            that.addDocument(doc);
        });
    }
    def.resolve(that.docs);
    
    return def.promise;
};

GramCracker.prototype.clearDocuments = function() {
    var that = this;
    var def = q.defer();
    
    that.docs = [];
    def.resolve(that.docs);
    
    return def.promise;
};

GramCracker.prototype.getDocuments = function() {
    var that = this;
    var def = q.defer();
    
    def.resolve(that.docs);
    
    return def.promise;
};
    
// extracts n-grams
// max: max number/level of n-grams to acquire
// stopWords: array of words to ignore when extracting n-grams    
GramCracker.prototype.extract = function(max, stopWords) {
    var that = this;
    var def = q.defer();
    
    var ngrams = [];
    _.each(that.docs, function(doc) {
        ngrams.push(doc.ngram(max, stopWords));
    });
    
    def.resolve(_.flatten(ngrams));
    
    return def.promise;
};

module.exports = GramCracker;