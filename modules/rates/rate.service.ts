import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {RateRepository} from "./repositories/rate.repository";
import {Rate} from "./interfaces/rate.interface";

@Injectable()
export class RateService {
    constructor(private rateRepository: RateRepository) {
    }

    async create(rate: Rate): Promise<Rate> {
        return await this.rateRepository.save(rate);
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
        return await this.rateRepository.getAverageByHostId(hostId);
    }

    async getHostRates(hostId: string): Promise<Rate[]> {
        return await this.rateRepository.findByHostId(hostId);
    }
}
