import {BindingScope, injectable} from '@loopback/core';
import {IEmailService, IPayloadEmail} from './email-service.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class SendGridFakeEmail implements IEmailService {
  async send(payload: IPayloadEmail): Promise<boolean> {
    return false;
  }
}
