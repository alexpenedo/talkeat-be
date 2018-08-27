import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Booking} from "../domain/booking";
import {Injectable} from "@nestjs/common";
import {BookingAssembler} from "../assemblers/booking-assembler";

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
    constructor(@InjectModel('Booking') private readonly bookingModel,
                private readonly bookingAssembler: BookingAssembler) {
        super(bookingModel, bookingAssembler);
    }

    async findByMenuId(menuId: string): Promise<Booking[]> {
        const documents = await this.bookingModel.find({menu: menuId}).populate("menu host guest rate").sort({date: -1}).exec();
        return this.bookingAssembler.toEntities(documents);
    }

    async findByGuestIdOrderByDateDesc(guestId: string): Promise<Booking[]> {
        const documents = await this.bookingModel.find({guest: guestId}).populate("menu host guest rate").sort({date: -1}).exec();
        return this.bookingAssembler.toEntities(documents);
    }

    async findByHostIdOrderByDateDesc(hostId: string): Promise<Booking[]> {
        const documents = await this.bookingModel.find({host: hostId}).populate("menu host guest rate").sort({date: -1}).exec();
        return this.bookingAssembler.toEntities(documents);
    }

    async findByHostIdOrGuestIdOrderByDateDesc(hostId: string, guestId: string): Promise<Booking[]> {
        const documents = await this.bookingModel.find({
            $or: [{host: hostId},
                {guest: guestId}]
        }).populate("menu host guest rate").sort({date: -1}).exec();
        return this.bookingAssembler.toEntities(documents);
    }

    async cancelBookingsByMenuId(menuId: string) {
        await this.bookingModel.update({menu: menuId}, {$set: {canceled: true}}, {multi: true}).exec();
    }

    async findByGuestIdAndDateFromOrderByDateAsc(guestId: string, dateFrom: Date, page: number, size: number): Promise<Booking[]> {
        const documents = await await this.bookingModel.find({
            guest: guestId,
            canceled: false,
            menuDate: {
                $gte: dateFrom
            }
        }).sort({date: -1}).skip(page * size).limit(size).exec();
        return this.bookingAssembler.toEntities(documents);
    }

    async findByGuestIdAndDateFromOrderAndNotCanceledByDateAsc(guestId: string, dateFrom: Date,): Promise<Booking[]> {
        const documents = await this.bookingModel.find({
            guest: guestId,
            menuDate: {
                $gte: dateFrom
            }
        }).sort({date: -1}).exec();
        return this.bookingAssembler.toEntities(documents);
    }

    async findByGuestIdAndDateToOrderByDate(guestId: string, dateTo: Date, page: number, size: number): Promise<Booking[]> {
        const documents = await this.bookingModel.find({
            guest: guestId,
            confirmed: true,
            menuDate: {
                $lte: dateTo
            }
        }).sort({date: -1}).skip(page * size).limit(size).exec();
        return this.bookingAssembler.toEntities(documents);
    }

}