import * as faker from 'faker';
import {Injectable} from "@nestjs/common";
import {Booking} from "../../src/modules/bookings/domain/booking";
import {Rate} from "../../src/modules/rates/domain/rate";
import {RateRepository} from "../../src/modules/rates/repositories/rate.repository";
import {RateType} from "../../src/common/enums/rate-type.enum";
import {BookingBuilder} from "./booking.builder";

@Injectable()
export class RateBuilder {
    private readonly _rate: Rate;

    constructor(private rateRepository: RateRepository, private bookingBuilder: BookingBuilder) {
        this._rate = new Rate();
    }

    withId(id: string): RateBuilder {
        this._rate._id = id;
        return this;
    }

    withDate(date: any): RateBuilder {
        this._rate.date = date;
        return this;
    }

    withBooking(booking: Booking): RateBuilder {
        this._rate.booking = booking;
        return this;
    }


    withComment(comment: string): RateBuilder {
        this._rate.comment = comment;
        return this;
    }

    withRate(rate: number): RateBuilder {
        this._rate.rate = rate;
        return this;
    }

    withType(type: RateType): RateBuilder {
        this._rate.type = type;
        return this;
    }

    withValidData(): RateBuilder {
        const comment = faker.lorem.paragraph();
        const rate = faker.random.number(5);
        const type = rate % 2 == 0 ? RateType.HOST : RateType.GUEST;
        return this.withComment(comment)
            .withRate(rate)
            .withType(type);
    }

    async build(booking?: Booking) {
        booking ? this.withBooking(booking) :
            this.withBooking(await this.bookingBuilder.withValidData().store());
        return this._rate;
    }

    async store(booking?: Booking): Promise<Rate> {
        booking ? this.withBooking(booking) :
            this.withBooking(await this.bookingBuilder.withValidData().store());
        return await this.rateRepository.save(this._rate);
    }
}
