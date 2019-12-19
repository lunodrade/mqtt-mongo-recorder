/**
 *
 * This NodeJS application listens to MQTT messages and records them to MongoDB
 *
 * @author  Dennis de Greef <github@link0.net>
 * @license MIT
 *
 */
var mongodb = require('mongodb');
var mqtt = require('mqtt');
var config = require('./config');

//Se o MongoDB tiver senha, então precisa ser o abaixo:
//var mqttUri  = 'mqtt://' config.mongodb.user + ':' config.mongodb.pass + '@' + config.mqtt.hostname + ':' + config.mqtt.port;
var mqttUri = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
var client = mqtt.connect(mqttUri);

client.on('connect', function () {
    client.subscribe(config.mqtt.namespace);
    console.log('conectado');
});

var mongoUri =
    'mongodb://' +
    config.mongodb.hostname +
    ':' +
    config.mongodb.port +
    '/' +
    config.mongodb.database;

mongodb.MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error, clientx) {
    console.log('a');

    if (error != null) {
        throw error;
    }

    var database = clientx.db(config.mongodb.database);
    var collection = database.collection(config.mongodb.collection);
    /*
    collection.createIndex({
        timestamp: -1
    });
    collection.createIndex({
        topic: 1
    });
    */

    client.on('message', function (topic, message) {
        var json = {};
        try {
            json = JSON.parse(String(message));
        } catch (e) {
            console.log(e);
        }
        /////////////////////////////// Config Msg format ///////////////////////////////
        var messageObject = {
            timestamp: new Date().toString(), //mongo _id já tem timestamp incluso 
            //msg: message.toString(), //when not using json format         
            //topic: topic
        };
        //Json format
        // strrepl = String(config.mqtt.namespace).replace('#', '');
        // key = topic.replace(strrepl, '').replace('/json', '');
        // messageObject[key] = json;
        messageObject[topic] = json;
        ////////Eg:
        // → mosquitto_pub -m "{ \"age\": 35 }" -t "/MIGRA/0000001/json"
        //
        //------------ result:
        //
        // _id: ObjectId("5ce425b7aec5d32068435afd")
        // ts: 2019-05-21T16:22:15.854+00:00
        // topic: "/MIGRA/0000001/json"
        // 0000001: JSON {
        //    age: 45,
        //    nome: "fulano"
        // }
        //////////////////////////////////////////////////////////////////////////////////

        collection.insertOne(messageObject, function (error, result) {
            if (error != null) {
                console.log('ERROR: ' + error);
            }
        });
    });
});
