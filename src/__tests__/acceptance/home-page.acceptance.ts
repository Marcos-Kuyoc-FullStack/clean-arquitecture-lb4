import {Client} from '@loopback/testlab';
import {ApiApplication} from '../..';
import {setupApplication} from '../helpers/test-helper';

describe('HomePage', () => {
  let app: ApiApplication;
  let client: Client;

  beforeEach(async () => {
    ({app, client} = await setupApplication());
  });

  afterEach(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    await client
      .get('/api')
      .expect(301)
      .expect('Content-Type', /text\/html/);
  });

  it('exposes self-hosted explorer', async () => {
    const explorer = await client.get('/api/explorer/');

    expect(explorer.status).toEqual(200);
    expect(explorer.header['content-type']).toEqual('text/html; charset=utf-8');
    expect(explorer.text).toEqual(expect.any(String));
  });
});
