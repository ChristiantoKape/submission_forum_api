const RetrievedComment = require('../RetrievedComment');

describe('RetrievedComment', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      id: 'thread-123',
      content: 'titleThread',
    };

    expect(() => new RetrievedComment(payload)).toThrowError('RETRIEVED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      id: {},
      content: 'titleThread',
      owner: true,
    };

    expect(() => new RetrievedComment(payload)).toThrowError('RETRIEVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RetrievedComment object correctly', () => {
    const payload = {
      id: 'thread-123',
      content: 'titleThread',
      owner: 'user-123',
    };

    const { id, title, owner } = new RetrievedComment(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
