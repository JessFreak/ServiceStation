import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/UserRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';
import { User, Vehicle } from '@prisma/client';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { NotBelongException } from '../utils/exceptions/NotBelongException';
import { RoleDTO, UpdateUserDTO } from '../utils/dtos/UserDTO';
import { AlreadyRegisteredException } from '../utils/exceptions/AlreadyRegisteredException';

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  getAllUsers({ role }: RoleDTO): Promise<User[]> {
    return this.userRepository.findMany({ where: { role } });
  }

  async update (id: string, data: UpdateUserDTO): Promise<User> {
    return this.userRepository.updateById(id, data);
  }

  async addVehicle (id: string, data: CreateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.find({ vin: data.vin });
    if (vehicle) throw new AlreadyRegisteredException('Vehicle', 'VIN');

    return this.vehicleRepository.create({ userId: id, ...data });
  }

  async getUserVehicles (id: string): Promise<Vehicle[]> {
    return this.vehicleRepository.findMany({ userId: id });
  }

  async updateVehicle (id: string, vehicleId: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (id !== vehicle.userId) {
      throw new NotBelongException('Vehicle', 'User');
    }

    return this.vehicleRepository.updateById(vehicleId, data);
  }
}