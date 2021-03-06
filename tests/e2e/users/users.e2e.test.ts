import * as request from 'supertest';
import {Response} from 'supertest';
import {User} from "../../../src/modules/users/domain/user";
import TestRunner from "../../utils/test-runner";
import {clearDatabase, getToken} from "../../utils/test-utils";
import {userBuilder} from "../../utils/test-builders";

describe('Users Controller Test', async () => {
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

    it(`/POST users`, async () => {
        const user: User = userBuilder().withValidData().build();
        const response: Response = await request(server)
            .post('/users')
            .send(user);
        expect(response.status).toBe(201);
        const responseUser = <User>response.body;
        expect(user.name).toEqual(responseUser.name);
        expect(user.email).toEqual(responseUser.email);
        expect(user.mobileNumber).toEqual(responseUser.mobileNumber);
        expect(responseUser._id).toBeDefined();
    });

    it(`/GET userById`, async () => {
        const user: User = await userBuilder().withValidData().store();
        const token = await getToken(user);
        const response: Response = await request(server)
            .get(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const responseUser = response.body as User;
        expect(user.name).toEqual(responseUser.name);
        expect(user.email).toEqual(responseUser.email);
        expect(user.mobileNumber).toEqual(responseUser.mobileNumber);
        expect(responseUser._id).toEqual(user._id);
    });

    it(`/PUT userById`, async () => {
        const user: User = await userBuilder().withValidData().store();
        const token = await getToken(user);
        const userEdited: User = userBuilder().withValidData().withEmail(user.email).build();
        const response: Response = await request(server)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(userEdited);
        expect(response.status).toBe(200);
        const responseUser = response.body as User;
        expect(userEdited.name).toEqual(responseUser.name);
        expect(userEdited.email).toEqual(responseUser.email);
        expect(userEdited.mobileNumber).toEqual(responseUser.mobileNumber);
        expect(responseUser._id).toEqual(user._id);
    });
});
