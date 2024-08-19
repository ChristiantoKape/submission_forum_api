class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, threadId, owner) {
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);

    return this._commentRepository.deleteComment(commentId, threadId);
  }
}

module.exports = DeleteCommentUseCase;
