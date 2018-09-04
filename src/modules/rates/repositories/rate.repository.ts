import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Rate} from "../domain/rate";
import {ObjectId} from "bson";
import {Average} from "../interfaces/average.interface";
import {Injectable} from "@nestjs/common";
import {RateType} from "../../../common/enums/rate-type.enum";
import {RateAssembler} from "../../../common/assemblers/rate-assembler";

@Injectable()
export class RateRepository extends BaseRepository<Rate> {
    constructor(@InjectModel('Rate') private readonly rateModel,
                private readonly rateAssembler: RateAssembler) {
        super(rateModel, rateAssembler);
    }

    async findByHostIdAndTypeHost(hostId: string): Promise<Rate[]> {
        const documents = await this.rateModel.find({
            host: hostId,
            type: RateType.HOST
        }).populate("guest host booking").sort({date: -1}).limit(10).exec();
        return this.rateAssembler.toEntities(documents);
    }

    async findByGuestIdAndTypeGuest(guestId: string): Promise<Rate[]> {
        const documents = await this.rateModel.find({
            guest: guestId,
            type: RateType.GUEST
        }).populate("guest host booking").sort({date: -1}).limit(10).exec();
        return this.rateAssembler.toEntities(documents);
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
        const documents = await this.rateModel.find({
            booking: bookingId
        }).populate("guest host booking").exec();
        return this.rateAssembler.toEntities(documents);
    }


}