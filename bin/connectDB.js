var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://user:pass@ds057862.mongolab.com:57862/couchtube';
var db = null;

module.exports = function(callback) {
	// if database reference exists
	if(db) {
		callback(db);
		return;
	}
	// else if doesn't exists
	MongoClient.connect(mongoURI, function(err, connection) {
	  if(err) {
	  	console.log('Error connecting to database');
	  	throw err;
	  } else {
	  	db = connection;
	  	callback(db);
	  }
	});
}

//http://stackoverflow.com/questions/18005379/use-global-variable-to-share-db-between-module