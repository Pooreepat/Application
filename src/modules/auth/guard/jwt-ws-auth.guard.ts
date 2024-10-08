import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsOnConnectAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;
console.log(token)
    try {
      const decoded = this.jwtService.verify(token);
      client.data.user = decoded; 
      return true;
    } catch (err) {
      return false;
    }
  }
}
