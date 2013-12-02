var dataBase = require('mongodb').Db;
var server = require('mongodb').Server;

var port = 27017;
var host = 'localhost';
var name = 'mySuscribe';

var subscriptor = {};

subscriptor.db = new dataBase (name, new server(host, port, {auto_reconnect: true},{}));
subscriptor.db.open(function(e,d) {
	if(e) {
		console.log(e)
	} else {
		console.log('Conectado a la base de datos: ' + name);
	}
});

subscriptor.subscriptors = subscriptor.db.collection('subscriptors');

module.exports = subscriptor;

subscriptor.new = function(newData, callback) {
	subscriptor.subscriptors.findOne({email: newData.email}, function(e,obj) {
		if(obj) {
			callback('Ese email ya existe.');
		} else {
			subscriptor.subscriptors.insert(newData, callback(null))
		}
	})
}

subscriptor.list = function(callback) {
	subscriptor.subscriptors.find().toArray(function(e,res){
		if(e) {
			callback(e)
		} else {
			callback(null, res)
		}
	})
}

subscriptor.edit = function(newData, callback) {
	subscriptor.subscriptors.findOne({_id: this.getObjectId(newData.id)}, function(e,o) {
		o.name = newData.name;
		o.email = newData.email;
		subscriptor.subscriptors.save(o);
		callback(o);
	})
}

subscriptor.delete = function(id, callback) {
	subscriptor.subscriptors.remove({_id: this.getObjectId(id)},callback)
}

subscriptor.getObjectId = function(id) {
	return subscriptor.subscriptors.db.bson_serializer.ObjectID.createFromHexString(id)
}