import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, organizationId: user.organizationId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, name: string, organizationName: string) {
    const existing = await this.prisma.client.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const org = await this.prisma.client.organization.create({
      data: {
        name: organizationName,
      }
    });

    const user = await this.prisma.client.user.create({
      data: {
        email,
        name,
        role: 'ADMIN',
        organizationId: org.id,
      }
    });

    return this.login(user);
  }
}
