import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import {EnvConfig} from "./interfaces/env-config.interface";

export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.config({path: filePath});
        this.envConfig = this.validateInput(config.parsed);
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
        return process.env.PORT;
    }

    get jwtSecret() {
        return process.env.JWT_SECRET;
    }

    get accessTokenExpires() {
        return process.env.ACCESS_TOKEN_EXPIRES;
    }

    get refreshTokenExpires() {
        return process.env.REFRESH_TOKEN_EXPIRES;
    }

    get mongoUri() {
        return process.env.MONGO_URI;
    }

    get mongoDebug() {
        return process.env.MONGOOSE_DEBUG;
    }

    get bcryptSaltRounds() {
        return 10;
    }

    get googleCredentials() {
        return process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    get bucketName() {
        return process.env.BUCKET_NAME;
    }

    get tmpFolder() {
        return process.env.TMP_FOLDER;
    }

    get redisHost() {
        return process.env.REDIS_HOST;
    }

    get redisPort() {
        return process.env.REDIS_PORT;
    }

    get demo() {
        return process.env.DEMO;
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
            REDIS_PORT: Joi.string(),
            DEMO: Joi.boolean()
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