import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {BookingService} from './booking.service';
import {Booking} from "./interfaces/booking.interface";
import {AuthGuard} from "@nestjs/passport";
import {Status} from "../../common/enums/status.enum";

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingService: BookingService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findByStatus(@Query('guestId') guestId: string, @Query('status') status: Status) {
        if (status == Status.PENDING) {
            return await this.bookingService.findGuestBookingsPending(guestId);
        }
        else if (status == Status.FINISHED) {
            return await this.bookingService.findGuestBookingsFinished(guestId);
        }
        else throw new BadRequestException('Status must be PENDING or FINISHED');
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() booking: Booking) {
        return await this.bookingService.create(booking);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id) {
        return await this.bookingService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body() booking: Booking) {
        return await this.bookingService.update(id, booking);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id) {
        return await this.bookingService.delete(id);
    }
}
