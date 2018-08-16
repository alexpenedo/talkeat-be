import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Rate} from "../domain/rate";
import {ObjectId} from "bson";
import {Average} from "../interfaces/average.interface";
import {Injectable} from "@nestjs/common";
import {RateType} from "../../../common/enums/rate-type.enum";

@Injectable()
export class RateRepository extends BaseRepository<Rate> {
    constructor(@InjectModel('Rate') private readonly rateModel) {
        super(rateModel);
    }

    async findByHostIdAndTypeHost(hostId: string): Promise<Rate[]> {
        return await this.rateModel.find({
            host: hostId,
            type: RateType.HOST
        }).populate("guest").sort({date: -1}).limit(10).exec();
    }

    async findByGuestIdAndTypeGuest(hostId: string): Promise<Rate[]> {
        return await this.rateModel.find({
            host: hostId,
            type: RateType.GUEST
        }).populate("host").sort({date: -1}).limit(10).exec();
    }

    async getAverageByHostId(hostId: string): Promise<Average[]> {
        let id = new ObjectId(hostId);
        return await this.rateModel.aggregate([{
            $match: {host: id, type: RateType.HOST}
        }]).group({
            _id: '$host',
            average: {
                $avg: '$rate'
            }
        }).exec();
    }

    async findByBookingId(bookingId: string): Promise<Rate[]> {
        return await this.rateModel.find({
            booking: bookingId
        }).populate("guest host").exec();
    }


}