const Event = require('../models/eventSchema');

/*
  Tests Needed:
    1. Test endpoint
    2. Check events are in the right order.
*/
module.exports = (router) => {
  router
    .get('/api/events/', function* getEvent() {
      const eventList = yield Event.find({
        end_time: {
          $gt: Date.now(),
        },
      });

      eventList.sort((first, second) => {
        const firstDate = new Date(first.start_time);
        const secondDate = new Date(second.start_time);
        return firstDate - secondDate;
      });

      this.response.body = eventList;
      this.status = 200;
    });
};
