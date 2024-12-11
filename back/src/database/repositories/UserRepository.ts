import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../PrismaService';

@Injectable()
export class UserRepository {
  constructor (private prisma: PrismaService) {}

  async create (data: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({ data });
  }

  async find (where: Prisma.UserWhereInput){
    return this.prisma.user.findFirst({ where });
  }

  async findById (id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findByEmail (email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
}