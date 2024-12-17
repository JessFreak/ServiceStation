import { Order, OrderService, Service, User, Vehicle } from '@prisma/client';

export interface OrderServiceWithService extends OrderService {
  service: Service;
}

export interface OrderDB extends Order {
  services: OrderServiceWithService[];
  worker: User;
  vehicle: Vehicle & {
    user: User;
  };
}