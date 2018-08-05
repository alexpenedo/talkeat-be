import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {RateRepository} from "./repositories/rate.repository";
import {Rate} from "./interfaces/rate.interface";
import {Average} from "./interfaces/average.interface";
import * as _ from 'lodash';
import {BookingService} from "../bookings/booking.service";
import {Booking} from "../bookings/interfaces/booking.interface";

@Injectable()
export class RateService {
    constructor(private readonly rateRepository: RateRepository, private readonly bookingService: BookingService) {
    }

    async create(rate: Rate): Promise<Rate> {
        rate = await this.rateRepository.save(rate);
        const booking: Booking = await this.bookingService.findById(rate.booking._id);
        booking.rate = rate;
        await this.bookingService.update(booking._id, booking);
        return rate;
    }

    async findById(id: string): Promise<Rate> {
        return await this.rateRepository.findById(id);
    }

    async update(id: string, newValue: Rate): Promise<Rate> {
        return await this.rateRepository.update(id, newValue);
    }

    async delete(id: string): Promise<Rate> {
        return await this.rateRepository.delete(id);
    }

    async getHostAverageRating(hostId: string): Promise<number> {
        const averages: Average[] = await this.rateRepository.getAverageByHostId(hostId);
        return _.last(averages);
    }

    async getHostRates(hostId: string): Promise<Rate[]> {
        return await this.rateRepository.findByHostId(hostId);
    }
}
