import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {User} from './interfaces/user.interface';
import config from "../../config";
import {UserRepository} from "./repositories/user.repository";
import * as fs from 'fs';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {
    }

    async create(user: User): Promise<User> {
        user.password = bcrypt.hashSync(user.password, config.bcryptSaltRounds);
        return await this.userRepository.save(user);
    }

    async findById(id: string): Promise<User> {
        return await this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findByEmail(email);
    }

    async update(id: string, newValue: User): Promise<User> {
        return await this.userRepository.update(id, newValue);
    }

    async delete(id: string): Promise<User> {
        return await this.userRepository.delete(id);
    }

    async savePicture(user: User, filename: string) {
        if (!user.picture) {
            fs.unlinkSync(user.picture);
        }
        user.picture = filename;
        return await this.update(user._id, user);
    }
}
