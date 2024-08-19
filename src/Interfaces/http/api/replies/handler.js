const autoBind = require('auto-bind');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postRepliesHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(
      request.payload,
      threadId,
      commentId,
      owner,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
