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
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';
import {User} from "./domain/user";
import {GenericAssembler} from "../../common/assemblers/generic-assembler";

@ApiUseTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {
    }

    @Get('picture')
    async getPicture(@Query('id') id: string, @Res() res) {
        res.sendFile(path.resolve('./uploads/' + id))
    }

    @Get(':id')
    // @UseGuards(AuthGuard('jwt'))
    async get(@Param('id') id: string): Promise<User> {
        return await this.userService.findById(id);
    }

    @Post()
    async create(@Body(new ValidationPipe({transform: true})) user: User) {
        return await this.userService.create(<User>user);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: string, @Body() user: User) {
        return await this.userService.update(id, <User>user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }

    @Post('picture')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {dest: './uploads/'}))
    async uploadFile(@UploadedFile() file, @Req() request) {
        const user: User = request.user;
        return await this.userService.savePicture(user, file.filename);
    }
}
