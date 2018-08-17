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
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {BookingService} from './booking.service';
import {Booking} from "./domain/booking";
import {AuthGuard} from "@nestjs/passport";
import {Status} from "../../common/enums/status.enum";
import {ApiUseTags} from "@nestjs/swagger";
import {RateService} from "../rates/rate.service";
import {FindUserMenusRequest} from "../menus/dto/find-user-menus.request";
import {FindUserBookingsRequest} from "./dto/find-user-bookings.request";

@ApiUseTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingService: BookingService,
                private readonly rateService: RateService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findByStatus(@Query(new ValidationPipe({transform: true}))
                           findUserBookingsRequest: FindUserBookingsRequest) {
        if (findUserBookingsRequest.status == Status.PENDING) {
            return await this.bookingService.findGuestBookingsPending(findUserBookingsRequest.guest,
                +findUserBookingsRequest.page, +findUserBookingsRequest.size);
        }
        else if (findUserBookingsRequest.status == Status.FINISHED) {
            return await this.bookingService.findGuestBookingsFinished(findUserBookingsRequest.guest,
                +findUserBookingsRequest.page, +findUserBookingsRequest.size);
        }
        else throw new BadRequestException('Status must be PENDING or FINISHED');
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body(new ValidationPipe({transform: true})) booking: Booking) {
        return await this.bookingService.create(booking);
    }

    @Post(':id/confirm')
    @UseGuards(AuthGuard('jwt'))
    async confirmBooking(@Param('id') id) {
        return await this.bookingService.confirmBooking(id);
    }

    @Post(':id/cancel')
    @UseGuards(AuthGuard('jwt'))
    async cancelBooking(@Param('id') id) {
        return await this.bookingService.cancelBooking(id);
    }

    @Get(':id/rates')
    @UseGuards(AuthGuard('jwt'))
    async getBookingRates(@Param('id') id) {
        return await this.rateService.getBookingRates(id);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id) {
        return await this.bookingService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body(new ValidationPipe({transform: true})) booking: Booking) {
        return await this.bookingService.update(id, booking);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id) {
        return await this.bookingService.delete(id);
    }
}
