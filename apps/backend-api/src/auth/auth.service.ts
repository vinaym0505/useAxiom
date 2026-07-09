import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: any) {
    // 1. Create Org
    const org = await this.prisma.client.organization.create({
      data: { name: data.organizationName }
    });

    // 2. Create User
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.client.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        organizationId: org.id
      }
    });

    return this.login(user);
  }

  async login(userOrData: any) {
    let user = userOrData;
    if (!user.id) {
      user = await this.prisma.client.user.findUnique({ where: { email: userOrData.email }});
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isMatch = await bcrypt.compare(userOrData.password, user.passwordHash);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, organizationId: user.organizationId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
