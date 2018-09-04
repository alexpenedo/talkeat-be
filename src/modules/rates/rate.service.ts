import {Injectable, NotFoundException} from '@nestjs/common';
import {RateRepository} from "./repositories/rate.repository";
import {Rate} from "./domain/rate";
import {Average} from "./interfaces/average.interface";
import * as _ from 'lodash';

@Injectable()
export class RateService {
    constructor(private readonly rateRepository: RateRepository) {
    }

    async create(rate: Rate): Promise<Rate> {
        return await this.rateRepository.save(rate);
    }

    async findById(id: string): Promise<Rate> {
        const rate: Rate = await this.rateRepository.findById(id);
        if (!rate)
            throw new NotFoundException(`Rate with id=${id} has not found`);
        return rate;
    }

    async update(id: string, newValue: Rate): Promise<Rate> {
        return await this.rateRepository.update(id, newValue);
    }

    async delete(id: string): Promise<Rate> {
        return await this.rateRepository.delete(id);
    }

    async getHostAverageRating(hostId: string): Promise<number> {
        const averages: Average[] = await this.rateRepository.getAverageByHostId(hostId);
        return _.last(averages).average;
    }

    async getHostRates(hostId: string): Promise<Rate[]> {
        return await this.rateRepository.findByHostIdAndTypeHost(hostId);
    }

    async getGuestRates(guestId: string): Promise<Rate[]> {
        return await this.rateRepository.findByGuestIdAndTypeGuest(guestId);
    }

    async getBookingRates(bookingId: string): Promise<Rate[]> {
        return await this.rateRepository.findByBookingId(bookingId);
    }
}
