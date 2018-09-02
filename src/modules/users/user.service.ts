import {Injectable, NotFoundException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserRepository} from "./repositories/user.repository";
import * as fs from 'fs';
import {User} from "./domain/user";
import {ConfigService} from "../infrastructure/config/config.service";

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository,
                private config: ConfigService) {
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
        const user = await this.userRepository.findById(id);
        return await this.userRepository.update(user._id, newValue);
    }

    async delete(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        return await this.userRepository.delete(user._id);
    }

    async savePicture(user: User, filename: string): Promise<User> {
        if (user.picture) {
            fs.unlink(user.picture, () => {
            });
        }
        user.picture = filename;
        return await this.update(user._id, user);
    }
}
