const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete thread reply action correctly', async () => {
    const commentIdParam = 'comment-123';
    const replyIdParam = 'reply-123';
    const ownerPayload = 'user-123';

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(replyIdParam, commentIdParam, ownerPayload);

    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(replyIdParam);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyIdParam, ownerPayload);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyIdParam, commentIdParam);
  });
});
