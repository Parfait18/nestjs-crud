import { HttpStatus } from '@nestjs/common';

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  stattusCode?: HttpStatus | HttpStatus.OK;
}

export type JwtPayload = {
  email: string;
  password: string;
};
