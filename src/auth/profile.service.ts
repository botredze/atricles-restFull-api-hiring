import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entity/user.profile.entity';
import {User} from "./entity/user.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

  async createOrUpdateProfile(profileData: Partial<UserProfile>, userId: User): Promise<UserProfile> {
    let profile = await this.profileRepository.findOne({ where: {user: userId} });

    if (!profile) {
      profile = this.profileRepository.create({ ...profileData, user: userId });
    } else {
      profile = this.profileRepository.merge(profile, profileData);
    }

    return this.profileRepository.save(profile);
  }
}
