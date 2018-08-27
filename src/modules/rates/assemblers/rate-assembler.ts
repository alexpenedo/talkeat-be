import {Assembler} from "../../../common/assemblers/abstract.assembler";
import {Injectable} from "@nestjs/common";
import {Rate} from "../domain/rate";
import {Menu} from "../../menus/domain/menu";

@Injectable()
export class RateAssembler extends Assembler<Rate> {
    toDocument(rate: Rate) {
        return {
            _id: rate._id ? rate._id : undefined,
            date: rate.date,
            guest: rate.booking.guest,
            host: rate.booking.menu.host,
            booking: rate.booking,
            comment: rate.comment,
            rate: rate.rate,
            type: rate.type,
        }
    }

    toEntity(document): Rate {
        const rate: Rate = new Rate();
        rate._id = document._id ? document._id : undefined;
        rate.date = document.date;
        rate.booking = document.booking;
        rate.booking.guest = document.guest;
        rate.booking.menu = new Menu();
        rate.booking.menu.host = document.host;
        rate.comment = document.comment;
        rate.rate = document.rate;
        rate.type = document.type;
        return rate;
    }

}