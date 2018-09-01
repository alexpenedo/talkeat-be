import {User} from "../../src/modules/users/domain/user";
import * as faker from 'faker';
import {Injectable} from "@nestjs/common";
import {Menu} from "../../src/modules/menus/domain/menu";
import {BookingRepository} from "../../src/modules/bookings/repositories/booking.repository";
import {Booking} from "../../src/modules/bookings/domain/booking";
import {UserBuilder} from "./user.builder";
import {MenuBuilder} from "./menu.builder";

@Injectable()
export class BookingBuilder {
    private _booking: Booking;

    constructor(private bookingRepository: BookingRepository, private userBuilder: UserBuilder,
                private menuBuilder: MenuBuilder) {
        this._booking = new Booking();
    }

    withId(id: string): BookingBuilder {
        this._booking._id = id;
        return this;
    }

    withDate(date: any): BookingBuilder {
        this._booking.date = date;
        return this;
    }

    withGuest(guest: User): BookingBuilder {
        this._booking.guest = guest;
        return this;
    }

    withPersons(persons: number): BookingBuilder {
        this._booking.persons = persons;
        return this;
    }

    withComment(comment: string): BookingBuilder {
        this._booking.comment = comment;
        return this;
    }

    withMenu(menu: Menu): BookingBuilder {
        this._booking.menu = menu;
        return this;
    }

    withConfirmed(confirmed: boolean): BookingBuilder {
        this._booking.confirmed = confirmed;
        return this;
    }

    withCanceled(canceled: boolean): BookingBuilder {
        this._booking.canceled = canceled;
        return this;
    }

    withValidData(): BookingBuilder {
        const date = faker.date.future();
        const persons = faker.random.number(5);
        const comment = faker.lorem.paragraph();
        const confirmed = false;
        const canceled = false;
        return this.withDate(date)
            .withPersons(persons)
            .withComment(comment)
            .withConfirmed(confirmed)
            .withCanceled(canceled);
    }

    async build(guest?: User, menu?: Menu) {
        guest ? this.withGuest(guest) :
            this.withGuest(await this.userBuilder.withValidData().store());
        menu ? this.withMenu(menu) :
            this.withMenu(await this.menuBuilder.withValidData().store());
        return this._booking;
    }

    async store(guest?: User, menu?: Menu): Promise<Booking> {
        guest ? this.withGuest(guest) :
            this.withGuest(await this.userBuilder.withValidData().store());
        menu ? this.withMenu(menu) :
            this.withMenu(await this.menuBuilder.withValidData().store());
        return await this.bookingRepository.save(this._booking);
    }
}
