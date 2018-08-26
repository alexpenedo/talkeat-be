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
import {RateService} from './rate.service';
import {Rate} from "./domain/rate";
import {AuthGuard} from "@nestjs/passport";
import {ApiUseTags, ApiOperation} from "@nestjs/swagger";

@ApiUseTags('Rates')
@Controller('rates')
export class RatesController {
    constructor(private readonly rateService: RateService) {
    }

    @Get()
    @ApiOperation({title: 'Get rates by host or guest'})
    async getRates(@Query('hostId') hostId, @Query('guestId') guestId) {
        if (hostId) {
            return await this.rateService.getHostRates(hostId);
        } else if (guestId) {
            return await this.rateService.getGuestRates(guestId);
        } else {
            throw new BadRequestException('Param hostId or guestId is required');
        }
    }

    @Get('average')
    @ApiOperation({title: 'Get host average rating'})
    async getHostAverage(@Query('hostId') hostId) {
        if (!hostId) throw new BadRequestException('Param hostId is required');
        return await this.rateService.getHostAverageRating(hostId);
    }

    @Post()
    @ApiOperation({title: 'Create rate'})
    @UseGuards(AuthGuard('jwt'))
    async create(@Body(new ValidationPipe({transform: true})) rate: Rate) {
        return await this.rateService.create(rate);
    }

    @Get(':id')
    @ApiOperation({title: 'Get rate by id'})
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id) {
        return await this.rateService.findById(id);
    }


    @Put(':id')
    @ApiOperation({title: 'Update rate by id'})
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body(new ValidationPipe({transform: true})) rate: Rate) {
        return await this.rateService.update(id, rate);
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete rate by id'})
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id) {
        return await this.rateService.delete(id);
    }
}
