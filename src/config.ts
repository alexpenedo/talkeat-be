// import * as Joi from 'joi';
// import * as dotenv from "dotenv";
//
// class Config {
//     envVars: any;
//
//     constructor() {
//         this.config();
//     }
//
//     private config() {
//         dotenv.config();
//         const envVarsSchema = Joi.object({
//             NODE_ENV: Joi.string()
//                 .allow(['development', 'production', 'test', 'provision'])
//                 .default('development'),
//             PORT: Joi.number()
//                 .default(3977),
//             MONGOOSE_DEBUG: Joi.boolean()
//                 .when('NODE_ENV', {
//                     is: Joi.string().equal('development'),
//                     then: Joi.boolean().default(true),
//                     otherwise: Joi.boolean().default(false)
//                 }),
//             JWT_SECRET: Joi.string().required()
//                 .description('JWT Secret required to sign'),
//             ACCESS_TOKEN_EXPIRES:Joi.string().required()
//                 .description('Expiration time token'),
//             REFRESH_TOKEN_EXPIRES:Joi.string().required()
//                 .description('Refresh time token'),
//             MONGO_HOST: Joi.string().required()
//                 .description('Mongo DB host url'),
//             MONGO_PORT: Joi.number()
//                 .default(27017)
//         }).unknown()
//             .required();
//         const {error, value: envVars} = Joi.validate(process.env, envVarsSchema);
//         if (error) {
//             throw new Error(`Config validation error: ${error.message}`);
//         } else {
//             this.envVars = envVars;
//         }
//     }
//
//     get env() {
//         return this.envVars.NODE_ENV;
//     }
//
//     get isDevelopmentEnv(){
//         return this.env==='dev';
//     }
//
//     get port() {
//         return this.envVars.PORT;
//     }
//
//     get jwtSecret() {
//         return this.envVars.JWT_SECRET;
//     }
//
//     get accessTokenExpires(){
//         return this.envVars.ACCESS_TOKEN_EXPIRES;
//     }
//
//     get refreshTokenExpires(){
//         return this.envVars.REFRESH_TOKEN_EXPIRES;
//     }
//
//     get mongoHost() {
//         return this.envVars.MONGO_HOST;
//     }
//
//     get mongoPort() {
//         return this.envVars.MONGO_PORT;
//     }
//
//     get mongoSchema() {
//         return this.envVars.MONGO_SCHEMA;
//     }
//
//     get mongoDebug() {
//         return this.envVars.MONGOOSE_DEBUG;
//     }
//     get bcryptSaltRounds(){
//         return 10;
//     }
// }
//
// export default new Config();