import { envs } from './env.plugin';
describe('src/config/plugins/env.plugin.ts', () => {
  // test('should return env options', () => {
  //   console.log(envs);

  //   expect(envs).toEqual(
  //     expect.objectContaining({
  //       PORT: 3000,
  //       MAILER_EMAIL: 'jaderodev@gmail.com',
  //       MAILER_SECRET_KEY: 'typuircukaorneap',
  //       MAILER_SERVICE: 'gmail',
  //       PROD: false,
  //       MONGO_URL: 'mongodb://jadero:123456789@localhost:27017/',
  //       MONGO_DB_NAME: 'NOC-TEST',
  //       MONGO_USER: 'jadero',
  //       MONGO_PASS: '123456789',
  //       POSTGRES_USER: 'jadero',
  //       POSTGRES_PASSWORD: '123456789',
  //       POSTGRES_DB: 'NOC-TEST',
  //       POSTGRES_URL: 'postgresql://jadero:123456789@localhost:5432/NOC',
  //     })
  //   );
  // });

  test('should return error if not found env', async () => {
    jest.resetModules();
    process.env.PORT = 'ABC';

    try {
      await import('./env.plugin');
      expect(true).toBe(false);
    } catch (error) {
      expect(`${error}`).toContain('should be a valid integer');
    }
  });
});
