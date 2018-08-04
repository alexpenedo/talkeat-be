import {
    Body,
    Controller,
    Delete, FileInterceptor,
    Get,
    Param,
    Post,
    Put, Query,
    Req, Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from './interfaces/user.interface';
import {AuthGuard} from '@nestjs/passport';
import * as path from "path";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id): Promise<User> {
        return await this.userService.findById(id);
    }

    @Post()
    async create(@Body() user: User) {
        await this.userService.create(user);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id, @Body() user: User) {
        await this.userService.update(id, user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id) {
        await this.userService.delete(id);
    }

    @Post('/picture')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {dest: './uploads/'}))
    async uploadFile(@UploadedFile() file, @Req() request) {
        const user: User = request.user;
        return await this.userService.savePicture(user, file.filename);
    }

    @Get('/picture')
    async getPicture(@Query('id') id, @Res() res) {
        res.sendFile(path.resolve('./uploads/' + id))
    }

}
