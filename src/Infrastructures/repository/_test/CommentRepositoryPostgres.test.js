const AddComment = require('../../../Domains/comments/entities/AddComment');
const RetrievedComment = require('../../../Domains/comments/entities/RetrievedComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment('comment-123', 'thread-123');

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      expect(comment[0]).toStrictEqual({
        id: 'comment-123',
        content: 'commentThread',
        thread_id: 'thread-123',
        owner: 'user-123',
        is_deleted: true,
        date: '2021-08-08T07:22:33.555Z',
      });
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-190'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user not the owner', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-124'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user the owner', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('retrieveThreadComments function', () => {
    it('should return comments by thread id correctly', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepositoryPostgres.retrieveThreadComments('thread-123');

      expect(comments).toEqual([
        {
          id: 'comment-123',
          username: 'dicoding Indonesia',
          date: '2021-08-08T07:22:33.555Z',
          content: 'commentThread',
          isdeleted: false,
        },
      ]);
    });
  });

  describe('hasUserLikedComment function', () => {
    it('should return true when user liked the comment', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const isLiked = await commentRepositoryPostgres.hasUserLikedComment('comment-123', 'user-123');

      expect(isLiked).toBe(true);
    });

    it('should return false when user not liked the comment', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const isLiked = await commentRepositoryPostgres.hasUserLikedComment('comment-123', 'user-123');

      expect(isLiked).toBe(false);
    });
  });

  describe('toggleCommentLike function', () => {
    it('should delete the like if the user has already liked the comment', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'comment-like-123', commentId: 'comment-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.toggleCommentLike('comment-123', 'user-123');

      const isLiked = await CommentLikesTableTestHelper.findCommentLikeById('comment-like-123');
      expect(isLiked).toEqual([]);
    });

    it('should add the like if the user has not liked the comment', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.toggleCommentLike('comment-123', 'user-123');

      const isLiked = await CommentLikesTableTestHelper.findCommentLikeById('comment-like-123');
      expect(isLiked[0].id).toBe('comment-like-123');
    });
  });
});
