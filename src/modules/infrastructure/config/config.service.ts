import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import {EnvConfig} from "./interfaces/env-config.interface";

export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = this.validateInput(config);
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    get env() {
        return this.envConfig.NODE_ENV;
    }

    get isDevelopmentEnv() {
        return this.env === 'development';
    }

    get port() {
        return this.envConfig.PORT;
    }

    get jwtSecret() {
        return this.envConfig.JWT_SECRET;
    }

    get accessTokenExpires() {
        return this.envConfig.ACCESS_TOKEN_EXPIRES;
    }

    get refreshTokenExpires() {
        return this.envConfig.REFRESH_TOKEN_EXPIRES;
    }

    get mongoUri() {
        return this.envConfig.MONGO_URI;
    }

    get mongoDebug() {
        return this.envConfig.MONGOOSE_DEBUG;
    }

    get bcryptSaltRounds() {
        return 10;
    }

    get googleCredentials() {
        return this.envConfig.GOOGLE_APPLICATION_CREDENTIALS;
    }

    get bucketName() {
        return this.envConfig.BUCKET_NAME;
    }

    get tmpFolder() {
        return this.envConfig.TMP_FOLDER;
    }

    get redisHost() {
        return this.envConfig.REDIS_HOST;
    }

    get redisPort() {
        return this.envConfig.REDIS_PORT;
    }

    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema = Joi.object({
            NODE_ENV: Joi.string()
                .allow(['development', 'production', 'test', 'provision'])
                .default('development'),
            PORT: Joi.number()
                .default(3977),
            MONGOOSE_DEBUG: Joi.boolean()
                .when('NODE_ENV', {
                    is: Joi.string().equal('development'),
                    then: Joi.boolean().default(true),
                    otherwise: Joi.boolean().default(false)
                }),
            JWT_SECRET: Joi.string().required()
                .description('JWT Secret required to sign'),
            ACCESS_TOKEN_EXPIRES: Joi.string().required()
                .description('Expiration time token'),
            REFRESH_TOKEN_EXPIRES: Joi.string().required()
                .description('Refresh time token'),
            MONGO_URI: Joi.string().required()
                .description('Mongo DB uri'),
            GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
            BUCKET_NAME: Joi.string().required(),
            TMP_FOLDER: Joi.string().required(),
            REDIS_HOST: Joi.string(),
            REDIS_PORT: Joi.string()
        });
        const {error, value: validatedEnvConfig} = Joi.validate(
            envConfig,
            envVarsSchema,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
}