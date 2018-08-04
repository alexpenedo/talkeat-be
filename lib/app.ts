import * as express from "express";
import * as bodyParser from "body-parser";
import * as  logger from 'morgan';
import * as  cookieParser from 'cookie-parser';
import * as  compress from 'compression';
import * as  methodOverride from 'method-override';
import * as  cors from 'cors';
import * as  httpStatus from 'http-status';
import * as  expressValidation from 'express-validation';
import * as  helmet from 'helmet';
import * as  APIError from '../utils/APIError';
import config from "../config/config";
import {RouterBase} from "../routes/index.route";
import {DatabaseConnection} from "../config/database";

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.configExpress();
        DatabaseConnection.connect();
    }

    private configExpress(): void {
        if (config.env === 'development') {
            this.app.use(logger('dev'));
        }

        // parse body params and attache them to req.body
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.use(cookieParser());
        this.app.use(compress());
        this.app.use(methodOverride());

        // secure apps by setting various HTTP headers
        this.app.use(helmet());

        // enable CORS - Cross Origin Resource Sharing
        this.app.use(cors());

        // mount all routes on /api path
        this.app.use('/api', RouterBase.routes());

        // if error is not an instanceOf APIError, convert it.
        this.app.use((err, req, res, next) => {
            if (err instanceof expressValidation.ValidationError) {
                // validation error contains errors which is an array of error each containing message[]
                const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
                const error = new APIError(unifiedErrorMessage, err.status, true);
                return next(error);
            } else if (!(err instanceof APIError)) {
                const apiError = new APIError(err.message, err.status, err.isPublic);
                return next(apiError);
            }
            return next(err);
        });

        // catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            const err = new APIError('API not found', httpStatus.NOT_FOUND);
            return next(err);
        });


        // error handler, send stacktrace only during development
        this.app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
                console.error(err);
                res.status(err.status).json({
                    message: err.isPublic ? err.message : httpStatus[err.status],
                    stack: config.env === 'development' ? err.stack : {}
                })
            }
        );
    }
}

export default new App().app;
