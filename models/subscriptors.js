var dataBase = require('mongodb').Db;
var server   = require('mongodb').Server;

var port = 27017;
var host = 'localhost';
var name = 'mySuscribe';

var subscriber = {};

subscriber.db = new dataBase (name, new server(host, port, {auto_reconnect: true},{}));
subscriber.db.open(function(error) {
    if(error) {
        console.log(error);
    } else {
        console.log('Connected to database: ' + name);
    }
});

subscriber.subscribers = subscriber.db.collection('subscribers');

module.exports = subscriber;

subscriber.new = function Insert(newData, callBack) {
    subscriber.subscribers.findOne({email: newData.email}, function(error,object) {
        if(object) {
            callBack('Email already exist.');
        } else {
            subscriber.subscribers.insert(newData, callBack(null));
        }
    });
}

subscriber.list = function Show(callBack) {
    subscriber.subscribers.find().toArray(function(error,response) {
        if(error) {
            callBack(error);
        } else {
            callBack(null, response);
        }
    });
}

subscriber.edit = function Update(newData, callBack) {
    subscriber.subscribers.findOne({_id: this.getObjectId(newData.id)}, function(error,object) {
        object.name = newData.name;
        object.email = newData.email;
        subscriber.subscribers.save(object);
        callBack(object);
    });
}

subscriber.delete = function Erase(id, callBack) {
    subscriber.subscribers.remove({_id: this.getObjectId(id)},callBack);
}

subscriber.getObjectId = function GetId(id) {
    return subscriber.subscribers.db.bson_serializer.ObjectID.createFromHexString(id);
}