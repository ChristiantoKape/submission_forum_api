const AddThread = require('../AddThread');

describe('AddThread', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const payload = {
      title: 'titleThread',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const payload = {
      title: 'titleThread',
      body: true,
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'titleThread',
      body: 'bodyThread',
    };

    const { title, body } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});