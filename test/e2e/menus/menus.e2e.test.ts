import * as request from 'supertest';
import {Response} from 'supertest';
import {User} from "../../../src/modules/users/domain/user";
import {Menu} from "../../../src/modules/menus/domain/menu";
import {Status} from "../../../src/common/enums/status.enum";
import TestUtil from "../test-util";
import * as faker from 'faker';

describe('Menus Controller Test', () => {
    let server;
    beforeAll(async () => {
        server = await TestUtil.run();
    });

    it(`/GET PENDING hostMenus`, async () => {
        const user: User = await TestUtil.userBuilder().withValidData().store();
        const token = await TestUtil.getToken(user);
        await TestUtil.menuBuilder().withValidData(user).store();
        await TestUtil.menuBuilder().withValidData(user).store();
        await TestUtil.menuBuilder().withValidData(user).store();
        const response: Response = await request(server)
            .get(`/menus?host=${user._id}&status=${Status[Status.PENDING]}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(3);
    });

    it(`/GET FINISHED hostMenus`, async () => {
        const user: User = await TestUtil.userBuilder().withValidData().store();
        const token = await TestUtil.getToken(user);
        await TestUtil.menuBuilder().withValidData(user).store();
        await TestUtil.menuBuilder().withValidData(user).withDate(faker.date.past()).store();
        await TestUtil.menuBuilder().withValidData(user).withDate(faker.date.past()).store();
        const response: Response = await request(server)
            .get(`/menus?host=${user._id}&status=${Status[Status.FINISHED]}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(2);
    });

    it(`/GET userMenus`, async () => {
        const host: User = await TestUtil.userBuilder().withValidData().store();
        const user: User = await TestUtil.userBuilder().withValidData().store();
        await TestUtil.menuBuilder().withValidData(host).store();
        await TestUtil.menuBuilder().withValidData(host).withDate(faker.date.past()).store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(host).withDate(faker.date.past()).store();
        const token = await TestUtil.getToken(user);
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
                size: 1
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(1);
    });

    it(`/GET userMenus: shouldn't return host own menus`, async () => {
        const host: User = await TestUtil.userBuilder().withValidData().store();
        await TestUtil.menuBuilder().withValidData(host).store();
        await TestUtil.menuBuilder().withValidData(host).withDate(faker.date.past()).store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(host).withDate(faker.date.past()).store();
        const token = await TestUtil.getToken(host);
        const type = menu.date.getHours() > 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: host._id
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(0);
    });

    it(`/GET userMenus: should return nearest menus`, async () => {
        const host: User = await TestUtil.userBuilder().withValidData().store();
        const user: User = await TestUtil.userBuilder().withValidData().store();
        await TestUtil.menuBuilder().withValidData(host).store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(host).store();
        const menu2: Menu = await TestUtil.menuBuilder().withValidData(host)
            .withDate(menu.date).withGuests(menu.guests)
            .withLocation([menu.location[0], menu.location[1]]).store();
        const token = await TestUtil.getToken(user);
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
                size: 2
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(2);
    });

    it(`/GET userMenus: should return nearest menus paginated`, async () => {
        const host: User = await TestUtil.userBuilder().withValidData().store();
        const user: User = await TestUtil.userBuilder().withValidData().store();
        await TestUtil.menuBuilder().withValidData(host).store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(host).store();
        const menu2: Menu = await TestUtil.menuBuilder().withValidData(host)
            .withDate(menu.date).withGuests(menu.guests)
            .withLocation([menu.location[0], menu.location[1]]).store();
        const token = await TestUtil.getToken(user);
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
                size: 1
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
                size: 1
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response2.status).toBe(200);
        const menus2 = response2.body as Menu[];
        expect(menus2.length).toBe(1);
    });

    it(`/GET userMenus: should filter by persons`, async () => {
        const host: User = await TestUtil.userBuilder().withValidData().store();
        const user: User = await TestUtil.userBuilder().withValidData().store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(host).withGuests(2).store();
        const token = await TestUtil.getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available + 1,
                date: menu.date.toISOString(),
                type,
                userId: user._id
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(0);
    });
    it(`/GET userMenus: should filter by date`, async () => {
        const host: User = <User>await TestUtil.userBuilder().withValidData().store();
        const user: User = <User>await TestUtil.userBuilder().withValidData().store();
        const menu: Menu = <Menu>await TestUtil.menuBuilder().withValidData(host).store();
        await TestUtil.menuBuilder().withValidData(host).store();
        const token = await TestUtil.getToken(user);
        const type = menu.date.getHours() >= 18 ? 'dinner' : 'lunch';
        const response: Response = await request(server)
            .get('/menus/located')
            .query({
                longitude: menu.location[0],
                latitude: menu.location[1],
                persons: menu.available,
                date: menu.date.toISOString(),
                type,
                userId: user._id
            })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const menus = response.body as Menu[];
        expect(menus.length).toBe(1);
    });

    it(`/POST menus`, async () => {
        const user: User = await TestUtil.userBuilder().withValidData().store();
        const menu: Menu = TestUtil.menuBuilder().withValidData(user).build();
        const token = await TestUtil.getToken(user);
        const response: Response = await request(server)
            .post('/menus')
            .set('Authorization', `Bearer ${token}`)
            .send(menu);
        expect(response.status).toBe(201);
        const responseMenu = response.body as Menu;
        expect(responseMenu.name).toEqual(menu.name);
        expect(responseMenu.host._id).toEqual(user._id);
        expect(responseMenu.guests).toEqual(menu.guests);
        expect(responseMenu._id).toBeDefined();
    });

    it(`/GET menuById`, async () => {
        const user: User = await TestUtil.userBuilder().withValidData().store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(user).store();
        const token = await TestUtil.getToken(user);
        const response: Response = await request(server)
            .get(`/menus/${menu._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const responseMenu = response.body as Menu;
        expect(responseMenu.name).toEqual(menu.name);
        expect(responseMenu.host._id).toEqual(user._id);
        expect(responseMenu.guests).toEqual(menu.guests);
        expect(responseMenu._id).toBeDefined();
        expect(responseMenu._id).toEqual(menu._id);
    });

    it(`/PUT userById`, async () => {
        const user: User = await TestUtil.userBuilder().withValidData().store();
        const menu: Menu = await TestUtil.menuBuilder().withValidData(user).store();
        const menuEdited: Menu = TestUtil.menuBuilder().withValidData(user).build();
        const token = await TestUtil.getToken(user);
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


    afterAll(async () => {
        await server.close();
    });
});
