const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const threadDetail = await this._threadRepository.retrieveDetailThread(threadId);
    const comments = await this._commentRepository.retrieveThreadComments(threadId);

    const detailedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.retrieveCommentReplies(comment.id);

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        replies: replies.map(reply => ({
          id: reply.id,
          content: reply.isdeleted ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        })),
        content: comment.isdeleted ? '**komentar telah dihapus**' : comment.content,
      };
    }));

    // Pastikan payload ke DetailThread sudah lengkap
    return {
      ...threadDetail,
      comments: detailedComments,
    };
  }
}

module.exports = GetThreadUseCase;
