const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const threadIdParam = 'thread-123';

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'titleThread',
      body: 'bodyThread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:19:09.775Z',
        content: 'commentThread',
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: '2021-08-08T07:19:09.775Z',
        content: '**komentar telah dihapus**',
      },
    ];

    const expectedResult = {
      ...expectedDetailThread,
      comments: expectedComments,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.retrieveDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailThread({
        id: 'thread-123',
        title: 'titleThread',
        body: 'bodyThread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      })));

    mockCommentRepository.retrieveThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:19:09.775Z',
          content: 'commentThread',
          isdeleted: false,
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          date: '2021-08-08T07:19:09.775Z',
          content: 'commentThread',
          isdeleted: true,
        },
      ]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const result = await getDetailThreadUseCase.execute(threadIdParam);

    expect(result).toEqual(expectedResult);
    expect(result.comments[0].content).toEqual('commentThread');
    expect(result.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(mockThreadRepository.retrieveDetailThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.retrieveThreadComments).toBeCalledWith(threadIdParam);
  });
});
