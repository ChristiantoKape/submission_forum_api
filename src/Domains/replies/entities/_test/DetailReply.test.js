const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      id: 'reply-123',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      id: 'reply-123',
      content: 'contentReply',
      date: ['2021-08-08T07:59:43Z'],
      username: {},
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'contentReply',
      date: '2021-08-08T07:59:43Z',
      username: 'user-123',
    };

    const {
      id,
      content,
      date,
      username,
    } = new DetailReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
