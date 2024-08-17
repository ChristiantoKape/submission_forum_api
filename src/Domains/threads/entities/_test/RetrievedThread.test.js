const RetrievedThread = require('../RetrievedThread');

describe('RetrievedThread', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      id: 'thread-123',
      title: 'titleThread',
    };

    expect(() => new RetrievedThread(payload)).toThrowError('RETRIEVED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      id: {},
      title: 'titleThread',
      owner: true,
    };

    expect(() => new RetrievedThread(payload)).toThrowError('RETRIEVED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create retrievedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'titleThread',
      owner: 'user-123',
    };

    const { id, title, owner } = new RetrievedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});