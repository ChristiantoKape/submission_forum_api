const AddComment = require('../../../Domains/comments/entities/AddComment');
const RetrievedComment = require('../../../Domains/comments/entities/RetrievedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'contentComment',
    };
    const threadIdParam = 'thread-123';
    const ownerPayload = 'user-123';

    const expectedRetrievedComment = new RetrievedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: ownerPayload,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new RetrievedComment({
        id: 'comment-123',
        content: 'contentComment',
        owner: 'user-123',
      })));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const retrievedComment = await addCommentUseCase.execute(
      useCasePayload,
      threadIdParam,
      ownerPayload,
    );

    expect(retrievedComment).toStrictEqual(expectedRetrievedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadIdParam);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
    }), threadIdParam, ownerPayload);
  });
});
