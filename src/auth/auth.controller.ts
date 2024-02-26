import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: User): Promise<{ access_token: string }> {
    const validatedUser = await this.authService.validateUser(user.email, user.password);
    if (!validatedUser) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(validatedUser);
  }
}
