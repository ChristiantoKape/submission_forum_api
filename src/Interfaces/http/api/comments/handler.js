const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const PutLikeCommentUseCase = require('../../../../Applications/use_case/PutLikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(
      request.payload,
      threadId,
      owner,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(
      commentId,
      threadId,
      owner,
    );

    return {
      status: 'success',
    };
  }

  async putLikeCommentHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const putLikeCommentUseCase = this._container.getInstance(PutLikeCommentUseCase.name);
    await putLikeCommentUseCase.execute(
      threadId,
      commentId,
      owner,
    );

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
