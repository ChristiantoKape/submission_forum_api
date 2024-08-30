const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.retrieveDetailThread(threadId);
    const threadComments = await this._commentRepository.retrieveThreadComments(threadId);

    const detailedComments = await Promise.all(threadComments.map(async (comment) => {
      const replies = await this._replyRepository.retrieveCommentReplies(comment.id);
      const likeCount = await this._commentRepository.getCommentLikeCount(comment.id);

      return new DetailComment({ ...comment, likeCount }, replies);
    }));
    thread.comments = detailedComments;

    return new DetailThread(thread);
  }
}

module.exports = GetThreadUseCase;
