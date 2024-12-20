import { AuthService } from '../AuthService';
import { UserRepository } from '../../database/repositories/UserRepository';
import { JwtService } from '@nestjs/jwt';
import { AlreadyRegisteredException } from '../../utils/exceptions/AlreadyRegisteredException';
import { NotRegisteredException } from '../../utils/exceptions/NotRegisteredException';
import { InvalidPasswordException } from '../../utils/exceptions/InvalidPasswordException';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PasswordRepeatException } from '../../utils/exceptions/PasswordRepeatException';

jest.mock('../../database/repositories/UserRepository');
jest.mock('@nestjs/jwt');
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useClass: UserRepository },
        { provide: JwtService, useClass: JwtService },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('register', () => {
    it('should throw AlreadyRegisteredException if email or phone exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ id: '1', email: 'test@example.com' } as any);
      const userDto = { email: 'test@example.com', phone: '1234567890', password: 'password', name: 'John', surname: 'Doe' };

      await expect(authService.register(userDto)).rejects.toThrow(AlreadyRegisteredException);
    });

    it('should create a new user with hashed password', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce({ id: '1', email: 'test@example.com' } as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Mock bcrypt.hash

      const userDto = { email: 'test@example.com', phone: '1234567890', password: 'password', name: 'John', surname: 'Doe' };
      const result = await authService.register(userDto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });
  });

  describe('login', () => {
    it('should throw NotRegisteredException if user is not found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      const loginDto = { email: 'test@example.com', password: 'password' };

      await expect(authService.login(loginDto)).rejects.toThrow(NotRegisteredException);
    });

    it('should throw InvalidPasswordException if password is incorrect', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ id: '1', email: 'test@example.com', password: 'hashedPassword' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Mock bcrypt.compare
      const loginDto = { email: 'test@example.com', password: 'wrongPassword' };

      await expect(authService.login(loginDto)).rejects.toThrow(InvalidPasswordException);
    });

    it('should return user id on successful login', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ id: '1', email: 'test@example.com', password: 'hashedPassword' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Mock bcrypt.compare
      const loginDto = { email: 'test@example.com', password: 'password' };

      const result = await authService.login(loginDto);
      expect(result).toHaveProperty('id');
    });
  });

  describe('updatePassword', () => {
    it('should throw PasswordRepeatException if passwords are the same', async () => {
      const updatePasswordDto = { oldPassword: 'password', newPassword: 'password' };
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: '1', password: 'password' } as any);

      await expect(authService.updatePassword('1', updatePasswordDto)).rejects.toThrow(PasswordRepeatException);
    });

    it('should update password successfully', async () => {
      const updatePasswordDto = { oldPassword: 'oldPassword', newPassword: 'newPassword' };

      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: '1', password: 'hashedOldPassword' } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');

      jest.spyOn(userRepository, 'updateById').mockResolvedValueOnce({ id: '1', password: 'hashedNewPassword' } as any);

      await authService.updatePassword('1', updatePasswordDto);

      expect(userRepository.updateById).toHaveBeenCalledWith('1', { password: 'hashedNewPassword' });
    });
  });


  describe('checkIfEmailOrPhoneExist', () => {
    it('should throw AlreadyRegisteredException if email exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ id: '1', email: 'test@example.com' } as any);
      const updateUserDto = { email: 'test@example.com', phone: '1234567890' };

      await expect(authService.checkIfEmailOrPhoneExist(updateUserDto)).rejects.toThrow(AlreadyRegisteredException);
    });

    it('should throw AlreadyRegisteredException if phone exists', async () => {
      jest.spyOn(userRepository, 'findByPhone').mockResolvedValueOnce({ id: '1', phone: '1234567890' } as any);
      const updateUserDto = { email: 'new@example.com', phone: '1234567890' };

      await expect(authService.checkIfEmailOrPhoneExist(updateUserDto)).rejects.toThrow(AlreadyRegisteredException);
    });
  });
});
