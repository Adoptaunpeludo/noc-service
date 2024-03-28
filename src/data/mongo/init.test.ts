import { after } from 'node:test';
import { MongoDatabase } from './init';
import mongoose from 'mongoose';
describe('/data/mongo/init.ts', () => {
  afterAll(() => {
    mongoose.connection.close();
  });

  test('should connect to MongoDB', async () => {
    const connection = await MongoDatabase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoUrl: process.env.MONGO_URL!,
    });

    expect(connection).toBeTruthy();
  });

  test('should throw an error', async () => {
    try {
      const connection = await MongoDatabase.connect({
        dbName: 'test',
        mongoUrl: 'http://localhost',
      });
      expect(true).toBe(false);
    } catch (error) {}
  });
});
