const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /replies', () => {
    it('should response 400 when payload not meet data type specification', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyPayload = {
        content: 123,
      };

      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const server = await createServer(container);
      const accessToken = await container.getInstance(AuthenticationTokenManager.name)
        .createAccessToken({ id: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena tipe data tidak sesuai');
    });
  });
});
