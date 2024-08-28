const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete thread comment action correctly', async () => {
    const commentIdParam = 'comment-123';
    const threadIdParam = 'thread-123';
    const ownerPayload = 'user-123';

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(commentIdParam, threadIdParam, ownerPayload);

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentIdParam);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentIdParam, ownerPayload);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentIdParam, threadIdParam);
  });
});
