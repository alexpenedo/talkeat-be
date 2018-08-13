import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {MenuRepository} from "./repositories/menu.repository";
import {Menu} from "./domain/menu";
import {BookingService} from "../bookings/booking.service";
import {Booking} from "../bookings/domain/booking";
import * as _ from 'lodash';
import {FindLocatedMenusRequest} from "./dto/find-located-menus.request";

@Injectable()
export class MenuService {
    constructor(private readonly menuRepository: MenuRepository,
                @Inject(forwardRef(() => BookingService))
                private readonly bookingService: BookingService) {
    }

    async create(menu: Menu): Promise<Menu> {
        return await this.menuRepository.save(menu);
    }

    async findById(id: string): Promise<Menu> {
        const menu: Menu = await this.menuRepository.findById(id);
        if (!menu)
            throw new NotFoundException(`Menu with id=${id} has not found`);
        return menu;
    }

    async update(id: string, newValue: Menu): Promise<Menu> {
        return await this.menuRepository.update(id, newValue);
    }

    async delete(id: string): Promise<Menu> {
        return await this.menuRepository.delete(id);
    }

    async findHostMenusFinished(userId: string): Promise<Menu[]> {
        return await this.menuRepository.findByHostIdAndDateToOrderByDate(userId, new Date());
    }

    async findHostMenusPending(userId: string): Promise<Menu[]> {
        return await this.menuRepository.findByHostIdAndDateFromOrderByDate(userId, new Date());
    }

    async findUserMenus(findLocatedMenus: FindLocatedMenusRequest): Promise<Menu[]> {
        const {latitude, longitude, type, date, persons, userId} = findLocatedMenus;
        const coordinates: number[] = [parseFloat(longitude), parseFloat(latitude)];
        const startDate: Date = this.getStartDate(date, type);
        const endDate: Date = this.getEndDate(date, type);
        let menuIds: string[] = [];
        if (userId) {
            const bookings: Booking[] = await this.bookingService.findGuestBookingsPendingIncludingCanceled(userId);
            menuIds = _.map(bookings, 'menu');
        }
        return await this.menuRepository.findByCoordinatesAndDatesAndPersonsAndIdNotInMenusAndHostNotUserId(coordinates,
            startDate, endDate, persons, menuIds, userId);
    }

    private getEndDate(date: string, type: string): Date {
        const end: Date = new Date(date);
        if (type === 'dinner') {
            end.setHours(23);
            end.setMinutes(59);
        }
        else {
            end.setHours(17);
            end.setMinutes(59);
        }
        return end;
    }

    private getStartDate(date: string, type: string): Date {
        const start: Date = new Date(date);
        if (type === 'dinner') {
            start.setHours(18);
            start.setMinutes(0);
        }
        else {
            start.setHours(0);
            start.setMinutes(0);
        }
        return start;
    }
}
