const RetrievedComment = require('../../Domains/comments/entities/RetrievedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, threadId, owner) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, owner, false, date],
    };

    const result = await this._pool.query(query);

    return new RetrievedComment(result.rows[0]);
  }

  async deleteComment(commentId, threadId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    await this._pool.query(query);
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async retrieveThreadComments(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, users.username, comments.is_deleted::boolean as isDeleted
              FROM comments 
              INNER JOIN users ON comments.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async hasUserLikedComment(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async toggleCommentLike(commentId, owner) {
    const hasLiked = await this.hasUserLikedComment(commentId, owner);

    if (!hasLiked) {
      const id = `comment-like-${this._idGenerator()}`;
      const date = new Date().toISOString();

      const insertQuery = {
        text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
        values: [id, commentId, owner, date],
      };

      await this._pool.query(insertQuery);
    } else {
      const deleteQuery = {
        text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
        values: [commentId, owner],
      };

      await this._pool.query(deleteQuery);
    }
  }
}

module.exports = CommentRepositoryPostgres;
