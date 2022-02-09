import {
  givenHttpServerConfig,
} from '@loopback/testlab';
import { ApiApplication } from '../../application';
//import { testdb } from './testdb.datasource';

export const setupApplication = async () => {
  const restConfig = givenHttpServerConfig({
    host: 'localhost',
    basePath: '/api',
    port: 9000
  });

  const app = new ApiApplication({rest: restConfig});
  await app.boot();
  //app.dataSource(testdb);
  await app.start();

  return app;
};
