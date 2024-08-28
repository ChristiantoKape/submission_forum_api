const AddReply = require('../../../Domains/replies/entities/AddReply');
const RetrievedReply = require('../../../Domains/replies/entities/RetrievedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'contentReply',
    };
    const threadIdParam = 'thread-123';
    const commentIdParam = 'comment-123';
    const ownerPayload = 'user-123';

    const expectedRetrievedReply = new RetrievedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: ownerPayload,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new RetrievedReply({
        id: 'reply-123',
        content: 'contentReply',
        owner: 'user-123',
      })));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const retrievedReply = await addReplyUseCase.execute(
      useCasePayload,
      threadIdParam,
      commentIdParam,
      ownerPayload,
    );

    expect(retrievedReply).toStrictEqual(expectedRetrievedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentIdParam);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      content: useCasePayload.content,
    }), commentIdParam, ownerPayload);
  });
});
