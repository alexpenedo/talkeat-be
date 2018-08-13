import {User} from "../../src/modules/users/domain/user";
import * as faker from 'faker';
import {UserRepository} from "../../src/modules/users/repositories/user.repository";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserBuilder {
    private _user: User;

    constructor(private userRepository: UserRepository) {
        this._user = new User();
    }

    withId(id: string): UserBuilder {
        this._user._id = id;
        return this;
    }

    withName(name: any): UserBuilder {
        this._user.name = name
        return this;
    }

    withSurname(surname: any): UserBuilder {
        this._user.surname = surname;
        return this;
    }

    withEmail(email: any): UserBuilder {
        this._user.email = email;
        return this;
    }

    withMobileNumber(mobileNumber: any): UserBuilder {
        this._user.mobileNumber = mobileNumber;
        return this;
    }

    withPassword(password: any): UserBuilder {
        this._user.password = password;
        return this;
    }

    withPicture(picture: any): UserBuilder {
        this._user.picture = picture;
        return this;
    }

    withPostalCode(postalCode: any): UserBuilder {
        this._user.postalCode = postalCode;
        return this;
    }

    withAddress(address: any): UserBuilder {
        this._user.address = address;
        return this;
    }

    withCountry(country: any): UserBuilder {
        this._user.country = country;
        return this;
    }

    withValidData(): UserBuilder {
        const name = faker.name.firstName();
        const surname = faker.name.lastName();
        const email = faker.internet.email(name, surname);
        const mobileNumber = faker.phone.phoneNumber();
        const password = faker.random.alphaNumeric(10);
        const postalCode = faker.address.zipCode();
        const address = faker.address.streetAddress();
        const country = faker.address.country();
        return this.withName(name)
            .withSurname(surname)
            .withEmail(email)
            .withMobileNumber(mobileNumber)
            .withPassword(password)
            .withPostalCode(postalCode)
            .withAddress(address)
            .withCountry(country);
    }

    build(): User {
        return this._user;
    }

    async store(): Promise<User> {
        return await this.userRepository.save(this._user);
    }
}
