/** 
 * Value Object: Valida que la contraseña sea fuerte.
*/
import { InvalidParamError } from "../errors/invalid-param.error";
import { validatePasswordStrong } from "./validator";

export class PasswordStrong {
  private readonly password: string;

  private constructor(password: string) {
    this.password = password;
    Object.freeze(this)
  }

  static create(password: string): PasswordStrong | InvalidParamError {
    if (!validatePasswordStrong(password)) {
      return new InvalidParamError('password', 'La contraseña es débil');
    }

    return new PasswordStrong(password);
  }

  get value(): string {
    return this.password
  }
}