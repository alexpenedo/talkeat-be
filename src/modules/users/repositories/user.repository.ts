import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";
import {User} from "../domain/user";
import {UserAssembler} from "../../../common/assemblers/user-assembler";

@Injectable()
export class UserRepository extends BaseRepository<User> {

    constructor(@InjectModel('User') private readonly userModel,
                private readonly userAssembler: UserAssembler) {
        super(userModel, userAssembler);
    }

    findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email}).exec();
    }
}