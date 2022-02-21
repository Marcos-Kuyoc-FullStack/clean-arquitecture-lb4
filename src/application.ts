import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
// import { NodeMailerEmail } from './adapters/email-service/nodemailer-email';
import {SendGridEmail} from './adapters/email-service/sendgrid-email';
import {SendGridFakeEmail} from './adapters/email-service/sendgrid-fake-email';
import {logMiddleaware} from './middleware/log.middleware';
export {ApplicationConfig};

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.middleware(logMiddleaware);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Inyectar dependencias
    if (process.env.ENTORNO === 'production') {
      //this.bind('email-service').toClass(NodeMailerEmail);
      this.bind('email-service').toClass(SendGridEmail);
    } else {
      this.bind('email-service').toClass(SendGridFakeEmail);
    }
  }
}
