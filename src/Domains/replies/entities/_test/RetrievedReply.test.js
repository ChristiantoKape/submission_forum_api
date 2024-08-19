const RetrievedReply = require('../RetrievedReply');

describe('RetrievedReply', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      id: 'thread-123',
      content: 'titleThread',
    };

    expect(() => new RetrievedReply(payload)).toThrowError('RETRIEVED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      id: {},
      content: 'titleThread',
      owner: true,
    };

    expect(() => new RetrievedReply(payload)).toThrowError('RETRIEVED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RetrievedReply object correctly', () => {
    const payload = {
      id: 'thread-123',
      content: 'titleThread',
      owner: 'user-123',
    };

    const { id, content, owner } = new RetrievedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
