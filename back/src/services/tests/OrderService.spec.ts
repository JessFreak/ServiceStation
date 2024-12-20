import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../OrderService';
import { OrderRepository } from '../../database/repositories/OrderRepository';
import { UserRepository } from '../../database/repositories/UserRepository';
import { NoAvailableWorkerException } from '../../utils/exceptions/NoAvailableWorkerException';
import { NotBelongException } from '../../utils/exceptions/NotBelongException';
import { Status } from '@prisma/client';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            updateById: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('should create an order if worker is available', async () => {
      const mockWorker = { id: 'worker-id', workingOrders: [] };
      const mockOrderDTO = {
        orderDate: '2024-12-20T10:00:00',
        vehicleId: 'vehicle-id',
        services: ['service-id'],
      };

      userRepository.findMany = jest.fn().mockResolvedValue([mockWorker]);
      orderRepository.create = jest.fn().mockResolvedValue({ id: 'order-id', ...mockOrderDTO });

      const result = await orderService.create(mockOrderDTO);

      expect(result).toEqual({ id: 'order-id', ...mockOrderDTO });
      expect(orderRepository.create).toHaveBeenCalledWith(expect.objectContaining({ workerId: mockWorker.id }));
    });

    it('should throw NoAvailableWorkerException if no worker is available', async () => {
      const mockOrderDTO = {
        orderDate: '2024-12-20T10:00:00',
        vehicleId: 'vehicle-id',
        services: ['service-id'],
      };

      userRepository.findMany = jest.fn().mockResolvedValue([]);

      await expect(orderService.create(mockOrderDTO)).rejects.toThrow(NoAvailableWorkerException);
    });
  });

  describe('getAll', () => {
    it('should return a list of orders', async () => {
      const mockOrders = [
        { id: 'order-1', vehicleId: 'vehicle-id', status: Status.WAITING },
        { id: 'order-2', vehicleId: 'vehicle-id', status: Status.WAITING },
      ];
      orderRepository.findMany = jest.fn().mockResolvedValue(mockOrders);

      const result = await orderService.getAll({ vehicleId: 'vehicle-id', status: Status.WAITING });

      expect(result).toEqual(mockOrders);
      expect(orderRepository.findMany).toHaveBeenCalledWith(expect.objectContaining({ vehicleId: 'vehicle-id' }));
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      const mockOrder = { id: 'order-id', status: Status.WAITING };
      const mockUpdatedOrder = { ...mockOrder, status: Status.DONE };

      orderRepository.updateById = jest.fn().mockResolvedValue(mockUpdatedOrder);

      const result = await orderService.updateStatus('order-id', Status.DONE);

      expect(result.status).toBe(Status.DONE);
      expect(orderRepository.updateById).toHaveBeenCalledWith('order-id', { status: Status.DONE });
    });
  });

  describe('cancel', () => {
    it('should throw NotBelongException if user does not own the order', async () => {
      const mockOrder = { id: 'order-id', vehicle: { userId: 'other-user-id' } };

      orderRepository.findById = jest.fn().mockResolvedValue(mockOrder);

      await expect(orderService.cancel('user-id', 'order-id')).rejects.toThrow(NotBelongException);
    });

    it('should cancel the order if user owns the order', async () => {
      const mockOrder = { id: 'order-id', vehicle: { userId: 'user-id' }, status: Status.WAITING };
      const mockCancelledOrder = { ...mockOrder, status: Status.CANCELED };

      orderRepository.findById = jest.fn().mockResolvedValue(mockOrder);
      orderRepository.updateById = jest.fn().mockResolvedValue(mockCancelledOrder);

      const result = await orderService.cancel('user-id', 'order-id');

      expect(result.status).toBe(Status.CANCELED);
      expect(orderRepository.updateById).toHaveBeenCalledWith('order-id', { status: Status.CANCELED });
    });
  });
});
