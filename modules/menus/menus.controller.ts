import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {MenuService} from './menu.service';
import {Menu} from "./interfaces/menu.interface";
import {FindParams} from "./interfaces/findParams.interface";
import {AuthGuard} from "@nestjs/passport";
import {BookingService} from "../bookings/booking.service";
import {Status} from "../common/status.enum";
import {User} from "../users/interfaces/user.interface";

@Controller('menus')
export class MenusController {
    constructor(private readonly menuService: MenuService,
                private readonly bookingSevice: BookingService) {
    }

    @Get()
    async findByParams(@Query() params: FindParams, @Req() request) {
        if (params.host && params.status) {
            if (params.status == Status.PENDING) {
                return this.menuService.findHostMenusPending(params.host);
            }
            else if (params.status == Status.FINISHED) {
                return this.menuService.findHostMenusFinished(params.host);
            }
            else throw new BadRequestException('Status must be PENDING or FINISHED');
        }
        else {
            return this.menuService.findUserMenus(params.latitude, params.longitude, params.date, params.type, params.persons, params.userId);
        }
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() menu: Menu) {
        return await this.menuService.create(menu);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body() menu: Menu) {
        return await this.menuService.update(id, menu);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id) {
        return await this.menuService.findById(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id) {
        return await this.menuService.delete(id);
    }

    @Get(':id/bookings')
    @UseGuards(AuthGuard('jwt'))
    async getBookingsByMenuId(@Param('id') id) {
        return await this.bookingSevice.findByMenuId(id);
    }
}
