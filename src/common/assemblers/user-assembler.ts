import {Assembler} from "./abstract.assembler";
import {Injectable} from "@nestjs/common";
import {User} from "../../modules/users/domain/user";

@Injectable()
export class UserAssembler extends Assembler<User> {

    toDocument(user: User) {
        return {
            _id: user._id ? user._id : undefined,
            name: user.name,
            surname: user.surname,
            email: user.email,
            mobileNumber: user.mobileNumber,
            password: user.password,
            picture: user.picture,
            postalCode: user.postalCode,
            address: user.address,
            country: user.country
        }
    }

    toEntity(document): User {
        const user: User = new User();
        user._id = document._id ? document._id.toString() : undefined;
        user.name = document.name;
        user.surname = document.surname;
        user.email = document.email;
        user.mobileNumber = document.mobileNumber;
        user.password = document.password;
        user.picture = document.picture;
        user.postalCode = document.postalCode;
        user.address = document.address;
        user.country = document.country;
        return user;
    }

}