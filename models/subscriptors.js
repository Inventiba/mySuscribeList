var dataBase = require('mongodb').Db;
var server = require('mongodb').Server;

var port = 27017;
var host = 'localhost';
var name = 'mySuscribe';

var subscriber = {};

subscriber.db = new dataBase (name, new server(host, port, {auto_reconnect: true},{}));
subscriber.db.open(function(e,d) {
	if(e) {
		console.log(e)
	} else {
		console.log('Connected to database: ' + name);
	}
});

subscriber.subscribers = subscriber.db.collection('subscribers');

module.exports = subscriber;

subscriber.new = function Insert(newData, callback) {
	subscriber.subscribers.findOne({email: newData.email}, function(e,obj) {
		if(obj) {
			callback('Email already exist.');
		} else {
			subscriber.subscribers.insert(newData, callback(null))
		}
	})
}

subscriber.list = function Show(callback) {
	subscriber.subscribers.find().toArray(function(e,res) {
		if(e) {
			callback(e)
		} else {
			callback(null, res)
		}
	})
}

subscriber.edit = function Update(newData, callback) {
	subscriber.subscribers.findOne({_id: this.getObjectId(newData.id)}, function(e,o) {
		o.name = newData.name;
		o.email = newData.email;
		subscriber.subscribers.save(o);
		callback(o);
	})
}

subscriber.delete = function Erase(id, callback) {
	subscriber.subscribers.remove({_id: this.getObjectId(id)},callback)
}

subscriber.getObjectId = function GetId(id) {
	return subscriber.subscribers.db.bson_serializer.ObjectID.createFromHexString(id)
}