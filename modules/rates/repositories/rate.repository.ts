import {Injectable} from "injection-js";
import {BaseRepository} from "../../common/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Rate} from "../interfaces/rate.interface";

@Injectable()
export class RateRepository extends BaseRepository<Rate> {
    constructor(@InjectModel('Rate') private readonly rateModel: Model<Rate>) {
        super(rateModel);
    }

    async findByHostId(hostId: string): Promise<Rate[]> {
        return await this.rateModel.find({
            host: hostId
        }).populate("guest").sort({date: -1}).limit(5).exec();
    }

    async getAverageByHostId(hostId: string): Promise<number> {
        return await this.rateModel.aggregate([{
            $match: {host: hostId}
        }]).group({
            _id: '$host',
            average: {
                $avg: '$rate'
            }
        }).exec();
    }


}