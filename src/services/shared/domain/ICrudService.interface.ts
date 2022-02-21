import { Count, Filter, FilterExcludingWhere, Model, Where } from "@loopback/repository";

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