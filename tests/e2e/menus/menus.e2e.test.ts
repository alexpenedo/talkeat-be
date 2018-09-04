import * as request from 'supertest';
import {Response} from 'supertest';
import {User} from "../../../src/modules/users/domain/user";
import {Menu} from "../../../src/modules/menus/domain/menu";
import {Status} from "../../../src/common/enums/status.enum";
import TestRunner from "../../utils/test-runner";
import * as faker from 'faker';
import {Sort} from "../../../src/common/enums/sort.enum";
import * as _ from 'lodash';
import {clearDatabase, getToken} from "../../utils/test-utils";
import {menuBuilder, rateBuilder, userBuilder} from "../../utils/test-builders";
import {Rate} from "../../../src/modules/rates/domain/rate";
import {RateType} from "../../../src/common/enums/rate-type.enum";

describe('Menus Controller Test', async () => {
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

    it(`/GET PENDING hostMenus`, async () => {
        const user: User = await userBuilder().withValidData().store();
        const token = await getToken(user);
        await menuBuilder().withValidData().store(user);
        await menuBuilder().withValidData().store(user);
        await menuBuilder().withValidData().store(user);
        const response: Response = await request(server)
            .get(`/menus?host=${user._id}&status=${Status[Status.PENDING]}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(3);
    });


    it(`/GET FINISHED hostMenus`, async () => {

        const user: User = await userBuilder().withValidData().store();
        const token = await getToken(user);
        await menuBuilder().withValidData().store(user);
        await menuBuilder().withValidData().withDate(faker.date.past()).store(user);
        await menuBuilder().withValidData().withDate(faker.date.past()).store(user);
        const response: Response = await request(server)
            .get(`/menus?host=${user._id}&status=${Status[Status.FINISHED]}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(2);
    });

    it(`/GET userMenus`, async () => {
        const user: User = await userBuilder().withValidData().store();
        await menuBuilder().withValidData().store();
        await menuBuilder().withValidData().withDate(faker.date.past()).store();
        const menu: Menu = await menuBuilder().withValidData().withDate(faker.date.past()).store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 10,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(1);
    });

    it(`/GET userMenus: shouldn't return host own menus and past menus`, async () => {
        const host: User = await userBuilder().withValidData().store();
        const user: User = await userBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().store(host);
        await menuBuilder().withValidData().withLocation(menu.location).withAvailable(menu.available)
            .withDate(menu.date).store(host);
        await menuBuilder().withValidData().withLocation(menu.location).withAvailable(menu.available)
            .withDate(menu.date).store(user);
        await menuBuilder().withValidData().withLocation(menu.location).withAvailable(menu.available)
            .withDate(faker.date.past()).store(host);
        const token = await getToken(host);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: 1,
                date: menu.date.toISOString(),
                type,
                userId: host._id,
                page: 0,
                size: 10,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(1);
        expect(_.first(menus).host._id).toBe(user._id);
    });

    it(`/GET userMenus: should return menus order by price`, async () => {
        const user: User = await userBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().withPrice(12).store();
        await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).withPrice(10).store();
        await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).withPrice(8).store();
        const menu2: Menu = await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).withPrice(7).store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: 1,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 10,
                sort: Sort.PRICE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(_.first(menus)._id).toBe(menu2._id);
        expect(_.last(menus)._id).toBe(menu._id);
    });

    it(`/GET userMenus: should return menus order by rating`, async () => {
        const user: User = await userBuilder().withValidData().store();

        const rate1: Rate = await rateBuilder().withValidData().withRate(1).withType(RateType.HOST).store();
        const rate2: Rate = await rateBuilder().withValidData().withRate(3).withType(RateType.HOST).store();
        const rate3: Rate = await rateBuilder().withValidData().withRate(5).withType(RateType.HOST).store();

        const menu: Menu = await menuBuilder().withValidData().store(rate1.booking.menu.host);
        await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).store(rate2.booking.menu.host);
        const menu2: Menu = await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).store(rate3.booking.menu.host);
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: 1,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 10,
                sort: Sort.RATING
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(_.first(menus)._id).toBe(menu2._id);
        expect(_.last(menus)._id).toBe(menu._id);
    });

    it(`/GET userMenus: should return menus without ratings with rating order requested`, async () => {
        const user: User = await userBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().store();
        await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).store();
        await menuBuilder().withValidData().withLocation(menu.location).withDate(menu.date).store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: 1,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 10,
                sort: Sort.RATING
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(3);
    });

    it(`/GET userMenus: should return nearest menus`, async () => {
        const user: User = await userBuilder().withValidData().store();
        await menuBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().store();
        await menuBuilder().withValidData()
            .withDate(menu.date).withGuests(menu.guests)
            .withLocation([menu.location[0], menu.location[1]]).store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 2,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(2);
    });

    it(`/GET userMenus: should return nearest menus paginated`, async () => {
        const user: User = await userBuilder().withValidData().store();
        await menuBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().store();
        await menuBuilder().withValidData()
            .withDate(menu.date).withGuests(menu.guests)
            .withLocation([menu.location[0], menu.location[1]]).store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response1: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 1,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response1.status).toBe(200);
        const menus1 = response1.body as Menu[];
        expect(menus1.length).toBe(1);
        const response2: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 1,
                size: 1,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response2.status).toBe(200);
        const menus2 = response2.body as Menu[];
        expect(menus2.length).toBe(1);
    });

    it(`/GET userMenus: should filter by persons`, async () => {
        const user: User = await userBuilder().withValidData().store();
        const menu: Menu = await menuBuilder().withValidData().withGuests(2).store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available + 1,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 1,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(0);
    });
    it(`/GET userMenus: should filter by date`, async () => {
        const user: User = <User>await userBuilder().withValidData().store();
        const menu: Menu = <Menu>await menuBuilder().withValidData().store();
        await menuBuilder().withValidData().store();
        const token = await getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: user._id,
                page: 0,
                size: 1,
                sort: Sort.DISTANCE
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(1);
    });

    it(`/POST menus`, async () => {
        const menu: Menu = await menuBuilder().withValidData().build();
        const token = await getToken();
        const response: Response = await request(server)
            .post('/menus')
            .set('Authorization', `Bearer ${token}`)
            .send(menu);
        expect(response.status).toBe(201);
        const responseMenu = response.body as Menu;
        expect(responseMenu.name).toEqual(menu.name);
        expect(responseMenu.host._id).toEqual(menu.host._id);
        expect(responseMenu.guests).toEqual(menu.guests);
        expect(responseMenu._id).toBeDefined();
    });

    it(`/GET menu: should get menu by id`, async () => {
        const menu: Menu = await menuBuilder().withValidData().store();
        const token = await getToken();
        const response: Response = await request(server)
            .get(`/menus/${menu._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const responseMenu = response.body as Menu;
        expect(responseMenu.name).toEqual(menu.name);
        expect(responseMenu.host._id).toEqual(menu.host._id);
        expect(responseMenu.guests).toEqual(menu.guests);
        expect(responseMenu._id).toBeDefined();
        expect(responseMenu._id).toEqual(menu._id);
    });

    it(`/PUT menu: should update menu by id`, async () => {
        const menu: Menu = await menuBuilder().withValidData().store();
        const menuEdited: Menu = await menuBuilder().withValidData().build();
        const token = await getToken();
        const response: Response = await request(server)
            .put(`/menus/${menu._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(menuEdited);
        expect(response.status).toBe(200);
        const responseMenu = response.body as Menu;
        expect(menuEdited.name).toEqual(responseMenu.name);
        expect(menuEdited.guests).toEqual(responseMenu.guests);
        expect(menuEdited.location).toEqual(responseMenu.location);
        expect(responseMenu._id).toEqual(menu._id);
    });
});
