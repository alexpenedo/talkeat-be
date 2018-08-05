import {User} from "../interfaces/user.interface";
import {BaseRepository} from "../../common/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        super(userModel);
    }

    findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email}).exec();
    }
}