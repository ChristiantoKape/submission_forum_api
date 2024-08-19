class ReplyRepository {
  async addReply({ content, owner, commentId }) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
