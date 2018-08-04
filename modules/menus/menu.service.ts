import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {MenuRepository} from "./repositories/menu.repository";
import {Menu} from "./interfaces/menu.interface";

@Injectable()
export class MenuService {
    constructor(private menuRepository: MenuRepository) {
    }

    async create(menu: Menu): Promise<Menu> {
        return await this.menuRepository.save(menu);
    }

    async findById(id: string): Promise<Menu> {
        return await this.menuRepository.findById(id);
    }

    async update(id: string, newValue: Menu): Promise<Menu> {
        return await this.menuRepository.update(id, newValue);
    }

    async delete(id: string): Promise<Menu> {
        return await this.menuRepository.delete(id);
    }

    async findHostMenusFinished(userId: string) {
        return await this.menuRepository.findByHostIdAndDateToOrderByDate(userId, new Date());
    }

    async findHostMenusPending(userId: string) {
        return await this.menuRepository.findByHostIdAndDateFromOrderByDate(userId, new Date());
    }

    async findUserMenus(latitude: number, longitude: number, date: string, type: string, persons: number) {
        const coordinates: number[] = [latitude, longitude];
        const userId: string = '';// TODO: Coger el usuario de la request?
        const startDate: Date = this.getStartDate(date, type);
        const endDate: Date = this.getEndDate(date, type);
        const menuIds = []; //TODO: Coger menuIds de bookingRepository;
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
            start.setHours(12);
            start.setMinutes(0);
        }
        return start;
    }
}
