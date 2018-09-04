import {Injectable, NotFoundException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserRepository} from "./repositories/user.repository";
import {User} from "./domain/user";
import {ConfigService} from "../infrastructure/config/config.service";
import {StorageService} from "../infrastructure/storage/storage.service";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository,
                private readonly config: ConfigService,
                private readonly storageService: StorageService) {
    }

    async create(user: User): Promise<User> {
        user.password = bcrypt.hashSync(user.password, this.config.bcryptSaltRounds);
        return await this.userRepository.save(user);
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new NotFoundException('User not found');
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, newValue: User): Promise<User> {
        const user = await this.findById(id);
        return await this.userRepository.update(user._id, newValue);
    }

    async delete(id: string): Promise<User> {
        const user = await this.findById(id);
        return await this.userRepository.delete(user._id);
    }

    async savePicture(user: User, filename: string): Promise<User> {
        await this.storageService.uploadFile(`${this.config.tmpFolder}${filename}`);
        user.picture = filename;
        return await this.update(user._id, user);
    }

    async getPicture(picture: string): Promise<string> {
        await this.storageService.getFile(picture);
        return `${this.config.tmpFolder}${picture}`;
    }
}
