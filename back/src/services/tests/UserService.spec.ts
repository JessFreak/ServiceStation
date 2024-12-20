import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../UserService';
import { UserRepository } from '../../database/repositories/UserRepository';
import { VehicleRepository } from '../../database/repositories/VehicleRepository';
import { AuthService } from '../AuthService';
import { ForbiddenException } from '@nestjs/common';
import { AlreadyRegisteredException } from '../../utils/exceptions/AlreadyRegisteredException';
import { NotBelongException } from '../../utils/exceptions/NotBelongException';
import { User, Vehicle, Role, Type } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let vehicleRepository: jest.Mocked<VehicleRepository>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'hashed_password',
    name: 'John',
    surname: 'Doe',
    avatarUrl: 'url',
    role: 'user' as Role,
  };

  const mockVehicle: Vehicle = {
    id: '1',
    userId: '1',
    vin: '1234567890',
    type: 'CAR',
    model: 'Corolla',
    year: 2020,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findMany: jest.fn().mockResolvedValue([mockUser]),
            findById: jest.fn().mockResolvedValue(mockUser),
            updateById: jest.fn().mockResolvedValue(mockUser),
            findByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: VehicleRepository,
          useValue: {
            find: jest.fn().mockResolvedValue(null),
            findById: jest.fn().mockResolvedValue(mockVehicle),
            findMany: jest.fn().mockResolvedValue([mockVehicle]),
            create: jest.fn().mockResolvedValue(mockVehicle),
            updateById: jest.fn().mockResolvedValue(mockVehicle),
            deleteById: jest.fn().mockResolvedValue(mockVehicle),
          },
        },
        {
          provide: AuthService,
          useValue: {
            checkIfEmailOrPhoneExist: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    vehicleRepository = module.get(VehicleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update the user details', async () => {
      const updateData = { email: 'newemail@example.com' };
      const result = await userService.update('1', updateData);

      expect(result).toEqual(mockUser);
      expect(userRepository.updateById).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('updateRole', () => {
    it('should update the user role', async () => {
      const newRole = 'admin' as Role;
      const result = await userService.updateRole('1', '2', newRole);

      expect(result).toEqual(mockUser);
      expect(userRepository.updateById).toHaveBeenCalledWith('2', { role: newRole });
    });

    it('should throw ForbiddenException when trying to change own role', async () => {
      await expect(userService.updateRole('1', '1', 'admin' as Role)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addVehicle', () => {
    it('should add a vehicle for the user', async () => {
      const vehicleData = { vin: '9876543210', type: 'CAR' as Type, model: 'Civic', year: 2021 };
      const result = await userService.addVehicle('1', vehicleData);

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.create).toHaveBeenCalledWith({ userId: '1', ...vehicleData });
    });

    it('should throw AlreadyRegisteredException if the VIN already exists', async () => {
      jest.spyOn(vehicleRepository, 'find').mockResolvedValue(mockVehicle);

      const vehicleData = { vin: '1234567890', type: 'CAR' as Type, model: 'Civic', year: 2021 };

      await expect(userService.addVehicle('1', vehicleData)).rejects.toThrow(AlreadyRegisteredException);
    });
  });

  describe('updateVehicle', () => {
    it('should update the vehicle details', async () => {
      const updateData = { vin: '9876543210', make: 'Honda', model: 'Civic', year: 2021 };
      const result = await userService.updateVehicle('1', '1', updateData);

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.updateById).toHaveBeenCalledWith('1', updateData);
    });

    it('should throw NotBelongException if the user does not own the vehicle', async () => {
      jest.spyOn(vehicleRepository, 'findById').mockResolvedValue({ ...mockVehicle, userId: '2' });

      const updateData = { vin: '9876543210', make: 'Honda', model: 'Civic', year: 2021 };

      await expect(userService.updateVehicle('1', '1', updateData)).rejects.toThrow(NotBelongException);
    });

    it('should throw AlreadyRegisteredException if VIN already exists for another vehicle', async () => {
      const anotherVehicle = { ...mockVehicle, id: '2' };
      jest.spyOn(vehicleRepository, 'find').mockResolvedValue(anotherVehicle);

      const updateData = { vin: '1234567890', make: 'Honda', model: 'Civic', year: 2021 };

      await expect(userService.updateVehicle('1', '1', updateData)).rejects.toThrow(AlreadyRegisteredException);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete the vehicle', async () => {
      const result = await userService.deleteVehicle('1', '1');

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.deleteById).toHaveBeenCalledWith('1');
    });

    it('should throw NotBelongException if the user does not own the vehicle', async () => {
      jest.spyOn(vehicleRepository, 'findById').mockResolvedValue({ ...mockVehicle, userId: '2' });

      await expect(userService.deleteVehicle('1', '1')).rejects.toThrow(NotBelongException);
    });
  });
});
