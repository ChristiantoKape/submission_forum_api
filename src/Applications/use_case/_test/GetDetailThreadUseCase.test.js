const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const threadIdParam = 'thread-123';

    const expectedThreadDetail = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi dari sebuah thread',
      username: 'dicoding',
      date: '2021-08-08T07:59:06.339Z',
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        content: 'sebuah komentar',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
        isdeleted: false,
      }),
      new DetailComment({
        id: 'comment-124',
        content: '**komentar telah dihapus**',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
        isdeleted: true,
      }),
    ];

    const expectedReplies = [
      new DetailReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
        isdeleted: false,
      }),
      new DetailReply({
        id: 'reply-124',
        content: '**balasan telah dihapus**',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
        isdeleted: true,
      }),
    ];

    const expectedResult = {
      ...expectedThreadDetail,
      comments: expectedComments.map((comment, index) => ({
        ...comment,
        replies: expectedReplies.map(reply => ({
          id: reply.id,
          content: reply.isdeleted ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        })),
        content: comment.isdeleted ? '**komentar telah dihapus**' : comment.content,
      })),
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.retrieveDetailThread = jest.fn()
      .mockResolvedValue(new DetailThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'isi dari sebuah thread',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
      }));
    mockCommentRepository.retrieveThreadComments = jest.fn()
      .mockResolvedValue([
        new DetailComment({
          id: 'comment-123',
          content: 'sebuah komentar',
          username: 'dicoding',
          date: '2021-08-08T07:59:06.339Z',
          isdeleted: false,
        }),
        new DetailComment({
          id: 'comment-124',
          content: '**komentar telah dihapus**',
          username: 'dicoding',
          date: '2021-08-08T07:59:06.339Z',
          isdeleted: true,
        }),
      ]);
    mockReplyRepository.retrieveCommentReplies = jest.fn()
      .mockResolvedValue([
        new DetailReply({
          id: 'reply-123',
          content: 'sebuah balasan',
          username: 'dicoding',
          date: '2021-08-08T07:59:06.339Z',
          isdeleted: false,
        }),
        new DetailReply({
          id: 'reply-124',
          content: '**balasan telah dihapus**',
          username: 'dicoding',
          date: '2021-08-08T07:59:06.339Z',
          isdeleted: true,
        }),
      ]);

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getDetailThreadUseCase.execute(threadIdParam);

    expect(result).toStrictEqual(expectedResult);
    expect(mockThreadRepository.retrieveDetailThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.retrieveThreadComments).toBeCalledWith(threadIdParam);
    expect(mockReplyRepository.retrieveCommentReplies)
      .toHaveBeenCalledTimes(expectedComments.length);
    expectedComments.forEach(comment => {
      expect(mockReplyRepository.retrieveCommentReplies).toBeCalledWith(comment.id);
    });
  });
});
