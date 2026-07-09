import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../common/guards/tenant.guard';

@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  getOrganization(@Request() req: any) {
    return this.organizationsService.getOrganization(req.user.organizationId);
  }

  @Post('invite')
  inviteUser(@Request() req: any, @Body() body: any) {
    return this.organizationsService.inviteUser({
      ...body,
      organizationId: req.user.organizationId
    });
  }
}
