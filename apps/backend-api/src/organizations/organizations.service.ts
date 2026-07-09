import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrganization(id: string) {
    return this.prisma.client.organization.findUnique({
      where: { id },
      include: { users: { select: { id: true, email: true, firstName: true, lastName: true, roleId: true } } }
    });
  }

  async inviteUser(data: { email: string, organizationId: string, roleId?: string }) {
    // In a real system this would send an email and generate a temporary token
    // For Sprint 2, we simulate success
    return {
      message: `Invitation sent to ${data.email} for organization ${data.organizationId}`,
      success: true
    };
  }
}
