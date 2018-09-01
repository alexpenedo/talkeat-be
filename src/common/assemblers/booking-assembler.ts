import {Assembler} from "./abstract.assembler";
import {Booking} from "../../modules/bookings/domain/booking";
import {Injectable} from "@nestjs/common";
import {Menu} from "../../modules/menus/domain/menu";
import {MenuAssembler} from "./menu-assembler";
import {UserAssembler} from "./user-assembler";

@Injectable()
export class BookingAssembler extends Assembler<Booking> {
    constructor(private readonly menuAssembler: MenuAssembler,
                private readonly userAssembler: UserAssembler) {
        super();
    }

    toDocument(booking: Booking) {
        return {
            _id: booking._id ? booking._id : undefined,
            date: booking.date,
            guest: booking.guest,
            host: this.userAssembler.toDocument(booking.menu.host),
            menuDate: booking.menu.date,
            persons: booking.persons,
            comment: booking.comment,
            menu: this.menuAssembler.toDocument(booking.menu),
            confirmed: booking.confirmed ? booking.confirmed : false,
            canceled: booking.canceled ? booking.canceled : false
        }
    }

    toEntity(document): Booking {
        const booking: Booking = new Booking();
        booking._id = document._id ? document._id.toString() : undefined;
        booking.date = document.date;
        booking.persons = document.persons;
        booking.comment = document.comment;
        booking.guest = this.userAssembler.toEntity(document.guest);
        booking.menu = this.menuAssembler.toEntity(document.menu) as Menu;
        booking.menu.host = this.userAssembler.toEntity(document.host);
        booking.confirmed = document.confirmed ? document.confirmed : false;
        booking.canceled = document.canceled ? document.canceled : false;
        return booking;
    }
}