import mongoose from 'mongoose';
import util from 'util';
import http from 'http';
import SocketIO from 'socket.io';


// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { useMongoClient: true });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

//socket.io
let server = http.Server(app);
let io = new SocketIO(server);

io.on('connection', (socket) => {
    console.log(socket);
    console.info("connection io");
});

// listen on port config.port
server.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
});

export default app;
