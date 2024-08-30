class PutLikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);

    return this._commentRepository.toggleCommentLike(commentId, owner);
  }
}

module.exports = PutLikeCommentUseCase;
