const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PutLikeCommentUseCase = require('../PutLikeCommentUseCase');

describe('PutLikeCommentUseCase', () => {
  it('should orchestrating the put like comment action correctly', async () => {
    const threadIdParam = 'thread-123';
    const commentIdParam = 'comment-123';
    const ownerPayload = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.toggleCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const putLikeCommentUseCase = new PutLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await putLikeCommentUseCase.execute(threadIdParam, commentIdParam, ownerPayload);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentIdParam);
    expect(mockCommentRepository.toggleCommentLike).toBeCalledWith(commentIdParam, ownerPayload);
  });
});
