# Kiqit REST API
Note: This document is not finished as the project is growing. The information may not be up to date, this paragraph will be deleted when documentation is finalized.


### Overview
The project is built with [NodeJS](https://nodejs.org/en/) and [Koa](http://koajs.com). Koa is a barebones web framework that relies on modules for additional functionality. We use
[MongoDB](https://www.mongodb.com), [Mongoose](http://mongoosejs.com), and [mLab](https://mlab.com/) to host, store and interact with out data.


### Koa Modules
* [koa-json-body](https://github.com/dlau/koa-body): Json serialization/deserialization
* [koa-logger](https://github.com/koajs/logger): Request logs
* [koa-router](https://github.com/alexmingoia/koa-router): URL routing

### Mongoose plugins
* [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator): Validates unquie fields.
* [mongoose-json-patch](https://www.npmjs.com/package/mongoose-json-patch): Writable permissions

### Testing
All new code requires unit tests. The goal is to have large test coverage in the beginnings so there is no back tracking. We use the following frameworks for testing. All tests will be in the test directory.
* [Mocha](http://mochajs.org)
* [Supertest](https://github.com/visionmedia/supertest)
* [Chai](http://chaijs.com)

An example test looks like this:
```javascript
it('/GET should return a message in response', (done) => {
    api.get('/api')
    .end((error, response) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.not.equal(null);
      done();
    })
  });
```


### Set-up
#### Prerequisite 
In [app.js](app.js), you need to set your mongo URI in ```javascript mongoose.connect('')```
Also, [Kickbox](https://kickbox.io) was used for email verification. Client IDs are required in [kiqitAdminUserSchema.js](models/kiqitAdminUserSchema.js) and 
[kiqitUserSchema.js](models/kiqitUserSchema.js)
#### OSX
First make sure you have npm installed.
```bash
brew install npm
```

Install node modules on the root directory.
```bash
npm install
```

Start the server, port 8000
```bash
npm start
```

Run unit tests
Note: server must be running locally to test for now.
```bash
npm test
```

As contributors use different OS's, update the steps for set-up for that OS.
