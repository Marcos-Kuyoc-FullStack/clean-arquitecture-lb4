import {injectable, /* inject, */ BindingScope, service, inject} from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { UsersService } from '../..';
import { IEmailService } from '../../../adapters/email-service/email-service.interface';
import { Users } from '../../../models/users.model';
import { IUserService } from '../../domain/users/users.service.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class AddNewUserService {
  constructor(
    @service(UsersService) private userService: IUserService,
    @inject('email-service') public emailService: IEmailService
  ) {}

/**
  * TODO:
  * Feature:
  * 1. Comprobar que no haya otro usuario con el mismo email.
  *   Tenemos 2 opciones: 
  *     a. Crear un Value Object especifico.
  *     b. Usar las propiedades de validación que proporciona Lb4 para sus modelos o entidades
  *        https://loopback.io/doc/en/lb4/Model.html
  * 2. Validar que la contraseña sea lo suficientemente fuerte.
  *   - Crear un Value Object para este requisito.
  * 3. Almacenar o persistir los datos del usuario.
  *   - Inyectar la clase de dominio que creamos antes.
  * 4. Enviar un email de bienvenida.
  *   - Inyectar el servicio de envio de correo electronicos.
  * 
  * Improvement:
  *   Aplicar un rollback del usuario cuando el email no se envie.
  */
  async execute(payload: Omit<Users, 'id'>): Promise<Users> {
    try {
      const user = await this.userService.create(payload);
  
      if (user) {
        const email = await this.emailService.send({email: user.email})

        if (!email) {
          throw new HttpErrors.BadRequest('El servicio de correo no pudo enviar el mensaje al remitente')
        }
      }

      return user;
    } catch (error) {
      console.log(`[addNewUser] ${error.message}`);
      throw new HttpErrors.BadRequest(error.message);
    }
  }

  async executeV2(payload: Omit<Users, 'id'>): Promise<Users> {
    let user: Users;

    try {
      user = await this.userService.create(payload);
    } catch (error) {
      console.log(`[addNewUser] ${error.message}`);
      throw new HttpErrors.BadRequest(error.message);
    }

    try {
      const email = await this.emailService.send({email: user.email})

      if (!email) {
        throw new HttpErrors.BadRequest('El servicio de correo no pudo enviar el mensaje al remitente')
      }
    } catch (error) {
      await this.rollback(user.id)
      console.log(`[addNewUser] ${error.message}`);
      throw new HttpErrors.BadRequest(error.message);
    }

    return user;
  }

  private async rollback(id?: number) {
    if (id !== undefined) {
      await this.userService.deleteById(id);
    }
  }
}
