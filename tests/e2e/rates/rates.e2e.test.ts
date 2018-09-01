import * as request from 'supertest';
import * as faker from 'faker';
import * as _ from 'lodash';

import {Response} from 'supertest';
import {User} from "../../../src/modules/users/domain/user";
import {Menu} from "../../../src/modules/menus/domain/menu";
import TestUtil from "../test-util";
import {Booking} from "../../../src/modules/bookings/domain/booking";
import {Status} from "../../../src/common/enums/status.enum";
import {Rate} from "../../../src/modules/rates/domain/rate";

describe('Rates Controller Test', async () => {
    let server;
    beforeEach(async (done) => {
        server = await TestUtil.run();
        done();
    });
    afterEach(async (done) => {
        await TestUtil.clearDatabase();
        await server.close();
        done();
    });
    it(`/POST rate: should create rate`, async () => {
        const rate: Rate = await TestUtil.rateBuilder().withValidData().build();
        const token = await TestUtil.getToken();
        const response: Response = await request(server)
            .post('/rates')
            .send(rate)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const rateResponse = response.body as Rate;
        expect(rateResponse.rate).toBe(rateResponse.rate);
        expect(rateResponse.comment).toBe(rateResponse.comment);
    });
});
