import * as request from 'supertest';
import {Response} from 'supertest';
import * as _ from 'lodash';
import * as faker from 'faker';
import {User} from "../../../src/modules/users/domain/user";
import TestRunner from "../../utils/test-runner";
import {Booking} from "../../../src/modules/bookings/domain/booking";
import {Status} from "../../../src/common/enums/status.enum";
import {Menu} from "../../../src/modules/menus/domain/menu";
import {clearDatabase, getToken} from "../../utils/test-utils";
import {bookingBuilder, menuBuilder, userBuilder} from "../../utils/test-builders";

describe('Bookings Controller Test', async () => {
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
    it(`/POST booking: should create booking`, async () => {
        const booking: Booking = await bookingBuilder().withValidData().build();
        const token = await getToken();
        const response: Response = await request(server)
            .post('/bookings')
            .send(booking)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.guest._id).toBe(booking.guest._id);
    });

    it(`/GET booking: should get booking by id`, async () => {
        const booking: Booking = await bookingBuilder().withValidData().store();
        const token = await getToken();
        const response: Response = await request(server)
            .get(`/bookings/${booking._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse._id).toBe(booking._id);
    });

    it(`/PUT booking: should update booking by id`, async () => {
        const booking: Booking = await bookingBuilder().withValidData().store();
        const bookingUpdated: Booking = await bookingBuilder().withValidData().build();
        const token = await getToken();
        const response: Response = await request(server)
            .put(`/bookings/${booking._id}`)
            .send(bookingUpdated)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.comment).toBe(bookingUpdated.comment);
    });

    it(`/POST confirm booking: should confirm booking by id`, async () => {
        const booking: Booking = await bookingBuilder().withValidData().store();
        const token = await getToken();
        const response: Response = await request(server)
            .post(`/bookings/${booking._id}/confirm`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.confirmed).toBe(true);
    });

    it(`/POST cancel booking: should confirm booking by id`, async () => {
        const booking: Booking = await bookingBuilder().withValidData().store();
        const token = await getToken();
        const response: Response = await request(server)
            .post(`/bookings/${booking._id}/cancel`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.canceled).toBe(true);
    });

    it(`/GET bookings: should get finished bookings confirmed`, async () => {
        const guest: User = await userBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().withDate(faker.date.past()).store();
        const booking: Booking = await bookingBuilder().withValidData().withConfirmed(true).store(guest, menu);
        const token = await getToken(guest);
        const response: Response = await request(server)
            .get('/bookings')
            .query({
                guest: guest._id,
                status: Status.FINISHED,
                page: 0,
                size: 1,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookings = response.body as Booking[];
        expect(bookings.length).toBe(1);
        expect(_.first(bookings)._id).toBe(booking._id);
    });

    it(`/GET bookings: shouldn't get finished bookings canceled`, async () => {
        const booking = await bookingBuilder().withValidData().withCanceled(true).store();
        const token = await getToken();
        const response: Response = await request(server)
            .get('/bookings')
            .query({
                guest: booking.guest._id,
                status: Status.FINISHED,
                page: 0,
                size: 1,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookings = response.body as Booking[];
        expect(bookings.length).toBe(0);
    });

    it(`/GET bookings: should get pending not canceled bookings`, async () => {
        const booking = await bookingBuilder().withValidData().store();
        const token = await getToken();
        const response: Response = await request(server)
            .get('/bookings')
            .query({
                guest: booking.guest._id,
                status: Status.PENDING,
                page: 0,
                size: 1,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookings = response.body as Booking[];
        expect(bookings.length).toBe(1);
        expect(_.first(bookings)._id).toBe(booking._id);
    });

    it(`/GET bookings: shouldn't get pending canceled bookings`, async () => {
        const booking = await bookingBuilder().withValidData().withCanceled(true).store();
        const token = await getToken();
        const response: Response = await request(server)
            .get('/bookings')
            .query({
                guest: booking.guest._id,
                status: Status.PENDING,
                page: 0,
                size: 1,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookings = response.body as Booking[];
        expect(bookings.length).toBe(0);
    });
});
