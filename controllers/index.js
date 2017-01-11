
const userService = require('../services/user');

module.exports = function(router) {

  /**
   *
   * @type {APIController}
   */
  router
    .get('/user/:id', function* () {
      const ctx = this;

      const user = yield userService.getUserById(ctx.params.id);

      ctx.body = user;
    })
    .post('/user/join', function* () {
      const ctx = this,
        req = ctx.request;

      const ret = yield userService.createUser(req.body);

      ctx.body = ret;
    });

  return router;
};
