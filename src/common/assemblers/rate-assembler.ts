import {Assembler} from "./abstract.assembler";
import {Injectable} from "@nestjs/common";
import {Rate} from "../../modules/rates/domain/rate";
import {UserAssembler} from "./user-assembler";
import {BookingAssembler} from "./booking-assembler";
import {MenuAssembler} from "./menu-assembler";

@Injectable()
export class RateAssembler extends Assembler<Rate> {

    constructor(private readonly  userAssembler: UserAssembler,
                private readonly bookingAssembler: BookingAssembler,
                private readonly menuAssembler: MenuAssembler) {
        super();
    }

    toDocument(rate: Rate) {
        return {
            _id: rate._id ? rate._id : undefined,
            date: rate.date,
            guest: this.userAssembler.toDocument(rate.booking.guest),
            host: this.userAssembler.toDocument(rate.booking.menu.host),
            booking: this.bookingAssembler.toDocument(rate.booking),
            comment: rate.comment,
            rate: rate.rate,
            type: rate.type,
        }
    }

    toEntity(document): Rate {
        const rate: Rate = new Rate();
        rate._id = document._id ? document._id.toString() : undefined;
        rate.date = document.date;
        rate.booking = this.bookingAssembler.toEntity(document.booking);
        rate.booking.guest = this.userAssembler.toEntity(document.guest);
        rate.booking.menu = this.menuAssembler.toEntity(document.booking.menu);
        rate.comment = document.comment;
        rate.rate = document.rate;
        rate.type = document.type;
        return rate;
    }

}