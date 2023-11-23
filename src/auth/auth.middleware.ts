import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { AuthService } from './auth.service';

//this middleware is only called for route where it is applied
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      //get only token from header
      const token = req.headers.authorization.split(' ')[1];
      //verify token if is  valid
      const isValid = await this.authService.verifyToken(token);
      if (!isValid.success) {
        throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      return next(new UnauthorizedException());
    }
    next();
  }
}
