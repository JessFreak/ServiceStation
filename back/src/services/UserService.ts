import { Injectable } from '@nestjs/common';
import { UserRepository } from '../database/repositories/UserRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';
import { User, Vehicle } from '@prisma/client';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { NotBelongException } from '../utils/exceptions/NotBelongException';
import { RoleDTO, UpdateUserDTO } from '../utils/dtos/UserDTO';
import { AlreadyRegisteredException } from '../utils/exceptions/AlreadyRegisteredException';
import { AuthService } from './AuthService';

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly authService: AuthService,
  ) {}

  getAllUsers({ role }: RoleDTO): Promise<User[]> {
    return this.userRepository.findMany({ where: { role } });
  }

  async update (id: string, data: UpdateUserDTO): Promise<User> {
    await this.authService.checkIfEmailOrPhoneExist(data, id);
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

    const vehicleWithVin = await this.vehicleRepository.find({ vin: data.vin });
    if (vehicleWithVin && vehicleWithVin.id !== vehicleId) {
      throw new AlreadyRegisteredException('Vehicle', 'VIN');
    }

    return this.vehicleRepository.updateById(vehicleId, data);
  }

  async deleteVehicle (id: string, vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.deleteById(vehicleId);
    if (id !== vehicle.userId) {
      throw new NotBelongException('Vehicle', 'User');
    }

    return this.vehicleRepository.deleteById(vehicleId);
  }
}