import { SetMetadata } from '@nestjs/common';

export const Access = (role: string) => SetMetadata('role', role);
