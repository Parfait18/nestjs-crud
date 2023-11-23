import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { ApiResponse, JwtPayload } from 'src/utils/common.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  private _createToken({ email, password }: JwtPayload) {
    const user: JwtPayload = { email, password };
    const authorization = this.jwtService.sign(user);

    return {
      expireIn: process.env.EXPIRESIN,
      token: authorization,
    };
  }

  async registrer(userDto: CreateUserDto): Promise<ApiResponse> {
    let result: ApiResponse = {
      success: true,
      message: 'Account created Successfully',
    };
    try {
      const user = this.userService.create(userDto);
      result.data = user;
    } catch (error) {
      result = {
        success: false,
        message: error,
      };
    }
    return result;
  }

  async signIn(loginUserDto: LoginUserDto): Promise<any> {
    //find user in db
    const user = await this.userService.findByLogin(loginUserDto);

    //create token
    const token = this._createToken(user);

    return {
      token,
      ...user,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findByLogin(payload);
    if (!user) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async verifyToken(token: string) {
    let result: ApiResponse = {
      success: true,
      message: 'Token valid',
    };
    try {
      const response = await this.jwtService.verify(token, {
        secret: process.env.SECRETKEY,
      });
      result.data = response;
    } catch (error) {
      result = {
        success: false,
        message: `${error}`,
      };
    }

    return result;
  }
}
