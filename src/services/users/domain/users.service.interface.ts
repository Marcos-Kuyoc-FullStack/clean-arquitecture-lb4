import { Count, Filter, FilterExcludingWhere, Model, Where } from "@loopback/repository";
import { Users } from "../../../models/users.model";

export interface IUserService {
  create(users: Omit<Users, 'id'>,): Promise<Users>;
  count(where?: Where<Users>): Promise<Count>;
  find(filter?: Filter<Users>): Promise<Users[]>;
  updateAll(users: Users, where?: Where<Users>): Promise<Count>;
  findById(id: number, filter?: FilterExcludingWhere<Users>): Promise<Users>;
  updateById(id: number, users: Users):  Promise<void>;
  replaceById(id: number, users: Users): Promise<void>;
  deleteById(id: number): Promise<void>; 
}

/**
 * Tipos Genericos de datos.
 */
export interface ICrudService<T extends Model> {
  create(items: Omit<T, 'id'>): Promise<T>;
  count(where?: Where<T>): Promise<Count>;
  find(filter?: Filter<T>): Promise<T[]>;
  updateAll(items: T, where?: Where<T>): Promise<Count>;
  findById(id: number, filter?: FilterExcludingWhere<T>): Promise<T>;
  updateById(id: number, items: T):  Promise<void>;
  replaceById(id: number, items: T): Promise<void>;
  deleteById(id: number): Promise<void>;
}