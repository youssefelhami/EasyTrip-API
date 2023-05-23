
const Trip = require("../models/Trip");
const createError = require("../utils/error");
const {getWeather, 
      getFood, 
      getExchangeRate, 
      countryToCurrency, 
      validateDate, 
      getDayCount, 
      getTotalPrice} = require('../utils/services')




const {tripSchema, budgetSchema, countrySchema} = require("../utils/validator");


// Create Trip and assign it a currency based on the Country
exports.createTrip = async (req, res, next) => {
    
  const {error, value} =  tripSchema.validate(req.body)
  if (error){
    return next(error)
  }
  const { city, country, ...rest } = req.body;
  currency =  countryToCurrency(country)
  if (!currency) return next(createError(400, "Invalid Country"))

  const newTrip = new Trip({
    city: city.toLowerCase(),
    country: country.toLowerCase(),
    currency: currency,
    ...rest,
  });

  try {
    const savedTrip = await newTrip.save();
    res.status(200).json(savedTrip);
  } catch (err) {
    next(err);
  }
};


// Update Trip by ID and reassign currency if change in country
exports.updateTrip = async (req, res, next) => {
  
  const { id } = req.params;

  try {
    let trip = await Trip.findById(id);

    if (!trip) {
      const error = createError(404, "Trip not found");
      return next(error);
    }


    trip = { ...trip.toObject(), ...req.body };
    delete trip._id
    delete trip.__v
    delete trip.currency
    const {error, value} =  tripSchema.validate(trip)
    if (error){
      return next(error)
    }

    trip.city = trip.city.toLowerCase();
    trip.country = trip.country.toLowerCase();
    trip.currency =  countryToCurrency(trip.country)
    if (!trip.currency) return next(createError(400, "Invalid Country"))
    

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: trip },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

//Delete Trip by ID
exports.deleteTrip = async (req, res, next) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) return next(createError(404, "Trip not found"))
    res.status(200).json(deletedTrip);
  } catch (err) {
    next(err);
  }
};

// Calculates trip prices based on trip duration, selects trips with lower price than budget, 
//Adds in exchange rate, weather and Food for each trip
exports.getTripsByBudget = async (req, res, next) => {
  const { startDate, endDate, budget } = req.query;

  const {error, value} = budgetSchema.validate({ startDate, endDate, budget })
  if (error){
    return next(error)
  }

  val_dates = validateDate(startDate, endDate)
  
  if (!val_dates) return next(createError(400, "Invalid Date"))


  const n_trip_days = getDayCount(startDate, endDate);

  try {
    const trips = await Trip.find();
    const budgetTrips = trips.filter((trip) => {
      const totalPrice = getTotalPrice(n_trip_days, trip);
      return totalPrice <= budget;
    });
    const budgetTripPrices = await Promise.all(budgetTrips.map(async (trip) => {
      const totalPrice = getTotalPrice(n_trip_days, trip);
      const exchangeRate =  await getExchangeRate(trip.currency)
      const weather_list = await getWeather(trip.city, startDate, endDate)
      const food_list = await getFood(trip.country)
      return { ...trip.toObject(), n_trip_days: n_trip_days,total_price: totalPrice,  exchange_rate: exchangeRate, meals: food_list, weather: weather_list};
    }));
    res.status(200).json(budgetTripPrices);
  } catch (err) {
    next(err);
  }
};

//Selects trips in a certain country and Calculates trip prices based on trip duration 
//Adds in exchange rate, weather and Food for each trip
exports.getTripsByCountry = async (req, res, next) => {
  const { startDate, endDate, destCountry } = req.query;
  const {error, value} = countrySchema.validate({ startDate, endDate, destCountry })
  if (error){
    return next(error)
  }
  const country = destCountry.toLowerCase()

  val_dates = validateDate(startDate, endDate)
  
  if (!val_dates) return next(createError(400, "Invalid Date"))
  const food_list = await getFood(country)
  const n_trip_days = getDayCount(startDate, endDate);
  try {
    const trips = await Trip.find({ country: country });

    const tripPrices = await Promise.all(trips.map( async (trip) => {
      const totalPrice = getTotalPrice(n_trip_days, trip);
      const exchangeRate =  await getExchangeRate(trip.currency)
      const weather_list = await getWeather(trip.city, startDate, endDate)
      return { ...trip.toObject(), n_trip_days: n_trip_days, total_price: totalPrice, exchange_rate : exchangeRate, meals:food_list, weather:weather_list };
    }));

    res.status(200).json(tripPrices);
  } catch (err) {
    next(err);
  }
};

// Get Trip by ID
exports.getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(createError(404, "Trip not found"))
    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

// Get a list of all trips
exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.set('Content-Range', `country 0-${trips.length}/${trips.length}`);
    res.set('X-Total-Count', trips.length)
    res.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count')    
    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};
