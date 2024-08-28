const AddComment = require('../AddComment');

describe('AddComment', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {};

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      content: true,
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    const payload = {
      content: 'contentComment',
    };

    const { content } = new AddComment(payload);

    expect(content).toEqual(payload.content);
  });
});
