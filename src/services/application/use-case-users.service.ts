import {injectable, /* inject, */ BindingScope} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class UseCaseUsersService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
}
