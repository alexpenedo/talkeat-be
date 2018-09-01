import * as request from 'supertest';
import {Response} from 'supertest';
import * as _ from 'lodash';
import * as faker from 'faker';
import {User} from "../../../src/modules/users/domain/user";
import TestUtil from "../test-util";
import {Booking} from "../../../src/modules/bookings/domain/booking";
import {Status} from "../../../src/common/enums/status.enum";
import {Menu} from "../../../src/modules/menus/domain/menu";

describe('Bookings Controller Test', async () => {
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
    it(`/POST booking: should create booking`, async () => {
        const booking: Booking = await TestUtil.bookingBuilder().withValidData().build();
        const token = await TestUtil.getToken();
        const response: Response = await request(server)
            .post('/bookings')
            .send(booking)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.guest._id).toBe(booking.guest._id);
    });

    it(`/GET booking: should get booking by id`, async () => {
        const booking: Booking = await TestUtil.bookingBuilder().withValidData().store();
        const token = await TestUtil.getToken();
        const response: Response = await request(server)
            .get(`/bookings/${booking._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse._id).toBe(booking._id);
    });

    it(`/PUT booking: should update booking by id`, async () => {
        const booking: Booking = await TestUtil.bookingBuilder().withValidData().store();
        const bookingUpdated: Booking = await TestUtil.bookingBuilder().withValidData().build();
        const token = await TestUtil.getToken();
        const response: Response = await request(server)
            .put(`/bookings/${booking._id}`)
            .send(bookingUpdated)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.comment).toBe(bookingUpdated.comment);
    });

    it(`/POST confirm booking: should confirm booking by id`, async () => {
        const booking: Booking = await TestUtil.bookingBuilder().withValidData().store();
        const token = await TestUtil.getToken();
        const response: Response = await request(server)
            .post(`/bookings/${booking._id}/confirm`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.confirmed).toBe(true);
    });

    it(`/POST cancel booking: should confirm booking by id`, async () => {
        const booking: Booking = await TestUtil.bookingBuilder().withValidData().store();
        const token = await TestUtil.getToken();
        const response: Response = await request(server)
            .post(`/bookings/${booking._id}/cancel`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        const bookingResponse = response.body as Booking;
        expect(bookingResponse.canceled).toBe(true);
    });

    it(`/GET bookings: should get finished bookings confirmed`, async () => {
        const guest: User = await TestUtil.userBuilder().withValidData().store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData().withDate(faker.date.past()).store();
        const booking: Booking = await TestUtil.bookingBuilder().withValidData().withConfirmed(true).store(guest, menu);
        const token = await TestUtil.getToken(guest);
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
        const booking = await TestUtil.bookingBuilder().withValidData().withCanceled(true).store();
        const token = await TestUtil.getToken();
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
        const booking = await TestUtil.bookingBuilder().withValidData().store();
        const token = await TestUtil.getToken();
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
        const booking = await TestUtil.bookingBuilder().withValidData().withCanceled(true).store();
        const token = await TestUtil.getToken();
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
