const AddReply = require('../../../Domains/replies/entities/AddReply');
const RetrievedReply = require('../../../Domains/replies/entities/RetrievedReply');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
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

  describe('deleteReply function', () => {
    it('should delete comment from database', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-180', commentId: 'comment-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReply('reply-180', 'comment-123');

      const reply = await RepliesTableTestHelper.findReplyById('reply-180');

      expect(reply[0]).toStrictEqual({
        id: 'reply-180',
        content: 'contentReply',
        comment_id: 'comment-123',
        owner: 'user-123',
        is_deleted: true,
        date: new Date('2021-08-08T07:22:33.555Z'),
      });
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-180', commentId: 'comment-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-180'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply not owned by owner', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply owned by owner', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-180', commentId: 'comment-123', owner: 'user-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-180', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('retrieveCommentReplies function', () => {
    it('should return replies from comment correctly', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-180', commentId: 'comment-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.retrieveCommentReplies('comment-123');
      expect(replies[0]).toStrictEqual({
        id: 'reply-180',
        content: 'contentReply',
        username: 'dicoding Indonesia',
        isdeleted: false,
        date: new Date('2021-08-08T07:22:33.555Z'),
      });
    });
  });
});
