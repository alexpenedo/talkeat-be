import * as request from 'supertest';
import {Response} from 'supertest';
import {User} from "../../../src/modules/users/domain/user";
import TestUtil from "../test-util";
import * as bcrypt from "bcrypt";

describe('Auth Controller test', () => {
    let server;
    beforeAll(async () => {
        server = await TestUtil.run();
    });

    it(`/POST login`, async () => {
        const password = 'testPassword';
        const encryptedPassword = bcrypt.hashSync(password, 10);
        const user: User = await TestUtil.userBuilder().withValidData().withPassword(encryptedPassword).store();
        const credentials = {
            email: user.email,
            password
        };
        const response: Response = await request(server)
            .post('/auth/login')
            .send(credentials);
        expect(response.status).toBe(201);
    });

    afterAll(async () => {
        await server.close();
    });
});
