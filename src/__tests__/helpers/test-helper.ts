import {ApiApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
//import { testdb } from './testdb.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    host: 'localhost',
    basePath: '/api',
  });

  const app = new ApiApplication({
    rest: restConfig,
  });

  await app.boot();
  //app.dataSource(testdb);
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: ApiApplication;
  client: Client;
}
