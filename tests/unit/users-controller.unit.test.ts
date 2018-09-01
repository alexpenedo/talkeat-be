import {UsersController} from "../../src/modules/users/users.controller";
import {UserService} from "../../src/modules/users/user.service";
import {Test} from "@nestjs/testing";
import {User} from "../../src/modules/users/domain/user";
import {UserRepository} from "../../src/modules/users/repositories/user.repository";
import {ConfigService} from "../../src/modules/infrastructure/config/config.service";

describe('UsersController', () => {
    let usersController: UsersController;
    let userService: UserService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UserService, {
                provide: UserRepository,
                useValue: {}
            }, {
                provide: ConfigService,
                useValue: new ConfigService(`env/test.env`)
            }],
        }).compile();

        userService = module.get<UserService>(UserService);
        usersController = module.get<UsersController>(UsersController);
    });

    describe('get', () => {
        it('should return an user', async () => {
            const result = new User();
            jest.spyOn(userService, 'findById').mockImplementation(() => result);
            expect(await usersController.get('id')).toBe(result);
        });
    });
    describe('create', () => {
        it('should cerate an user', async () => {
            const result = new User();
            jest.spyOn(userService, 'create').mockImplementation(() => result);
            expect(await usersController.create(result)).toBe(result);
        });
    });
    describe('update', () => {
        it('should update an user', async () => {
            const result = new User();
            jest.spyOn(userService, 'update').mockImplementation(() => result);
            expect(await usersController.update('id', result)).toBe(result);
        });
    });
});