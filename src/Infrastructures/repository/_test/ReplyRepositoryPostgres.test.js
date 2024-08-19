const AddReply = require('../../../Domains/replies/entities/AddReply');
const RetrievedReply = require('../../../Domains/replies/entities/RetrievedReply');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding Indonesia' });
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      const addReply = new AddReply({
        content: 'contentReply',
      });
      const commentId = 'comment-123';
      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const retrievedReply = await replyRepositoryPostgres.addReply(
        addReply,
        commentId,
        owner,
      );

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(reply).toHaveLength(1);
      expect(retrievedReply).toStrictEqual(new RetrievedReply({
        id: 'reply-123',
        content: 'contentReply',
        owner: 'user-123',
      }));
    });
  });
});
