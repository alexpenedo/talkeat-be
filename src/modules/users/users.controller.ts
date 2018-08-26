import {
    Body,
    Controller,
    Delete,
    FileInterceptor,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from './user.service';
import {AuthGuard} from '@nestjs/passport';
import * as path from "path";
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {User} from "./domain/user";

@ApiUseTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {
    }

    @Get('picture')
    @ApiOperation({title: 'Get user picture by id '})
    async getPicture(@Query('id') id: string, @Res() res) {
        res.sendFile(path.resolve('./uploads/' + id))
    }

    @Get(':id')
    @ApiOperation({title: 'Get user by id'})
    // @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id: string): Promise<User> {
        return await this.userService.findById(id);
    }

    @Post()
    @ApiOperation({title: 'Create user'})
    async create(@Body(new ValidationPipe({transform: true})) user: User) {
        return await this.userService.create(<User>user);
    }

    @Put(':id')
    @ApiOperation({title: 'Update user by id'})
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: string, @Body() user: User) {
        return await this.userService.update(id, <User>user);
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete user by id'})
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }

    @Post('picture')
    @ApiOperation({title: 'Save picture user'})
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {dest: './uploads/'}))
    async uploadFile(@UploadedFile() file, @Req() request) {
        const user: User = request.user;
        return await this.userService.savePicture(user, file.filename);
    }
}
