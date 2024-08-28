const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  let server;
  let accessToken;
  let threadPayload;
  let userPayload;

  beforeAll(async () => {
    server = await createServer(container);
  });

  beforeEach(async () => {
    userPayload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(userPayload);

    accessToken = await container.getInstance(AuthenticationTokenManager.name)
      .createAccessToken({ id: userPayload.id });

    threadPayload = {
      title: 'Hello, World!',
      body: 'This is a thread',
    };
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 401 when request not contain access token', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const incompleteThreadPayload = {
        title: 'titleThread',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: incompleteThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const invalidThreadPayload = {
        title: 123,
        body: true,
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: invalidThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond 200 and return thread detail', async () => {
      // arrange
      const anotherUser = {
        id: 'user-456',
        username: 'another_user',
        password: 'super_secret_password',
        fullname: 'Another User',
      };
      await UsersTableTestHelper.addUser(anotherUser);

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        body: 'BodyTHread',
        owner: anotherUser.id,
        date: '2021-08-08T07:22:33.555Z',
      });

      const commentId1 = 'comment-h_2ejwiqjo';
      const commentId2 = 'comment-h_2ejwiqjoweq';
      await CommentsTableTestHelper.addComment({
        id: commentId1,
        content: 'sebuah comment',
        threadId,
        owner: anotherUser.id,
        isDeleted: false,
        date: '2021-08-08T07:22:33.555Z',
      });
      await CommentsTableTestHelper.addComment({
        id: commentId2,
        content: '**komentar telah dihapus**',
        threadId,
        owner: userPayload.id,
        isDeleted: true,
        date: '2021-08-08T07:26:21.338Z',
      });

      const replyId1 = 'reply-123';
      const replyId2 = 'reply-456';
      await RepliesTableTestHelper.addReply({
        id: replyId1,
        content: 'balasan',
        commentId: commentId1,
        owner: anotherUser.id,
        isDeleted: false,
        date: '2021-08-08T07:22:33.555Z',
      });
      await RepliesTableTestHelper.addReply({
        id: replyId2,
        content: '**balasan telah dihapus**',
        commentId: commentId1,
        owner: userPayload.id,
        isDeleted: true,
        date: '2021-08-08T07:26:21.338Z',
      });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(threadId);
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();

      // Verify comments
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].id).toEqual(commentId1);
      expect(responseJson.data.thread.comments[0].content).toEqual('sebuah comment');

      // Verify replies within comments
      const [{ replies }] = responseJson.data.thread.comments;
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual(replyId1);
      expect(replies[0].content).toEqual('balasan');
      expect(replies[0].username).toEqual(anotherUser.username);

      expect(replies[1].id).toEqual(replyId2);
      expect(replies[1].content).toEqual('**balasan telah dihapus**');
      expect(replies[1].username).toEqual(userPayload.username);

      // Verify the deleted comment
      expect(responseJson.data.thread.comments[1].id).toEqual(commentId2);
      expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});
