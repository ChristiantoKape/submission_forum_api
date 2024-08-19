const AddReply = require('../AddReply');

describe('AddReply', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {};

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      content: true,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addReply object correctly', () => {
    const payload = {
      content: 'contentReply',
    };

    const { content } = new AddReply(payload);

    expect(content).toEqual(payload.content);
  });
});
