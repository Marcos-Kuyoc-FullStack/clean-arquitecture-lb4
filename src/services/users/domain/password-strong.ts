/** 
 * Value Object: Valida que la contraseña sea fuerte.
*/
import { InvalidParamsError } from "../../shared/domain/value-object/invalid-params.error";
import { validatePasswordStrong } from "./validator";

export class PasswordStrong {
  private readonly password: string;

  private constructor(password: string) {
    this.password = password;
    Object.freeze(this)
  }

  static create(password: string): PasswordStrong | InvalidParamsError {
    if (!validatePasswordStrong(password)) {
      return new InvalidParamsError('password', 'La contraseña es débil');
    }

    return new PasswordStrong(password);
  }

  get value(): string {
    return this.password
  }
}