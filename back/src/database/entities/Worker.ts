import { Order, User } from '@prisma/client';

export interface Worker extends User {
  workingOrders: Order[];
}