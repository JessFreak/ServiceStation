import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from '../ServiceService';
import { ServiceRepository } from '../../database/repositories/ServiceRepository';
import { PrismaService } from '../../database/PrismaService';
import { UpdateServiceDTO, ServiceQueryDTO } from '../../utils/dtos/ServiceDTO';
import { Service } from '@prisma/client';

describe('ServiceService', () => {
  let serviceService: ServiceService;

  const mockServiceRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: ServiceRepository, useValue: mockServiceRepository },
        PrismaService,
      ],
    }).compile();

    serviceService = module.get<ServiceService>(ServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const createServiceDTO = {
        name: 'Test Service',
        price: 100,
        isActive: true,
        description: 'Test description',
        imageUrl: 'https://example.com/image.jpg',
      };
      const mockService: Service = { id: '1', ...createServiceDTO, createdAt: new Date(), updatedAt: new Date() };

      mockServiceRepository.create.mockResolvedValue(mockService);

      const result = await serviceService.create(createServiceDTO);

      expect(mockServiceRepository.create).toHaveBeenCalledWith(createServiceDTO);
      expect(result).toEqual(mockService);
    });
  });

  describe('getAll', () => {
    it('should return a list of services', async () => {
      const serviceQueryDTO: ServiceQueryDTO = { isActive: true, name: 'Test', minPrice: 50, maxPrice: 150 };
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Test Service',
          price: 100,
          isActive: true,
          description: 'Test description',
          imageUrl: 'https://example.com/image.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockServiceRepository.findMany.mockResolvedValue(mockServices);

      const result = await serviceService.getAll(serviceQueryDTO);

      expect(mockServiceRepository.findMany).toHaveBeenCalledWith({
        isActive: true,
        name: { contains: 'Test', mode: 'insensitive' },
        price: { gte: 50, lte: 150 },
      });
      expect(result).toEqual(mockServices);
    });

    it('should return an empty list if maxPrice is less than minPrice', async () => {
      const serviceQueryDTO: ServiceQueryDTO = { isActive: true, name: 'Test', minPrice: 150, maxPrice: 50 };
      const result = await serviceService.getAll(serviceQueryDTO);
      expect(result).toEqual([]);
    });
  });

  describe('updateById', () => {
    it('should update a service', async () => {
      const updateServiceDTO: UpdateServiceDTO = { name: 'Updated Service', price: 120 };
      const mockService: Service = { id: '1', name: 'Test Service', price: 100, isActive: true, description: 'Test description', imageUrl: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };

      mockServiceRepository.updateById.mockResolvedValue(mockService);

      const result = await serviceService.updateById('1', updateServiceDTO);

      expect(mockServiceRepository.updateById).toHaveBeenCalledWith('1', updateServiceDTO);
      expect(result).toEqual(mockService);
    });
  });

  describe('deleteById', () => {
    it('should delete a service', async () => {
      const mockService: Service = { id: '1', name: 'Test Service', price: 100, isActive: true, description: 'Test description', imageUrl: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };

      mockServiceRepository.deleteById.mockResolvedValue(mockService);

      const result = await serviceService.deleteById('1');

      expect(mockServiceRepository.deleteById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockService);
    });
  });
});
