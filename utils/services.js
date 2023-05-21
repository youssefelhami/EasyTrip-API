const axios = require('axios');
const currency_data = require('../public/currency_data.json');
const food_data = require('../public/food_data.json');



const getDayCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const n_trip_days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return n_trip_days;
  };
  
  const getTotalPrice = (n_trip_days, trip) => {
    const { ticket, daily_accommodation, daily_food, daily_miscellaneous } = trip;
  
    const totalExpenses =
      n_trip_days * daily_accommodation +
      n_trip_days * daily_food +
      n_trip_days * daily_miscellaneous;
  
    const totalPrice = ticket + totalExpenses;
  
    return totalPrice;
  };
  
  const validateDate = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return start - currentDate >= 0 && end - start>= 0;
  }
  
  const countryToCurrency = (country) => {
    const currency = currency_data.find((c) => c.country === country.toLowerCase());
    return currency ? currency.currency_code : null;
  };


  const getExchangeRate = async (currency) => {
    try {
      const response = await axios.get(`https://api.exchangerate.host/convert?from=${currency}&to=EGP`);
      const rate = response.data.result;
      return rate;
    } catch (error) {
      return -1;
    }
  }
  
  const getFoodPrompt = (country) => {
    const food_prompt = food_data.find((c) => c.country === country.toLowerCase());
    return food_prompt ? food_prompt.food_prompt : null;
  }
  
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
  
  
  const getWeather = async (location, startDate, endDate) => {
    
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toString();
  
    first_day = getDayCount(currentDate, startDate) -2
    last_day = getDayCount(currentDate, endDate) - 1
  
  
    if(first_day>=30) return []
    if(last_day>=30) last_day = 30
    
    try {
      const response = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/climate?q=${location}&appid=${process.env.WEATHER_API}`);
      const weather_list = response.data.list.map(day => day.temp);
      const selected_weather = weather_list.slice(first_day,last_day)
      return selected_weather
    } catch (error) {
      // console.log(error)
      return []
    }
  }

  module.exports = {getWeather, getFood, getExchangeRate, countryToCurrency, validateDate, getDayCount, getTotalPrice}