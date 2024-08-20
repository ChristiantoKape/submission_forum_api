class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(replyId, commentId, owner) {
    await this._replyRepository.verifyAvailableReply(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);

    return this._replyRepository.deleteReply(replyId, commentId);
  }
}

module.exports = DeleteReplyUseCase;
