import {Client} from '@loopback/testlab';
import {ApiApplication} from '../..';
import {setupApplication} from '../helpers/test-helper';

describe('PingController', () => {
  let app: ApiApplication;
  let client: Client;

  beforeEach(async () => {
    ({app, client} = await setupApplication());
  });

  afterEach(async () => {
    await app.stop();
  });

  test('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty('greeting');
    expect(res.body.greeting).toEqual(expect.any(String));
    expect(res.body.greeting).toEqual('Hello from LoopBack');
  });
});
