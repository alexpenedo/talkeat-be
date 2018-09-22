import {Injectable} from '@nestjs/common';
import {UserBuilder} from "../../../tests/builders/user.builder";
import {MenuBuilder} from "../../../tests/builders/menu.builder";
import {User} from "../users/domain/user";
import * as faker from 'faker';
import {BookingBuilder} from "../../../tests/builders/booking.builder";
import {RateBuilder} from "../../../tests/builders/rate.builder";
import {RateType} from "../../common/enums/rate-type.enum";

@Injectable()
export class DemoService {
    constructor(private userBuilder: UserBuilder, private menuBuilder: MenuBuilder,
                private bookingBuilder: BookingBuilder, private rateBuilder: RateBuilder) {
    }

    async createDemoData() {
        const users = await this.createUsers();
        await this.createPastMenus(users);
    }

    private async createUsers() {
        const users: User[] = [];
        users.push(await this.userBuilder.withValidData().withName('Carlos')
            .withSurname('Pérez').withCountry('España')
            .withPostalCode(15005).withAddress('Río Tambre, 10').store());
        users.push(await this.userBuilder.withValidData().withName('Marcos')
            .withSurname('Alonso').withCountry('España')
            .withPostalCode(15004).withAddress('Fernando Macías, 14').store());
        users.push(await this.userBuilder.withValidData().withName('María')
            .withSurname('Rodríguez').withCountry('España')
            .withPostalCode(15011).withAddress('Simón Bolívar, 82').store());
        users.push(await this.userBuilder.withValidData().withName('Carla')
            .withSurname('Martínez').withCountry('España')
            .withPostalCode(15008).withAddress('Casares Quiroga, 11').store());
        users.push(await this.userBuilder.withValidData().withName('Sara')
            .withSurname('López').withCountry('España')
            .withPostalCode(15009).withAddress('Luciano Yordi de Carricarte, 9').store());
        return users;
    }

    private async createPastMenus(users: User[]) {
        const menu = await this.menuBuilder.withName('Menú ejecutivo')
            .withDescription('Comida sana para trabajadores con poco tiempo')
            .withDate(faker.date.recent(-2))
            .withStarters([{name: 'Ensalada mixta'}])
            .withMains([{name: 'Filete de ternera'}])
            .withDesserts([{name: 'Tarta de queso'}]).withGuests(4).withAvailable(0)
            .withPrice(6).withAddress(users[0].address).withCountry(users[0].country).withPostalCode(users[0].postalCode)
            .withLocation([1, 1]).store(users[0]);
        const booking = await this.bookingBuilder
            .withConfirmed(true).withPersons(4).store(users[1], menu);
        await this.rateBuilder.withValidData().withRate(4).withType(RateType.HOST)
            .withDate(faker.date.recent(-2))
            .withComment('Todo genial. La compañía fue buena.').store(booking);
        await this.rateBuilder.withValidData().withRate(5).withType(RateType.GUEST)
            .withDate(faker.date.recent(-2))
            .withComment('Todo muy bien. La verdad es que voy a repetir.').store(booking);

        const menu2 = await this.menuBuilder.withName('Menú vegetariano')
            .withDescription('Comida vegetariana para personas con ganas de probar cosas nuevas')
            .withDate(faker.date.recent(-2))
            .withStarters([{name: 'Ensalada mixta'}])
            .withMains([{name: 'Lasaña de verduras'}])
            .withDesserts([{name: 'Tarta de chocolate'}]).withGuests(4).withAvailable(0)
            .withPrice(6).withAddress(users[1].address).withCountry(users[1].country).withPostalCode(users[1].postalCode)
            .withLocation([1, 1]).store(users[1]);
        const booking2 = await this.bookingBuilder
            .withConfirmed(true).withPersons(4).store(users[2], menu2);
        await this.rateBuilder.withValidData().withRate(4).withType(RateType.HOST)
            .withDate(faker.date.recent(-2))
            .withComment('Todo estupendo.').store(booking2);
        await this.rateBuilder.withValidData().withRate(5).withType(RateType.GUEST)
            .withDate(faker.date.recent(-2))
            .withComment('Todo genial.').store(booking2);

        const menu3 = await this.menuBuilder.withName('Menú vegetariano')
            .withDescription('Comida vegetariana para personas con ganas de probar cosas nuevas')
            .withDate(faker.date.recent(-2))
            .withStarters([{name: 'Ensalada mixta'}])
            .withMains([{name: 'Lasaña de verduras'}])
            .withDesserts([{name: 'Tarta de chocolate'}]).withGuests(3).withAvailable(0)
            .withPrice(6).withAddress(users[1].address).withCountry(users[2].country).withPostalCode(users[2].postalCode)
            .withLocation([1, 1]).store(users[1]);
        const booking3 = await this.bookingBuilder
            .withConfirmed(true).withPersons(4).store(users[3], menu3);
        await this.rateBuilder.withValidData().withRate(4).withType(RateType.HOST)
            .withDate(faker.date.recent(-2))
            .withComment('Todo genial. La compañía fue buena.').store(booking3);
        await this.rateBuilder.withValidData().withRate(5).withType(RateType.GUEST)
            .withDate(faker.date.recent(-2))
            .withComment('Todo estupendo.').store(booking3);
    }
}
