const Joi = require("joi")
const integer = Joi.number().integer()
const string = Joi.string()
const arr=Joi.array().items(Joi.string());
const userSchema_ = Joi.object({
    username: string,
    age: integer,
    hobbies: arr,
  })


  module.exports = {
    userSchema_
  }