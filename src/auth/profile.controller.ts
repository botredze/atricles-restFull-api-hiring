import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { Request } from 'express';
import { UserProfile } from './entity/user.profile.entity';
import { User } from './entity/user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrUpdateProfile(
      @Body() profileData: Partial<UserProfile>,
      @Req() req: Request & { user: User }
  ): Promise<UserProfile> {

    return this.profileService.createOrUpdateProfile(profileData, req.user);
  }
}
