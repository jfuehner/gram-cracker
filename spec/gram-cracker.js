var assert = require("assert");
var gram_cracker = require("../gram-cracker");
var should = require("should");
var _ = require("underscore");

describe("gram-cracker", function() {
    beforeEach(function(done){
        new gram_cracker().clearDocuments().then(function(docs) {
           done(); 
        });  
    });
    
    describe("#constructor", function() {
        it("should have 0 documents", function(done) {
            new gram_cracker().getDocuments().then(function(docs) {
                docs.should.have.length(0);
                
                done();
            });
        });
    
        it("should have 1 document", function(done) {
            new gram_cracker("My test test document").getDocuments().then(function(docs) {
                docs.should.have.length(1);
    
                done();
            });
        });
        
        it("should have 2 documents", function(done) {
            new gram_cracker([
                "My first document", 
                "My second document"
            ]).getDocuments().then(function(docs) {
                docs.should.have.length(2);
    
                done();
            });
        });        
    });    
        
    describe("#getDocuments", function() {
        it("should have 0 documents", function(done) {
            new gram_cracker().getDocuments().then(function(docs) {
                docs.should.have.length(0);
                
                done();
            });
        });
    
        it("should have 1 document", function(done) {
            new gram_cracker().addDocument("My test test document").then(function(docs) {
                docs.should.have.length(1);
    
                var firstDoc = _.first(docs);
                firstDoc.should.have.property("text");
                firstDoc.text.should.equal("My test test document");
                
                done();
            });
        });
    });
    
    describe("#addDocuments", function() {
        it("should have 1 document", function(done) {
            new gram_cracker().addDocument("My test document").then(function(docs) {
                docs.should.have.length(1);
                
                done();
            });
        });
        
        it("should have 2 document", function(done) {
            new gram_cracker().addDocuments([
                "Yellow",
                "My test document"                
            ]).then(function(docs) {
                docs.should.have.length(2);
                
                done();
            });
        });    
    });
    
    describe("#clearDocuments", function() {
        it("should have 0 document", function(done) {
            var gram = new gram_cracker();
            
            gram.addDocument("My test document").then(function(docs) {
                docs.should.have.length(1);
                
                gram.clearDocuments().then(function(docs) {
                    docs.should.have.length(0);
                
                    done();
                });
            });    
        });    
    });
    
    describe("#extract", function() {
        
        it("should have 1 document and extract unigrams/bigrams", function(done) {
            var gram = new gram_cracker();
            gram.addDocument("The quick brown fox jumps over the lazy dog.")
                .then(function(docs) {
                    docs.should.have.length(1);
                    
                    gram.extract(2).then(function(ngrams) {
                        should.exist(ngrams);
                        
                        var firstDocElem = _.first(ngrams);
                        firstDocElem.should.have.property("tokens");
                        firstDocElem.should.have.property("count");                        

                        done();
                    });                
                });
        });
        
        it("should have 2 documents", function(done) {
            var gram = new gram_cracker();
            gram.addDocuments([
                    "The quick brown fox jumps over the lazy dog.",
                    "Being bounced around quickly annoyed the disheveled taxi drivers."
                ])
                .then(function(docs) {
                    docs.should.have.length(2);
                    
                    gram.extract(2).then(function(ngrams) {
                        should.exist(ngrams);
                        
                        var firstDocElem = _.first(ngrams);
                        firstDocElem.should.have.property("tokens");
                        firstDocElem.should.have.property("count");   

                        done();
                    });                
                });
        });    
        
        it("should have 2 documents and extract unigrams/bigrams filtering out stop words", function(done) {
            var gram = new gram_cracker();
            gram.addDocuments([
                    "The quick brown fox jumps over the lazy dog.",
                    "Being bounced around quickly annoyed the disheveled taxi drivers."
                ])
                .then(function(docs) {
                    docs.should.have.length(2);
                    
                    var stopWords = ["a", "the"];
                    
                    gram.extract(2, stopWords).then(function(ngrams) {
                        should.exist(ngrams);
                        
                        var firstDocElem = _.first(ngrams);
                        firstDocElem.should.have.property("tokens");
                        firstDocElem.should.have.property("count");   
                        
                        // test to ensure none of the stop words are in the token list
                        _.each(ngrams, function(ngram) {
                           ngram.should.not.containDeep(stopWords);
                        });

                        done();
                    });                
                });
        });                
    });
});

