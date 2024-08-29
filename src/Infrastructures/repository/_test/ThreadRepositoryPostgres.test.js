const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const RetrievedThread = require('../../../Domains/threads/entities/RetrievedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding Indonesia' });
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      const addThread = new AddThread({
        title: 'titleThread',
        body: 'bodyThread',
      });
      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const retrievedThread = await threadRepositoryPostgres.addThread(addThread, owner);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(thread).toHaveLength(1);
      expect(retrievedThread).toStrictEqual(new RetrievedThread({
        id: 'thread-123',
        title: 'titleThread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread is not exists', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exists', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('retrieveDetailThread function', () => {
    it('should return detail thread correctly', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const detailThread = await threadRepositoryPostgres.retrieveDetailThread('thread-123');

      expect(detailThread).toEqual(new DetailThread({
        id: 'thread-123',
        title: 'titleThread',
        body: 'bodyThread',
        date: new Date('2021-08-08T07:22:33.555Z'),
        username: 'dicoding Indonesia',
      }));
    });
  });
});
