import {BaseRepository} from "../../common/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Booking} from "../interfaces/booking.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
    constructor(@InjectModel('Booking') private readonly bookingModel: Model<Booking>) {
        super(bookingModel);
    }

    async findByMenuId(menuId: string) {
        return this.bookingModel.find({menu: menuId}).populate("menus host guest rate").sort({date: -1}).exec()
    }

    async findByGuestIdOrderByDateDesc(guestId: string): Promise<Booking[]> {
        return this.bookingModel.find({guest: guestId}).populate("menus host guest rate").sort({date: -1}).exec();
    }

    async findByHostIdOrderByDateDesc(hostId: string): Promise<Booking[]> {
        return this.bookingModel.find({host: hostId}).populate("menus host guest rate").sort({date: -1}).exec();
    }

    async findByHostIdOrGuestIdOrderByDateDesc(hostId: string, guestId: string): Promise<Booking[]> {
        return this.bookingModel.find({
            $or: [{host: hostId},
                {guest: guestId}]
        }).populate("menus host guest rate").sort({date: -1}).exec();
    }

    async findByGuestIdAndDateFromOrderByDateAsc(guestId: string, dateFrom: Date): Promise<Booking[]> {
        return await this.bookingModel.find({
            guest: guestId, menuDate: {
                $gte: dateFrom
            }
        }).sort({date: -1}).exec();
    }

    async findByGuestIdAndDateToOrderByDate(guestId: string, dateTo: Date): Promise<Booking[]> {
        return await this.bookingModel.find({
            guest: guestId, menuDate: {
                $lte: dateTo
            }
        }).sort({date: -1}).exec();
    }

}