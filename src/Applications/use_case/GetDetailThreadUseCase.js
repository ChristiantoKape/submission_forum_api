const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const threadDetail = await this._threadRepository.retrieveDetailThread(threadId);
    const comments = await this._commentRepository.retrieveThreadComments(threadId);

    const formattedComments = comments.map((comment) => new DetailComment({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.isdeleted ? '**komentar telah dihapus**' : comment.content,
    }));

    return {
      ...threadDetail,
      comments: formattedComments,
    };
  }
}

module.exports = GetThreadUseCase;
