const Joi = require('joi')
const createError = require("./error");


const tripSchema = Joi.object({
  city: Joi.string().min(1).required().error((errors) => createError(400, 'city is required')),
  country: Joi.string().min(1).required().error((errors) => createError(400, 'country is required')),
  ticket: Joi.number().min(0).required().error((errors) => createError(400, 'ticket is required and needs to be a positive number')),
  daily_accommodation: Joi.number().min(0).required().error((errors) => createError(400, 'accommodation is required and needs to be a positive number')),
  daily_food: Joi.number().min(0).required().error((errors) => createError(400, 'food is required and needs to be a positive number')),
  daily_miscellaneous: Joi.number().required().min(0).error((errors) => createError(400, 'miscellaneous is required and needs to be a positive number')),
  image: Joi.string().min(1).required()
})

const budgetSchema = Joi.object({
    startDate: Joi.string().isoDate().required().error((errors) => createError(400, 'Invalid format or missing Start Date')),
    endDate: Joi.string().isoDate().required().error((errors) => createError(400, 'Invalid format or missing End Date')),
    budget: Joi.number().min(0).required().error((errors) => createError(400, 'Invalid, Negative or missing budget')),
  })

const countrySchema = Joi.object({
    startDate: Joi.string().isoDate().required().error((errors) => createError(400, 'Invalid format or missing Start Date')),
    endDate: Joi.string().isoDate().required().error((errors) => createError(400, 'Invalid format or missing End Date')),
    destCountry: Joi.string().min(1).required().error((errors) => createError(400, 'Missing country')),
})

const authSchema = Joi.object({
  client_id: Joi.string().min(1).required().error((errors) => createError(400, 'Invalid format or missing client id')),
  secret: Joi.string().min(1).required().error((errors) => createError(400, 'Invalid format or missing secret')),
})


const userSchema = Joi.object({
  username: Joi.string().min(3).required().error((errors) => createError(400, 'Invalid format or missing username')),
  password: Joi.string().min(6).required().error((errors) => createError(400, 'Invalid format or missing password')),
})


module.exports = {tripSchema, budgetSchema, countrySchema, userSchema, authSchema}