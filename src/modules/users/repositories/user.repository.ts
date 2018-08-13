import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";
import {User} from "../domain/user";

@Injectable()
export class UserRepository extends BaseRepository<User> {

    constructor(@InjectModel('User') private readonly userModel) {
        super(userModel);
    }

    findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email}).exec();
    }
}