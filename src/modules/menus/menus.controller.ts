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
    UseGuards, ValidationPipe
} from '@nestjs/common';
import {MenuService} from './menu.service';
import {Menu} from "./domain/menu";
import {FindUserMenusRequest} from "./dto/find-user-menus.request";
import {AuthGuard} from "@nestjs/passport";
import {BookingService} from "../bookings/booking.service";
import {Status} from "../../common/enums/status.enum";
import {ApiUseTags} from "@nestjs/swagger";
import {FindLocatedMenusRequest} from "./dto/find-located-menus.request";

@ApiUseTags('Menus')
@Controller('menus')
export class MenusController {
    constructor(private readonly menuService: MenuService,
                private readonly bookingSevice: BookingService) {
    }

    @Get('located')
    async findUserMenusLocated(@Query(new ValidationPipe({transform: true}))
                                   findLocatedMenusRequest: FindLocatedMenusRequest, @Req() request) {
        return this.menuService.findUserMenus(findLocatedMenusRequest);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findHostMenus(@Query(new ValidationPipe({transform: true}))
                            findUserMenusRequest: FindUserMenusRequest) {
        return await this.menuService.findHostMenus(findUserMenusRequest);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body(new ValidationPipe({transform: true})) menu: Menu) {
        return await this.menuService.create(menu);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body(new ValidationPipe({transform: true})) menu: Menu): Promise<Menu> {
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