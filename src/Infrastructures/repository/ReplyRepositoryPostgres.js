const RetrievedReply = require('../../Domains/replies/entities/RetrievedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

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

    return new RetrievedReply({ ...result.rows[0] });
  }
}

module.exports = ReplyRepositoryPostgres;
