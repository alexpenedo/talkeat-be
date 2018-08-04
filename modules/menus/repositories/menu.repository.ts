import {Injectable} from "injection-js";
import {BaseRepository} from "../../common/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Menu} from "../interfaces/menu.interface";

@Injectable()
export class MenuRepository extends BaseRepository<Menu> {
    constructor(@InjectModel('Menu') private readonly menuModel: Model<Menu>) {
        super(menuModel);
    }

    async findByCoordinatesAndDatesAndPersonsAndIdNotInMenusAndHostNotUserId(
        coordinates: number[], startDate: Date, endDate: Date,
        persons: number, menuIds: string[], userId: string): Promise<Menu[]> {

        const maxDistance = 10 / 111.12;
        return await this.menuModel.find({
            _id: {
                $nin: menuIds
            },
            location: {
                $near: coordinates,
                $maxDistance: maxDistance
            },
            available: {
                $gte: persons
            },
            date: {
                $gte: startDate,
                $lte: endDate
            },
            host: {
                $ne: userId
            }
        }).exec()
    }

    async findByHostIdAndDateFromOrderByDate(userId: string, dateFrom: Date): Promise<Menu[]> {
        return await this.menuModel.find({
            host: userId, date: {
                $gte: dateFrom
            }
        }).sort({date: 1}).exec();
    }

    async findByHostIdAndDateToOrderByDate(userId: string, dateTo: Date): Promise<Menu[]> {
        return await this.menuModel.find({
            host: userId, date: {
                $lte: dateTo
            }
        }).sort({date: 1}).exec();
    }

}