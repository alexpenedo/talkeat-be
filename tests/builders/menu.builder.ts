import {User} from "../../src/modules/users/domain/user";
import * as faker from 'faker';
import {Injectable} from "@nestjs/common";
import {MenuRepository} from "../../src/modules/menus/repositories/menu.repository";
import {Menu} from "../../src/modules/menus/domain/menu";
import {UserBuilder} from "./user.builder";

@Injectable()
export class MenuBuilder {
    private readonly _menu: Menu;

    constructor(private menuRepository: MenuRepository, private userBuilder: UserBuilder) {
        this._menu = new Menu();
    }

    withId(id: string): MenuBuilder {
        this._menu._id = id;
        return this;
    }

    withName(name: any): MenuBuilder {
        this._menu.name = name;
        return this;
    }

    withDescription(description: any): MenuBuilder {
        this._menu.description = description;
        return this;
    }

    withStarters(menuComponents: any[]): MenuBuilder {
        this._menu.starters = menuComponents;
        return this;
    }

    withMains(menuComponents: any[]): MenuBuilder {
        this._menu.mains = menuComponents;
        return this;
    }

    withDesserts(menuComponents: any[]): MenuBuilder {
        this._menu.desserts = menuComponents;
        return this;
    }

    withGuests(guests: any): MenuBuilder {
        this._menu.guests = guests;
        return this;
    }

    withAvailable(available: any): MenuBuilder {
        this._menu.available = available;
        return this;
    }

    withPrice(price: any): MenuBuilder {
        this._menu.price = price;
        return this;
    }

    withHost(host: User): MenuBuilder {
        this._menu.host = host;
        return this;
    }

    withDate(date: any): MenuBuilder {
        this._menu.date = date;
        return this;
    }

    withPostalCode(postalCode: any): MenuBuilder {
        this._menu.postalCode = postalCode;
        return this;
    }

    withAddress(address: any): MenuBuilder {
        this._menu.address = address;
        return this;
    }

    withCountry(country: any): MenuBuilder {
        this._menu.country = country;
        return this;
    }

    withLocation(location: number[]): MenuBuilder {
        this._menu.location = location;
        return this;
    }

    withValidData(): MenuBuilder {
        const name = faker.name.jobTitle();
        const description = faker.lorem.paragraph();
        const starters = [{name: faker.name.jobTitle()}];
        const mains = [{name: faker.name.jobTitle()}];
        const desserts = [{name: faker.name.jobTitle()}];
        const guests = faker.random.number({min: 1, max: 5});
        const price = faker.finance.amount(5, 20, 2).toString();
        const date = faker.date.future();
        const postalCode = faker.address.zipCode();
        const address = faker.address.streetAddress();
        const country = faker.address.country();
        const location = [parseFloat(faker.finance.amount(10, 50, 6)), parseFloat(faker.finance.amount(1, 10, 6))];
        return this.withName(name)
            .withDescription(description)
            .withStarters(starters)
            .withMains(mains)
            .withDesserts(desserts)
            .withGuests(guests)
            .withPrice(price)
            .withDate(date)
            .withPostalCode(postalCode)
            .withAddress(address)
            .withCountry(country)
            .withLocation(location);
    }

    async build(host?: User): Promise<Menu> {
        host ? this.withHost(host) :
            this.withHost(await this.userBuilder.withValidData().store());
        return this._menu;
    }

    async store(host?: User): Promise<Menu> {
        host ? this.withHost(host) :
            this.withHost(await this.userBuilder.withValidData().store());
        return await this.menuRepository.save(this._menu);
    }
}
