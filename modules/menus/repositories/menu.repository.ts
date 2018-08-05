import {BaseRepository} from "../../common/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Menu} from "../interfaces/menu.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MenuRepository extends BaseRepository<Menu> {
    constructor(@InjectModel('Menu') private readonly menuModel: Model<Menu>) {
        super(menuModel);
    }

    async findByCoordinatesAndDatesAndPersonsAndIdNotInMenusAndHostNotUserId(
        coordinates: number[], startDate: Date, endDate: Date,
        persons: number, menuIds?: string[], userId?: string): Promise<Menu[]> {
        const query: any = this.buildFindQuery(coordinates, persons, startDate, endDate);
        if (userId) query.host = {$ne: userId};
        if (menuIds) query._id = {$nin: menuIds};

        return await this.menuModel.find(query).exec()
    }

    async findByHostIdAndDateFromOrderByDate(userId: string, dateFrom: Date): Promise<Menu[]> {
        return await this.menuModel.find({
            host: userId, date: {
                $gte: dateFrom
            }
        }).sort({date: -1}).exec();
    }

    async findByHostIdAndDateToOrderByDate(userId: string, dateTo: Date): Promise<Menu[]> {
        return await this.menuModel.find({
            host: userId, date: {
                $lte: dateTo
            }
        }).sort({date: -1}).exec();
    }

    private buildFindQuery(coordinates: number[], persons: number, startDate: Date, endDate: Date): any {
        const maxDistance = 10000;
        return {
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
            }
        }
    }

}