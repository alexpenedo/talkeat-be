import {ConfigService} from "../config/config.service";
import {Injectable} from "@nestjs/common";
import * as fs from 'fs';

const {Storage} = require('@google-cloud/storage');

@Injectable()
export class StorageService {
    private bucketName: string;
    private storage;

    constructor(private readonly config: ConfigService) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = config.googleCredentials;
        this.bucketName = config.bucketName;
        this.storage = new Storage();
    }

    async uploadFile(filename) {
        await this.storage.bucket(this.bucketName).upload(filename);
        fs.unlinkSync(filename);
    }

    async getFile(filename) {
        await this.storage.bucket(this.bucketName).file(filename).download({
            destination: `${this.config.tmpFolder}${filename}`
        });
    }
}
