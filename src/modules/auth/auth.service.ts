import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public async generateToken(user: any) {
    const payload = { _id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
