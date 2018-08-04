import {BadRequestException, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {BookingRepository} from "./repositories/booking.repository";
import {Booking} from "./interfaces/booking.interface";
import {MenuService} from "../menus/menu.service";
import {Menu} from "../menus/interfaces/menu.interface";

@Injectable()
export class BookingService {
    constructor(private bookingRepository: BookingRepository, private menuService: MenuService) {
    }

    async create(booking: Booking): Promise<Booking> {
        const menu: Menu = await this.menuService.findById(booking.menu.id);
        if (menu.available < 1) {
            throw new BadRequestException('Menu has not availability');
        }
        menu.available--;
        await this.menuService.update(menu._id, menu);
        return await this.bookingRepository.save(booking);
    }

    async findById(id: string): Promise<Booking> {
        return await this.bookingRepository.findById(id);
    }

    async confirmBooking(id: string): Promise<Booking> {
        const booking: Booking = await this.findById(id);
        booking.confirmed = true;
        return await this.update(id, booking);
    }

    async update(id: string, newValue: Booking): Promise<Booking> {
        return await this.bookingRepository.update(id, newValue);
    }

    async delete(id: string): Promise<Booking> {
        return await this.bookingRepository.delete(id);
    }

    async findByMenuId(menuId: string): Promise<Booking[]> {
        return await this.bookingRepository.findByMenuId(menuId);
    }

    async findGuestBookingsFinished(guestId: string): Promise<Booking[]> {
        return await this.bookingRepository.findByGuestIdAndDateToOrderByDate(guestId, new Date());
    }
    async findGuestBookingsPending(guestId: string): Promise<Booking[]> {
        return await this.bookingRepository.findByGuestIdAndDateFromOrderByDateAsc(guestId, new Date());
    }

}
