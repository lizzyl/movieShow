var mongoose = require('mongoose')
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: normal user
  // 1: verified user
  // 2: professional user
  // >10: admin
  // >50: super admin
  role: {
    type: Number, 
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function(next) {
  var user = this;
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  var hash = crypto.createHash('md5').update(user.password).digest('hex');
  user.password = hash;

  next()
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    var hash = crypto.createHash('md5').update(_password).digest('hex');
    if(hash == this.password) {
      cb(null,true)
    } else {
      cb('error: not match!')
    }
  }
}


UserSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema