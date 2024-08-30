class DetailComment {
  constructor(payload, replies = []) {
    this._verifyPayload(payload);

    const {
      id,
      username,
      date,
      content,
      isdeleted,
      likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isdeleted ? '**komentar telah dihapus**' : content;
    this.likeCount = likeCount;
    this.replies = this._mapReplies(replies);
  }

  _verifyPayload({
    id,
    username,
    date,
    content,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _mapReplies(replies) {
    return replies.map((reply) => ({
      id: reply.id,
      content: reply.isdeleted ? '**balasan telah dihapus**' : reply.content,
      date: reply.date,
      username: reply.username,
    }));
  }
}

module.exports = DetailComment;
