import { LogModel } from './log.model';
import mongoose, { Mongoose } from 'mongoose';
import { MongoDatabase } from '../init';

describe('data/mongo/models/log.model.ts', () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoUrl: process.env.MONGO_URL!,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  test('should return LogModel', async () => {
    const logData = {
      origin: 'log.model.test.ts',
      message: 'test-message',
      level: 'low',
    };
    const log = await LogModel.create(logData);

    console.log(log);
    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        createdAt: expect.any(Date),
        // _id: expect.any(mongoose.Types.UUID),
      })
    );

    await LogModel.findByIdAndDelete(log.id);
  });

  test('should return the schema object', () => {
    const schema = LogModel.schema.obj;

    console.log(schema);

    expect(schema).toEqual(
      expect.objectContaining({
        message: { type: expect.any(Function), required: true },
        origin: { type: expect.any(Function) },
        level: {
          type: expect.any(Function),
          enum: ['low', 'medium', 'high'],
          default: 'low',
        },
        createdAt: expect.any(Object),
      })
    );
  });
});
