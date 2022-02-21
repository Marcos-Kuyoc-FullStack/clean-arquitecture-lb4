/**
 * Value Object: Valida que la contraseña sea fuerte.
 */
import {HttpErrors} from '@loopback/rest';
import {InvalidParamsError} from '../../shared/domain/value-object/invalid-params.error';
import {validatePasswordStrong} from './validator';

export class PasswordStrong {
  private readonly password: string;

  private constructor(password: string) {
    this.password = password;
    Object.freeze(this);
  }

  static create(password: string): PasswordStrong | InvalidParamsError {
    if (!validatePasswordStrong(password)) {
      const passwordError = new InvalidParamsError(
        'password',
        'La contraseña es débil',
      );
      if (passwordError instanceof InvalidParamsError) {
        throw new HttpErrors.BadRequest(passwordError.error);
      }
    }

    return new PasswordStrong(password);
  }

  get value(): string {
    return this.password;
  }
}
