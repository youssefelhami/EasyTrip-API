const express = require("express");
const router = express.Router();
const { createTrip, 
    updateTrip, 
    deleteTrip, 
    getTripsByBudget, 
    getTripsByCountry, 
    getTripById, 
    getAllTrips } = require("../controllers/trip");

const {apiKeyCheck, isAuthenticated} = require("../utils/middewares")



// Create
router.post("/", apiKeyCheck, isAuthenticated, createTrip);

// Update
router.put("/:id", apiKeyCheck, isAuthenticated, updateTrip);

// Delete
router.delete("/:id", apiKeyCheck, isAuthenticated, deleteTrip);

// Get with budget
router.get("/budget", apiKeyCheck, getTripsByBudget);

// Get with country
router.get("/country", apiKeyCheck, getTripsByCountry);

// Get one
router.get("/:id", apiKeyCheck, getTripById);

// Get all
router.get("/", apiKeyCheck, getAllTrips);

module.exports = router;
