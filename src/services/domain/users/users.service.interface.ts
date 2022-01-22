import { Count, Filter, FilterExcludingWhere, Where } from "@loopback/repository";
import { Users } from "../../../models/users.model";

export interface IUserServiceInterface {
  create(users: Omit<Users, 'id'>,): Promise<Users>;
  count(where?: Where<Users>): Promise<Count>;
  find(filter?: Filter<Users>): Promise<Users[]>;
  updateAll(users: Users, where?: Where<Users>): Promise<Count>;
  findById(id: number, filter?: FilterExcludingWhere<Users>): Promise<Users>;
  updateById(id: number, users: Users):  Promise<void>;
  replaceById(id: number, users: Users): Promise<void>;
  deleteById(id: number): Promise<void>; 
}
