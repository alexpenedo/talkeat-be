import * as mongoose from "mongoose";
import config from "./config";
import debug from 'debug';
import * as util from 'util';

export class DatabaseConnection {
    static async connect(): Promise<void> {
        await mongoose.connect(config.mongoHost);
        if (config.mongoDebug) {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
            });
        }
    }

}