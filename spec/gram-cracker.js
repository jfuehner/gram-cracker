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
            gram.addDocument("A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu, killing at least 15 people while dozens wounded, witnesses said.  The car bomb went off near the hotel in Hamar-weyne district, which is the base of tens of Somali Parliamentarians and government officials. All casualties were confirmed to be civilians and MPs. A suicide car bomb exploded near Hotel Muna in Mogadishu. At least 15 people died while more than 25 others, including two members of parliament, were injured in the blast. Al Shabaab claimed responsibility for the explosion, saying it used a car to carry out the explosion. A number of government officials arrived at the scene of the explosion and confirmed that a car laden with explosive devices had exploded.")
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
                    "A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu, killing at least 15 people while dozens wounded, witnesses said.",
                    "The car bomb went off near the hotel in Hamar-weyne district, which is the base of tens of Somali Parliamentarians and government officials."
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
                    "A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu, killing at least 15 people while dozens wounded, witnesses said.",
                    "The car bomb went off near the hotel in Hamar-weyne district, which is the base of tens of Somali Parliamentarians and government officials."
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

