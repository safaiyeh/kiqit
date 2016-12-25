/**
  Kiqit User Schema. Represents an kiqit user.
**/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const kickbox = require('kickbox')
                  .client('') //Insert Kickbox client ID
                  .kickbox();


const KiqitUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

KiqitUserSchema.pre('save', function hashPassword(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    return bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }

      user.password = hash;
      return next();
    });
  });
});

KiqitUserSchema.methods.comparePassword = function checkPassword(candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      return resolve(isMatch);
    });
  });
};

KiqitUserSchema.methods.authenticateEmail = function checkEmail() {
  const user = this;
  return new Promise((resolve, reject) => {
    kickbox.verify(user.email, (err, response) => {
      if (err) {
        return reject(err);
      }

      return resolve(response);
    });
  });
};

KiqitUserSchema.set('toJSON', {
  transform(doc, ret) {
    const retJson = ret;
    delete retJson.password;
    return retJson;
  },
});

KiqitUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('KiqitUser', KiqitUserSchema);
