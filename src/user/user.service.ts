import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { Prisma, Role } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    // // check if the user exists in the db
    const userInDb = await this.userRepository.findByEmail({
      email: createUserDto.email,
    });
    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    return this.userRepository.create({
      data: {
        ...createUserDto,
        role: Role.CLIENT,
        password: await hash(createUserDto.password, 10),
      },
    });
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findById(id: number) {
    return this.userRepository.findById(id);
  }

  findOne(options: Prisma.UserWhereUniqueInput) {
    return this.userRepository.findByEmail(options);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.deleteUser(id);
  }

  //use by user module to change user password
  async updatePassword(
    payload: UpdateUserPasswordDto,
    id: number,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await compare(payload.oldPassword, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.userRepository.updateUser(id, {
      password: await hash(payload.newPassword, 10),
    });
  }

  async findByLogin({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findByEmail({ email: email });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const equalPassword = compare(password, user.password);

    if (!equalPassword) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
