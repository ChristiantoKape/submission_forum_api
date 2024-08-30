const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and new comment', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentPayload = {
        content: 'contentComment',
      };

      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(commentPayload.content);
      expect(responseJson.data.addedComment.owner).toEqual(userId);
    });

    it('should response 404 when thread not available', async () => {
      const userId = 'user-123';
      const commentPayload = {
        content: 'contentComment',
      };

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-190/comments',
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentPayload = {};

      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when payload not meet data type specification', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentPayload = {
        content: 123,
      };

      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.payload)).toEqual({
        status: 'success',
      });
    });

    it('should response 403 when user not owner of comment', async () => {
      const userId = 'user-123';
      const otherUserId = 'user-190';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: 'another Dicoding' });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: otherUserId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

    it('should response 404 when the comment is not found', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-129`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like comment', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 and unlike comment', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      await CommentLikesTableTestHelper.addLike({ id: commentId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
