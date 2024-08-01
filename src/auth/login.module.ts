import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/users/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './authencation/jwt.strategy';

@Module({
  imports: [UserModule,
    JwtModule.register({
      secret: 'anonymous',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtService,JwtStrategy],
})
export class LoginModule { }
