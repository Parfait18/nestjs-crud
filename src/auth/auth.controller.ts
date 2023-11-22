import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiResponse } from 'src/utils/common.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { UpdateUserPasswordDto } from 'src/user/dto/update-user-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    const result: ApiResponse = await this.authService.registrer(createUserDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('signin')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.signIn(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Put('/update/password')
  async updatePassword(
    @Request() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    await this.userService.updatePassword(updateUserPasswordDto, req.user.id);
    return {
      message: 'password_update_success',
    };
  }
}
