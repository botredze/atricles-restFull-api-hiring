import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../src/auth/user.service';
import { User } from '../src/auth/entity/user.entity';
import {UserProfile} from "../src/auth/entity/user.profile.entity";

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let usersService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        usersService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return a user if user is found', async () => {
            const userProfile: UserProfile = {id: 1, firstName: 'Баатыр', lastName: "aliev", phoneNumber: "+996990554356", nickname: 'baaliev',}
            const user: User = { id: 1, email: 'testuser', password: 'testpassword', profile: userProfile};
            jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

            const result = await service.validateUser('testuser', 'testpassword');

            expect(result).toEqual(user);
        });

        it('should return null if user is not found', async () => {
            jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

            const result = await service.validateUser('testuser', 'testpassword');

            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return an object with access_token property', async () => {
            const user: User = { id: 1, email: 'testuser', password: 'testpassword'};
            jest.spyOn(jwtService, 'sign').mockReturnValue('test_access_token');
            const expectedResponse = { access_token: 'test_access_token' };

            const result = await service.login(user);

            expect(result).toEqual(expectedResponse);
        });
    });
});
