const axios = require('axios');
const currency_data = require('../public/currency_data.json');
const food_data = require('../public/food_data.json');


// Get number of days between start date and end date
const getDayCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const n_trip_days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return n_trip_days;
  };

  // Get total price of a trip by multiplying the daily expenses by the number of days, and add in the ticket price
  const getTotalPrice = (n_trip_days, trip) => {
    const { ticket, daily_accommodation, daily_food, daily_miscellaneous } = trip;
  
    const totalExpenses =
      n_trip_days * daily_accommodation +
      n_trip_days * daily_food +
      n_trip_days * daily_miscellaneous;
  
    const totalPrice = ticket + totalExpenses;
  
    return totalPrice;
  };
  
  // Checks if dates are valid (are not in the past, end dat e> start date)
  const validateDate = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return start - currentDate >= 0 && end - start>= 0;
  }
  
  // Gets the currency code of a country, from a local JSON file mapping the two
  const countryToCurrency = (country) => {
    const currency = currency_data.find((c) => c.country === country.toLowerCase());
    return currency ? currency.currency_code : null;
  };

  // Calls third party api to get exchange rate between a currency and EGP
  const getExchangeRate = async (currency) => {
    try {
      const response = await axios.get(`https://api.exchangerate.host/convert?from=${currency}&to=EGP`);
      const rate = response.data.result;
      return rate;
    } catch (error) {
      return -1;
    }
  }
  
  // Makes country name ready for input for the third party API call to get food data
  const getFoodPrompt = (country) => {
    const food_prompt = food_data.find((c) => c.country === country.toLowerCase());
    return food_prompt ? food_prompt.food_prompt : null;
  }
  
  // Calls 3rd part API to get food data from a country
  const getFood = async (country) => {
    const food_prompt = getFoodPrompt(country)
    if (!food_prompt) return []
  
    try {
      const response = await axios.get(`http://www.themealdb.com/api/json/v1/1/filter.php?a=${food_prompt}`, {timeout:1000});
      const food = response.data.meals.map(meal => meal.strMeal);
  
      return food
    } catch (error) {
      return []
    }
  }
  

  // Get weather date from 3rd party api up to 30 days ahead. 
  //API call gets 30 days from present, function slices the array accordingly to return temperatures
  const getWeather = async (location, startDate, endDate) => {
    
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toString();
  
    first_day = getDayCount(currentDate, startDate) -1
    last_day = getDayCount(currentDate, endDate)
  
  
    if(first_day>=30) return []
    if(last_day>=30) last_day = 30
    
    try {
      const response = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/climate?q=${location}&appid=${process.env.WEATHER_API}`);
      const weather_list = response.data.list.map(day => day.temp);
      const selected_weather = weather_list.slice(first_day,last_day)
      return selected_weather
    } catch (error) {
      return []
    }
  }

  module.exports = {getWeather, getFood, getExchangeRate, countryToCurrency, validateDate, getDayCount, getTotalPrice}