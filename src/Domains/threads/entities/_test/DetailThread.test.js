const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'titleThread',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      id: {},
      title: 'titleThread',
      body: 'bodyThread',
      date: '2021-08-08T07:59:43Z',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'titleThread',
      body: 'bodyThread',
      date: '2021-08-08T07:59:43Z',
      username: 'user-123',
    };

    // Action
    const {
      id,
      title,
      body,
      date,
      username,
    } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
