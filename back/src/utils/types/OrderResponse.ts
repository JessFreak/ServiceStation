import { UserResponse } from './UserResponse';
import { Vehicle } from '@prisma/client';

export type ServiceResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderResponse = {
  id: string;
  status: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  totalPrice: number;
  services: ServiceResponse[];
  worker: UserResponse;
  vehicle: Vehicle;
};
