import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserProfile} from "../src/auth/entity/user.profile.entity";
import {ProfileService} from "../src/auth/profile.service";

describe('ProfileService', () => {
    let service: ProfileService;
    let profileRepository: Repository<UserProfile>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: getRepositoryToken(UserProfile),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
        profileRepository = module.get<Repository<UserProfile>>(getRepositoryToken(UserProfile));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOrUpdateProfile', () => {
        it('should create a new profile if user does not have one', async () => {
            const profileData = { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', nickname: 'johndoe' };
            const userId = { id: 1 }; // Simulate user ID
            jest.spyOn(profileRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(profileRepository, 'create').mockReturnValue(profileData as any);
            jest.spyOn(profileRepository, 'save').mockResolvedValue(profileData as any);

            const result = await service.createOrUpdateProfile(profileData, userId as any);

            expect(profileRepository.findOne).toHaveBeenCalledWith({ where: { user: userId } });
            expect(profileRepository.create).toHaveBeenCalledWith({ ...profileData, user: userId });
            expect(profileRepository.save).toHaveBeenCalledWith(profileData);
            expect(result).toEqual(profileData);
        });

        it('should update an existing profile if user already has one', async () => {
            const existingProfile = { id: 1, firstName: 'Jane', lastName: 'Doe', phoneNumber: '1234567890', nickname: 'janedoe' };
            const updatedProfileData = { firstName: 'Jane Updated', lastName: 'Doe Updated' };
            const userId = { id: 1 }; // Simulate user ID
            jest.spyOn(profileRepository, 'findOne').mockResolvedValue(existingProfile);
            jest.spyOn(profileRepository, 'merge').mockReturnValue({ ...existingProfile, ...updatedProfileData } as any);
            jest.spyOn(profileRepository, 'save').mockResolvedValue({ ...existingProfile, ...updatedProfileData } as any);

            const result = await service.createOrUpdateProfile(updatedProfileData, userId as any);

            expect(profileRepository.findOne).toHaveBeenCalledWith({ where: { user: userId } });
            expect(profileRepository.merge).toHaveBeenCalledWith(existingProfile, updatedProfileData);
            expect(profileRepository.save).toHaveBeenCalledWith({ ...existingProfile, ...updatedProfileData });
            expect(result).toEqual({ ...existingProfile, ...updatedProfileData });
        });
    });
});
