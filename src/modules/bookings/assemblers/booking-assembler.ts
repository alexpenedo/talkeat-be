import {Assembler} from "../../../common/assemblers/abstract.assembler";
import {Booking} from "../domain/booking";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BookingAssembler extends Assembler<Booking> {
    toDocument(booking: Booking) {
        return {
            _id: booking._id ? booking._id : undefined,
            date: booking.date,
            guest: booking.guest,
            host: booking.menu.host,
            menuDate: booking.menu.date,
            persons: booking.persons,
            comment: booking.comment,
            menu: booking.menu,
            confirmed: booking.confirmed ? booking.confirmed : false,
            canceled: booking.canceled ? booking.canceled : false
        }
    }

    toEntity(document): Booking {
        const booking: Booking = new Booking();
        booking._id = document._id ? document._id : undefined;
        booking.date = document.date;
        booking.persons = document.persons;
        booking.comment = document.comment;
        booking.guest = document.guest;
        booking.menu = document.menu;
        booking.menu.host = document.host;
        booking.confirmed = document.confirmed ? document.confirmed : false;
        booking.canceled = document.canceled ? document.canceled : false;
        return booking;
    }

}