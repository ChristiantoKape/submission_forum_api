const RetrievedReply = require('../../Domains/replies/entities/RetrievedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply, commentId, owner) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, commentId, owner, false, date],
    };

    const result = await this._pool.query(query);

    return new RetrievedReply(result.rows[0]);
  }

  async deleteReply(replyId, commentId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async retrieveCommentReplies(commentId) {
    const query = {
      text: `SELECT replies.id, 
                  replies.content,
                  replies.date,
                  users.username,
                  replies.is_deleted::boolean as isDeleted
            FROM replies
            INNER JOIN users ON replies.owner = users.id
            WHERE replies.comment_id = $1
            ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
