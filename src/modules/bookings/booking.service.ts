import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BookingRepository} from "./repositories/booking.repository";
import {Booking} from "./domain/booking";
import {MenuService} from "../menus/menu.service";
import {Menu} from "../menus/domain/menu";

@Injectable()
export class BookingService {
    constructor(private bookingRepository: BookingRepository,
                @Inject(forwardRef(() => MenuService))
                private menuService: MenuService) {
    }

    async create(booking: Booking): Promise<Booking> {
        const menu: Menu = await this.menuService.findById(booking.menu._id);
        if (menu.available < 1) {
            throw new BadRequestException('Menu has not availability');
        }
        menu.available -= booking.persons;
        await this.menuService.update(menu._id, menu);
        return await this.bookingRepository.save(booking);
    }

    async findById(id: string): Promise<Booking> {
        const booking: Booking = await this.bookingRepository.findById(id);
        if (!booking)
            throw new NotFoundException(`Booking with id=${id} has not found`);
        return booking;
    }

    async confirmBooking(id: string): Promise<Booking> {
        const booking: Booking = await this.findById(id);
        booking.confirmed = true;
        return await this.update(id, booking);
    }

    async cancelBooking(id: string): Promise<Booking> {
        const booking: Booking = await this.findById(id);
        const menu: Menu = await this.menuService.findById(booking.menu._id);
        menu.available += booking.persons;
        await this.menuService.update(menu._id, menu);
        booking.canceled = true;
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

    async findGuestBookingsPendingIncludingCanceled(guestId: string): Promise<Booking[]> {
        return await this.bookingRepository.findByGuestIdAndDateFromOrderAndNotCanceledByDateAsc(guestId, new Date());
    }

}
