import * as request from 'supertest';
import {Response} from 'supertest';
import {User} from "../../../src/modules/users/domain/user";
import TestRunner from "../../utils/test-runner";
import * as bcrypt from "bcrypt";
import * as faker from "faker";
import {clearDatabase} from "../../utils/test-utils";
import {userBuilder} from "../../utils/test-builders";
import {LoginResponse} from "../../../src/modules/auth/dto/login-response";

describe('Auth Controller test', async () => {
    let server;
    beforeEach(async (done) => {
        server = await TestRunner.run();
        done();
    });
    afterEach(async (done) => {
        await clearDatabase();
        await server.close();
        done();
    });
    it(`/POST login`, async () => {
        const password = 'testPassword';
        const encryptedPassword = bcrypt.hashSync(password, 10);
        const user: User = await userBuilder().withValidData().withPassword(encryptedPassword).store();
        const credentials = {
            email: user.email,
            password
        };
        const response: Response = await request(server)
            .post('/auth/login')
            .send(credentials);
        expect(response.status).toBe(201);

        const loginResponse: LoginResponse = response.body as LoginResponse;
        expect(loginResponse.user._id).toBe(user._id);
        expect(loginResponse.tokens.accessToken).toBeDefined();
        expect(loginResponse.tokens.refreshToken).toBeDefined();
    });

    it(`/POST login userNotFound`, async () => {
        const password = 'testPassword';
        const credentials = {
            email: faker.internet.email(),
            password
        };
        const response: Response = await request(server)
            .post('/auth/login')
            .send(credentials);
        expect(response.status).toBe(404);
    });

    it(`/POST login incorrectPassword`, async () => {
        const password = 'testPassword';
        const encryptedPassword = bcrypt.hashSync(password, 10);
        const user: User = await userBuilder().withValidData().withPassword(encryptedPassword).store();
        const credentials = {
            email: user.email,
            password: 'incorrect'
        };
        const response: Response = await request(server)
            .post('/auth/login')
            .send(credentials);
        expect(response.status).toBe(400);
    });

    it(`/POST refreshToken`, async () => {
        const password = 'testPassword';
        const encryptedPassword = bcrypt.hashSync(password, 10);
        const user: User = await userBuilder().withValidData().withPassword(encryptedPassword).store();
        const credentials = {
            email: user.email,
            password
        };
        const responseLogin: Response = await request(server)
            .post('/auth/login')
            .send(credentials);
        const refreshToken = responseLogin.body.tokens.refreshToken;
        const response: Response = await request(server)
            .post('/auth/refresh-token')
            .send({refreshToken});

        expect(response.status).toBe(201);
    });

});
