const Event = require('../models/eventSchema');
const KiqitAdminUser = require('../models/kiqitAdminUserSchema');

module.exports = (router) => {
  router

  // GET /event/:id
    .get('/api/event/:id', function* getEvent() {
      const event = yield Event.findOne({
        _id: this.params.id,
      });

      if (event == null) {
        this.status = 404;
        return;
      }

      this.response.body = event;
      this.status = 200;
    })

  // POST /event/
    .post('/api/event/', function* createEvent() {
      const event = new Event(this.request.body);

      const adminUser = yield KiqitAdminUser.findOne({
        _id: event.adminid,
      });

      if (adminUser == null) {
        this.status = 403;
        this.response.body = {
          message: 'Not an admin user.',
        };
        return;
      }

      try {
        yield event.save();
      } catch (error) {
        this.status = 409;
        this.response.body = error.errors;
        return;
      }

      this.response.body = event;
      this.status = 201;
    })

 // PATCH /event/:id
    .patch('/api/event/:id', function* editEvent() {
      const self = this;
      let patches = [];

      const data = this.request.body;
      Object.keys(data).forEach((key) => {
        const fieldPatchJson = {
          op: 'replace',
          path: `/${key}`,
          value: data[key],
        };
        patches = patches.concat(fieldPatchJson);
      });

      const event = yield Event.findOne({
        _id: this.params.id,
      });

      if (event == null) {
        this.status = 404;
        return;
      }

      yield event.patch(patches, (error) => {
        if (error) {
          self.response.body = String(error);
          self.status = 409;
        }
      });

      if (this.response.body) {
        return;
      }

      this.response.body = event;
      this.status = 200;
    })

  // DELETE /event/:id
    .delete('/api/event/:id', function* deleteEvent() {
      const event = yield Event.findOne({
        _id: this.params.id,
      });

      try {
        event.remove();
      } catch (error) {
        this.status = 404;
        return;
      }

      this.status = 200;
    });
};
