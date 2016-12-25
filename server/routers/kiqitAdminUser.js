const KiqitAdminUser = require('../models/kiqitAdminUserSchema');

module.exports = (router) => {
  router

  // POST /adminuser/
    .post('/api/adminuser/', function* createUser() {
      const adminUser = new KiqitAdminUser(this.request.body);

      const emailAuthRes = yield adminUser.authenticateEmail();
      if (emailAuthRes.body.result !== 'deliverable') {
        this.status = 409;
        this.response.body = {
          message: 'Email invalid',
        };
        return;
      }

      try {
        yield adminUser.save();
      } catch (error) {
        this.status = 409;
        this.response.body = error.errors;
        return;
      }

      this.response.body = adminUser;
      this.status = 201;
    })

    .post('/api/adminuser/login', function* loginUser() {
      const adminUser = yield KiqitAdminUser.findOne({
        email: this.request.body.email,
      });

      if (adminUser == null) {
        this.status = 404;
        this.response.body = {
          login_status: 'Login unsuccessful',
        };
        return;
      }

      const isMatch = yield adminUser.comparePassword(this.request.body.password);

      if (isMatch) {
        this.status = 200;
        this.response.body = adminUser;
      } else {
        this.status = 400;
        this.response.body = {
          login_status: 'Login unsuccessful',
        };
      }
    })

  // DELETE /adminuser/:id
    .delete('/api/adminuser/:id', function* deleteUser() {
      const adminUser = yield KiqitAdminUser.findOne({
        _id: this.params.id,
      });

      try {
        adminUser.remove();
      } catch (error) {
        this.status = 404;
        return;
      }

      this.status = 200;
    });
};
