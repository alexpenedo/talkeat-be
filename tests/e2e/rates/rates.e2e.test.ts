import * as request from 'supertest';
import {Response} from 'supertest';
import * as _ from 'lodash';
import TestRunner from "../../utils/test-runner";
import {Rate} from "../../../src/modules/rates/domain/rate";
import {RateType} from "../../../src/common/enums/rate-type.enum";
import {Menu} from "../../../src/modules/menus/domain/menu";
import {Booking} from "../../../src/modules/bookings/domain/booking";
import {clearDatabase, getToken} from "../../utils/test-utils";
import {bookingBuilder, menuBuilder, rateBuilder} from "../../utils/test-builders";

describe('Rates Controller Test', async () => {
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
    it(`/POST rate: should create rate`, async () => {
        const rate: Rate = await rateBuilder().withValidData().build();
        const token = await getToken();
        const response: Response = await request(server)
            .post('/rates')
            .send(rate)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const rateResponse = response.body as Rate;
        expect(rateResponse.rate).toBe(rateResponse.rate);
        expect(rateResponse.comment).toBe(rateResponse.comment);
    });

    it(`/GET rate: should get rate by id`, async () => {
        const rate: Rate = await rateBuilder().withValidData().store();
        const token = await getToken();
        const response: Response = await request(server)
            .get(`/rates/${rate._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const rateResponse = response.body as Rate;
        expect(rateResponse._id).toEqual(rate._id);
        expect(rateResponse.rate).toEqual(rate.rate);
    });

    it(`/PUT rate: should update rate by id`, async () => {
        const rate: Rate = await rateBuilder().withValidData().store();
        const rateModified: Rate = await rateBuilder().withValidData().build(rate.booking);
        const token = await getToken();
        const response: Response = await request(server)
            .put(`/rates/${rate._id}`)
            .send(rateModified)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const rateResponse = response.body as Rate;
        expect(rateResponse._id).toEqual(rate._id);
        expect(rateResponse.rate).toEqual(rateModified.rate);
    });

    it(`/GET rates: should return guest rates`, async () => {
        const rate: Rate = await rateBuilder().withValidData().withType(RateType.GUEST).store();
        const token = await getToken();
        const response: Response = await request(server)
            .get('/rates')
            .query({guestId: rate.booking.guest._id})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const rates = response.body as Rate[];
        expect(rates.length).toBe(1);
        expect(_.first(rates)._id).toBe(rate._id);
    });

    it(`/GET rates: should return host rates`, async () => {
        const rate: Rate = await rateBuilder().withValidData().withType(RateType.HOST).store();
        const token = await getToken();
        const response: Response = await request(server)
            .get('/rates')
            .query({hostId: rate.booking.menu.host._id})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const rates = response.body as Rate[];
        expect(rates.length).toBe(1);
        expect(_.first(rates)._id).toBe(rate._id);
    });

    it(`/GET rates: should return BadRequest`, async () => {
        await rateBuilder().withValidData().withType(RateType.HOST).store();
        const token = await getToken();
        const response: Response = await request(server)
            .get('/rates')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });

    it(`/GET rates: should return host average rates (integer)`, async () => {
        const menu: Menu = await menuBuilder().withValidData().store();
        const booking: Booking = await bookingBuilder().withValidData().store(null, menu);
        const booking2: Booking = await bookingBuilder().withValidData().store(null, menu);
        const booking3: Booking = await bookingBuilder().withValidData().store(null, menu);
        await rateBuilder().withValidData().withType(RateType.HOST).withRate(2).store(booking);
        await rateBuilder().withValidData().withType(RateType.HOST).withRate(3).store(booking2);
        await rateBuilder().withValidData().withType(RateType.HOST).withRate(4).store(booking3);
        const token = await getToken();
        const response: Response = await request(server)
            .get('/rates/average')
            .query({hostId: menu.host._id})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const average = parseInt(response.text) as Number;
        expect(average).toBe(3);
    });

    it(`/GET rates: should return host average rates (decimal)`, async () => {
        const menu: Menu = await menuBuilder().withValidData().store();
        const booking: Booking = await bookingBuilder().withValidData().store(null, menu);
        const booking2: Booking = await bookingBuilder().withValidData().store(null, menu);
        await rateBuilder().withValidData().withType(RateType.HOST).withRate(2).store(booking);
        await rateBuilder().withValidData().withType(RateType.HOST).withRate(3).store(booking2);
        const token = await getToken();
        const response: Response = await request(server)
            .get('/rates/average')
            .query({hostId: menu.host._id})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const average = parseFloat(response.text) as Number;
        expect(average).toBe(2.5);
    });
});
