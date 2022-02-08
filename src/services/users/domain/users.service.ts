import {injectable, BindingScope} from '@loopback/core';
import { Count, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { Users } from '../../../models/users.model';
import { UsersRepository } from '../../../repositories/users.repository';
import { ICrudService } from '../../shared/domain/ICrudService.interface';
import { PasswordStrong } from './password-strong';

@injectable({scope: BindingScope.TRANSIENT})
export class UsersService implements ICrudService<Users> {
  constructor(@repository(UsersRepository) public usersRepository : UsersRepository) {}

  async create(users: Omit<Users, 'id'>): Promise<Users> {
    try {
      //Valida que la contrase sea fuerte
      // Value Object
      const passwordStrong = PasswordStrong.create(users.password);

      return await this.usersRepository.create(users);    
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB - ${error.message}`)
    }
  }
  
  async count(where?: Where<Users>): Promise<Count> {
    try {
      return await this.usersRepository.count(where);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB: ${error.message}`)
    }
  }
  
  async find(filter?: Filter<Users>): Promise<Users[]> {
    try {
      return await this.usersRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB ${error.message}`)
    }
  }

  async updateAll(users: Users, where?: Where<Users>): Promise<Count> {
    try {
      return await this.usersRepository.updateAll(users, where);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB ${error.message}`)
    }
  }

  async findById(id: number, filter?: FilterExcludingWhere<Users>): Promise<Users> {
    try {
      return await this.usersRepository.findById(id, filter);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB ${error.message}`)
    }
  }

  async updateById(id: number, users: Users):  Promise<void>{
    try {
      return await this.usersRepository.updateById(id, users);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB ${error.message}`)
    }
  }

  async replaceById(id: number, users: Users): Promise<void>{
    try {
      await this.usersRepository.replaceById(id, users);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB ${error.message}`)
    }
  }

  async deleteById(id: number): Promise<void>{
    try {
      await this.usersRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Imposible guardar en la DB ${error.message}`)
    }
  }
}
