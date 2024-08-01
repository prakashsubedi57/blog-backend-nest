import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,

  ) { }


  async validateUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const checkuser = await this.userModel.findOne({ email }).exec();
    if (!checkuser) {
      return null;
    } else {
      const user = await this.userModel.findOne({ email }).select('+password').exec();

      if (user && await bcrypt.compare(pass, user.password as string)) {
        const { password, ...result } = user.toObject();
        return result;
      }
      return null;
    }
  }

  async loginUser(createLoginDto: CreateLoginDto) {
    try {
      const user = await this.validateUser(createLoginDto.email, createLoginDto.password);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: 'anonymous',
        }),
        user: user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userModel.findById(userId).exec();
  }

}
