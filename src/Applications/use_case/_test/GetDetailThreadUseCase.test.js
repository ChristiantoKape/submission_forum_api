const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadIdParam = 'thread-123';

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:16.198Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
        replies: [
          {
            id: 'reply-123',
            content: 'balasan pertama',
            date: '2021-08-08T07:20:00.000Z',
            username: 'janedoe',
          },
          {
            id: 'reply-124',
            content: '**balasan telah dihapus**',
            date: '2021-08-08T07:21:00.000Z',
            username: 'johnsmith',
          },
        ],
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: '**komentar telah dihapus**',
        replies: [],
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.retrieveDetailThread = jest.fn()
      .mockResolvedValue({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:59:16.198Z',
        username: 'dicoding',
      });

    mockCommentRepository.retrieveThreadComments = jest.fn()
      .mockResolvedValue([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:59:18.982Z',
          content: 'sebuah comment',
          isdeleted: false,
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          date: '2021-08-08T07:59:18.982Z',
          content: 'sebuah comment',
          isdeleted: true,
        },
      ]);

    mockReplyRepository.retrieveCommentReplies = jest.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') {
          return Promise.resolve([
            {
              id: 'reply-123',
              content: 'balasan pertama',
              date: '2021-08-08T07:20:00.000Z',
              username: 'janedoe',
              isdeleted: false,
            },
            {
              id: 'reply-124',
              content: 'balasan kedua',
              date: '2021-08-08T07:21:00.000Z',
              username: 'johnsmith',
              isdeleted: true,
            },
          ]);
        }
        return Promise.resolve([]);
      });

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await getDetailThreadUseCase.execute(threadIdParam);

    // Assert
    expect(result).toEqual({
      ...expectedDetailThread,
      comments: expectedComments,
    });

    expect(mockThreadRepository.retrieveDetailThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.retrieveThreadComments).toBeCalledWith(threadIdParam);
    expect(mockReplyRepository.retrieveCommentReplies).toBeCalledWith('comment-123');
    expect(mockReplyRepository.retrieveCommentReplies).toBeCalledWith('comment-124');
  });
});
