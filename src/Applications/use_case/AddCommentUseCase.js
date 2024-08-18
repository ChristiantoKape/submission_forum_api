const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(threadId);
    return this._commentRepository.addComment(addComment, threadId, owner);
  }
}

module.exports = AddCommentUseCase;
