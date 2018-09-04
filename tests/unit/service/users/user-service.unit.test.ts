import {UserService} from "../../../../src/modules/users/user.service";
import {Test} from "@nestjs/testing";
import {User} from "../../../../src/modules/users/domain/user";
import {UserRepository} from "../../../../src/modules/users/repositories/user.repository";
import {ConfigService} from "../../../../src/modules/infrastructure/config/config.service";
import {NotFoundException} from "@nestjs/common";
import {UserBuilder} from "../../../builders/user.builder";

describe('UserService Unit tests', () => {
    let userService: UserService;
    let userRepository: UserRepository;
    let userBuilder: UserBuilder;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserService, UserBuilder, {
                provide: UserRepository,
                useValue: new UserRepository(undefined, undefined)
            }, {
                provide: ConfigService,
                useValue: new ConfigService(`env/test.env`)
            }],
        }).compile();
        userBuilder = module.get<UserBuilder>(UserBuilder);
        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('findById', () => {
        it('should return an user', async () => {
            const result = userBuilder.withValidData().build();
            jest.spyOn(userRepository, 'findById').mockImplementation(() => result);
            expect(await userService.findById('id')).toBe(result);
        });

        it('should throw NotFoundException', async () => {
            jest.spyOn(userRepository, 'findById').mockImplementation(() => null);
            try {
                await userService.findById('id')
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        })
    });
    describe('findByEmail', () => {
        it('should return an user', async () => {
            const result = userBuilder.withValidData().build();
            jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => result);
            expect(await userService.findByEmail('email')).toBe(result);
        });

        it('should throw NotFoundException', async () => {
            jest.spyOn(userRepository, 'findByEmail').mockImplementation(() => null);
            try {
                await userService.findByEmail('email')
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        })
    });

    describe('update', () => {
        it('should update user', async () => {
            const result = userBuilder.withValidData().build();
            const modified = userBuilder.withValidData().build();
            jest.spyOn(userRepository, 'findById').mockImplementation(() => result);
            jest.spyOn(userRepository, 'update').mockImplementation(() => modified);
            expect(await userService.update('id', modified)).toBe(modified);
        });

        it('should throw NotFoundException', async () => {
            jest.spyOn(userRepository, 'findById').mockImplementation(() => null);
            try {
                await userService.update('id', new User());
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        })
    });

    describe('delete', () => {
        it('should delete user', async () => {
            const user = userBuilder.withValidData().build();
            jest.spyOn(userRepository, 'findById').mockImplementation(() => user);
            jest.spyOn(userRepository, 'delete').mockImplementation(() => user);
            expect(await userService.delete('id')).toBe(user);
        });

        it('should throw NotFoundException', async () => {
            jest.spyOn(userRepository, 'findById').mockImplementation(() => null);
            try {
                await userService.delete('id');
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        })
    });

});