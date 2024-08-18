const AddThread = require('../../../Domains/threads/entities/AddThread');
const RetrievedThread = require('../../../Domains/threads/entities/RetrievedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'titleThread',
      body: 'bodyThread',
    };
    const ownerPayload = 'user-123';

    const expectedRetrievedThread = new RetrievedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: ownerPayload,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new RetrievedThread({
        id: 'thread-123',
        title: 'titleThread',
        owner: 'user-123',
      })));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const retrievedThread = await addThreadUseCase.execute(useCasePayload, ownerPayload);

    expect(retrievedThread).toStrictEqual(expectedRetrievedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), ownerPayload);
  });
});
