/**
  Kiqit Admin User Schema. Represents an kiqit user.
**/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const kickbox = require('kickbox')
                  .client('') //Insert Kickbox client ID
                  .kickbox();

const KiqitAdminUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  events: {
    type: [String],
  },
  profile_url: {
    type: String,
  },
}, {
  timestamps: true,
});

KiqitAdminUserSchema.pre('save', function hashPassword(next) {
  const adminUser = this;

  if (!adminUser.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    return bcrypt.hash(adminUser.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }

      adminUser.password = hash;
      return next();
    });
  });
});

KiqitAdminUserSchema.methods.comparePassword = function checkPassword(candidatePassword) {
  const adminUser = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, adminUser.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      return resolve(isMatch);
    });
  });
};

KiqitAdminUserSchema.methods.authenticateEmail = function checkEmail() {
  const adminUser = this;
  return new Promise((resolve, reject) => {
    kickbox.verify(adminUser.email, (err, response) => {
      if (err) {
        return reject(err);
      }

      return resolve(response);
    });
  });
};

KiqitAdminUserSchema.set('toJSON', {
  transform(doc, ret) {
    const retJson = ret;
    delete retJson.password;
    return retJson;
  },
});

KiqitAdminUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('KiqitAdminUser', KiqitAdminUserSchema);
