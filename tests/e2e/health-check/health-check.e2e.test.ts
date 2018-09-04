import * as request from 'supertest';
import {Response} from 'supertest';
import TestRunner from "../../utils/test-runner";
import {clearDatabase} from "../../utils/test-utils";

describe('HealthCheck Controller Test', async () => {
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
    it(`/GET health-check: should return OK`, async () => {
        const response: Response = await request(server)
            .get('/status');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });
});
