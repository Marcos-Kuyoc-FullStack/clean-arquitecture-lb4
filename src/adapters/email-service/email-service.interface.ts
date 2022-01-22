export interface IPayloadEmail {
  email: string;
}

export interface IEmailService {
  send(payload: IPayloadEmail): Promise<boolean>
}