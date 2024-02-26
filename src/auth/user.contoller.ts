import { Controller, Post, Body, HttpStatus, HttpException, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body('email') email: string, @Body('password') password: string): Promise<User> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return this.userService.createUser(email, password);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }
}
