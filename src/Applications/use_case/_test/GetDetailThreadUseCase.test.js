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
      comments: [],
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        content: 'sebuah komentar',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
        isdeleted: false,
        likeCount: 10,
      }),
      new DetailComment({
        id: 'comment-124',
        content: '**komentar telah dihapus**',
        username: 'dicoding',
        date: '2021-08-08T07:59:06.339Z',
        isdeleted: true,
        likeCount: 0,
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

    const detailedComments = expectedComments.map(
      (comment) => new DetailComment({ ...comment, likeCount: comment.likeCount }, expectedReplies),
    );

    const expectedResult = new DetailThread({
      ...expectedThreadDetail,
      comments: detailedComments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

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
          likeCount: 10,
        }),
        new DetailComment({
          id: 'comment-124',
          content: '**komentar telah dihapus**',
          username: 'dicoding',
          date: '2021-08-08T07:59:06.339Z',
          isdeleted: true,
          likeCount: 0,
        }),
      ]);

    mockCommentRepository.getCommentLikeCount = jest.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') return Promise.resolve(10);
        if (commentId === 'comment-124') return Promise.resolve(0);
        return Promise.resolve(0);
      });

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
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadIdParam);
    expect(mockThreadRepository.retrieveDetailThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.retrieveThreadComments).toBeCalledWith(threadIdParam);
    expectedComments.forEach((expectedComment) => {
      expect(mockReplyRepository.retrieveCommentReplies).toBeCalledWith(expectedComment.id);
      expect(mockCommentRepository.getCommentLikeCount).toBeCalledWith(expectedComment.id);
    });
  });
});
