const AddComment = require('../../../Domains/comments/entities/AddComment');
const RetrievedComment = require('../../../Domains/comments/entities/RetrievedComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding Indonesia' });
  });

  describe('addComment function', () => {
    it('should persis add comment and return added comment correctly', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const addComment = new AddComment({
        content: 'contentComment',
      });
      const threadId = 'thread-123';
      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const retrievedComment = await commentRepositoryPostgres.addComment(
        addComment,
        threadId,
        owner,
      );

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      expect(comment).toHaveLength(1);
      expect(retrievedComment).toStrictEqual(new RetrievedComment({
        id: 'comment-123',
        content: 'contentComment',
        owner: 'user-123',
      }));
    });
  });
});
