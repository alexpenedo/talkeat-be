import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Menu} from "../domain/menu";
import {Injectable} from "@nestjs/common";
import {Sort} from "../../../common/enums/sort.enum";
import {ObjectId} from "bson";
import {RateType} from "../../../common/enums/rate-type.enum";
import {MenuAssembler} from "../../../common/assemblers/menu-assembler";

@Injectable()
export class MenuRepository extends BaseRepository<Menu> {
    constructor(@InjectModel('Menu') private readonly menuModel,
                private readonly menuAssembler: MenuAssembler) {
        super(menuModel, menuAssembler);
    }

    async findByCoordinatesAndDatesAndPersonsAndIdNotInMenusAndHostNotUserId(
        coordinates: number[], startDate: Date, endDate: Date,
        persons: number, menuIds: string[], userId: string, sort: Sort, page: number, size: number): Promise<Menu[]> {
        const aggregate = this.menuModel.aggregate().near(this.geoNearStage(coordinates))
            .match(this.matchStage(persons, startDate, endDate, menuIds, userId));
        if (sort == Sort.RATING) {
            aggregate.lookup(this.lookupRateStage())
                .unwind({
                    path: '$rate',
                    preserveNullAndEmptyArrays: true
                })
                .match({$or: [{rate: null}, {'rate.type': RateType.HOST}]})
                .group(this.groupStage()).sort({average: -1});
        }
        else if (sort == Sort.PRICE) {
            aggregate.sort({price: 1})
        }
        const menus = await aggregate
            .lookup(this.lookupHostStage()).unwind('host')
            .skip(page * size).limit(size).exec();
        return this.menuAssembler.toEntities(menus);
    }

    async findByHostIdAndDateFromOrderByDate(userId: string, dateFrom: Date, page: number, size: number): Promise<Menu[]> {
        return await this.menuModel.find({
            host: userId, canceled: false, date: {
                $gte: dateFrom
            }
        }).sort({date: -1}).skip(page * size).limit(size).exec();
    }

    async findByHostIdAndDateToOrderByDate(userId: string, dateTo: Date, page: number, size: number): Promise<Menu[]> {
        return await this.menuModel.find({
            host: userId, canceled: false, date: {
                $lte: dateTo
            }
        }).sort({date: -1}).skip(page * size).limit(size).exec();
    }

    private matchStage(persons: number, startDate: Date, endDate: Date, menuIds: string[], userId: string) {
        const query: any = {
            available: {
                $gte: +persons
            },
            date: {
                $gte: startDate,
                $lte: endDate
            },
            canceled: false
        };
        if (userId) query.host = {$ne: new ObjectId(userId)};
        if (menuIds) query._id = {$nin: menuIds};
        return query;
    }

    private geoNearStage(coordinates: number[]) {
        const maxDistance = 20000;
        return {
            near: {type: "Point", coordinates},
            maxDistance,
            distanceField: "distance"
        }
    }

    private lookupRateStage() {
        return {
            from: 'rates',
            localField: 'host',
            foreignField: 'host',
            as: 'rate'
        };
    }

    private lookupHostStage() {
        return {
            from: 'users',
            localField: 'host',
            foreignField: '_id',
            as: 'host'
        };
    }

    private groupStage() {
        return {
            _id: '$_id',
            name: {
                $first: '$name'
            },
            description: {
                $first: '$description'
            },
            starters: {
                $first: '$starters'
            },
            mains: {
                $first: '$mains'
            },
            desserts: {
                $first: '$desserts'
            },
            guests: {
                $first: '$guests'
            },
            price: {
                $first: '$price'
            },
            date: {
                $first: '$date'
            },
            address: {
                $first: '$address'
            },
            country: {
                $first: '$country'
            },
            postalCode: {
                $first: '$postalCode'
            },
            location: {
                $first: '$location'
            },
            host: {
                $first: '$host'
            },
            available: {
                $first: '$available'
            },
            distance: {
                $first: '$distance'
            },
            average: {
                $avg: '$rate.rate'
            }

        }
    }
}