import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {RateService} from './rate.service';
import {Rate} from "./interfaces/rate.interface";
import {AuthGuard} from "@nestjs/passport";

@Controller('rates')
export class RatesController {
    constructor(private readonly rateService: RateService) {
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() rate: Rate) {
        return await this.rateService.create(rate);
    }

    @Get()
    async getHostRates(@Query('hostId') hostId) {
        return await this.rateService.getHostRates(hostId);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id) {
        return await this.rateService.findById(id);
    }

    @Get('average')
    async getHostAverage(@Query('hostId') hostId) {
        return await this.rateService.getHostAverageRating(hostId);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body() rate: Rate) {
        return await this.rateService.update(id, rate);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id) {
        return await this.rateService.delete(id);
    }
}
