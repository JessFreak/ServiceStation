import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RoleGuard } from '../guards/RoleGuard';

export function Access (role?: string) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RoleGuard),
    SetMetadata('role', role),
  );
}
