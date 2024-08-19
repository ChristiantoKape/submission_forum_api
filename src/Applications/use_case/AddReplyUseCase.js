const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    return this._replyRepository.addReply(addReply, commentId, owner);
  }
}

module.exports = AddReplyUseCase;
