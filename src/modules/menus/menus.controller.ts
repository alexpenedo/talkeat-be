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
import {ApiUseTags, ApiOperation} from "@nestjs/swagger";
import {FindLocatedMenusRequest} from "./dto/find-located-menus.request";

@ApiUseTags('Menus')
@Controller('menus')
export class MenusController {
    constructor(private readonly menuService: MenuService,
                private readonly bookingSevice: BookingService) {
    }

    @Get('located')
    @ApiOperation({title: 'Get located and sorted menus'})
    async findUserMenusLocated(@Query(new ValidationPipe({transform: true}))
                                   findLocatedMenusRequest: FindLocatedMenusRequest, @Req() request) {
        return this.menuService.findUserMenus(findLocatedMenusRequest);
    }

    @Get()
    @ApiOperation({title: 'Get host menus'})
    @UseGuards(AuthGuard('jwt'))
    async findHostMenus(@Query(new ValidationPipe({transform: true}))
                            findUserMenusRequest: FindUserMenusRequest) {
        if (findUserMenusRequest.status == Status.PENDING) {
            return await this.menuService.findHostMenusPending(findUserMenusRequest.host,
                +findUserMenusRequest.page, +findUserMenusRequest.size);
        }
        else if (findUserMenusRequest.status == Status.FINISHED) {
            return await this.menuService.findHostMenusFinished(findUserMenusRequest.host,
                +findUserMenusRequest.page, +findUserMenusRequest.size);
        }
        else throw new BadRequestException('Status must be PENDING or FINISHED');
    }

    @Post()
    @ApiOperation({title: 'Create menu'})
    @UseGuards(AuthGuard('jwt'))
    async create(@Body(new ValidationPipe({transform: true})) menu: Menu) {
        return await this.menuService.create(menu);
    }

    @Put(':id')
    @ApiOperation({title: 'Update menu by id'})
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body(new ValidationPipe({transform: true})) menu: Menu): Promise<Menu> {
        return await this.menuService.update(id, menu);
    }

    @Get(':id')
    @ApiOperation({title: 'Get menu by id'})
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id) {
        return await this.menuService.findById(id);
    }

    @Post(':id/cancel')
    @ApiOperation({title: 'Cancel menu by id'})
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id) {
        return await this.menuService.cancelMenu(id);
    }

    @Get(':id/bookings')
    @ApiOperation({title: 'Get menu bookings by menu id'})
    @UseGuards(AuthGuard('jwt'))
    async getBookingsByMenuId(@Param('id') id) {
        return await this.bookingSevice.findByMenuId(id);
    }
}
