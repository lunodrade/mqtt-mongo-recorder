mqtt-mongo-recorder
===========

This NodeJS application listens to MQTT messages and records them to MongoDB

Instalattion
=======

Windows environment
* Install [NodeJS](https://nodejs.org/en/)  LTS version
* Install [Mosquitto](https://mosquitto.org/download/) binary

Usage
=======

Clone the repository
```bash
$ git clone https://github.com/lunodrade/mqtt-mongo-recorder.git
$ cd mqtt-mongo-recorder
$ npm install
```

Start up the server by editing the config.js first to suit your needs
```bash
$ $EDITOR config.js
$ node server.js
```

Or by using environment variables
```bash
$ MQTT_HOSTNAME="192.168.0.1" node server.js
```

Publish some MQTT messages to try it out (I use mosquitto server for this, but whatever MQTT server should work -- windows with mosquitto need slash escape)
```bash
$ mosquitto_pub -m "{ \"age\": 35, \"nome\": \"fulano\" }" -t "/MIGRA/0000001"
```

In the file Config.js at line `config.mqtt.namespace` you can configure subscribe filter, eg:
```bash
→ config.mqtt.namespace = "#"
mosquitto_pub -m "{ \"age\": 35 }" -t "0000001"
```
```bash
→ config.mqtt.namespace = "/MIGRA/#"
mosquitto_pub -m "{ \"age\": 35 }" -t "/MIGRA/0000001"
```

Let's see what's in here (or use Mongo Compass to visualize)
```bash
$ mongo
> use mqtt
> db.mqtt.find();
```

Error handling
=======

> Error: No connection could be made because the target machine actively refused them

Execute `mosquitto -d` on another prompt.


