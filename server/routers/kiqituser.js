const KiqitUser = require('../models/kiqitUserSchema');

module.exports = (router) => {
  router

  // POST /user/
    .post('/api/user/', function* createUser() {
      const user = new KiqitUser(this.request.body);


      const emailAuthRes = yield user.authenticateEmail();
      if (emailAuthRes.body.result !== 'deliverable') {
        this.status = 409;
        this.response.body = {
          message: 'Email invalid',
        };
        return;
      }

      try {
        yield user.save();
      } catch (error) {
        this.status = 409;
        this.response.body = error.errors;
        return;
      }

      this.response.body = user;
      this.status = 201;
    })

    .post('/api/user/login', function* loginUser() {
      const user = yield KiqitUser.findOne({
        email: this.request.body.email,
      });

      if (user == null) {
        this.status = 404;
        this.response.body = {
          login_status: 'Login unsuccessful',
        };
        return;
      }

      const isMatch = yield user.comparePassword(this.request.body.password);

      if (isMatch) {
        this.status = 200;
        this.response.body = user;
      } else {
        this.status = 400;
        this.response.body = {
          login_status: 'Login unsuccessful',
        };
      }
    })

  // DELETE /user/:id
    .delete('/api/user/:id', function* deleteUser() {
      const user = yield KiqitUser.findOne({
        _id: this.params.id,
      });

      try {
        yield user.remove();
      } catch (error) {
        this.status = 404;
        return;
      }

      this.status = 200;
    });
};
