const express = require('express');
const router = express.Router();
const axios = require('axios');

// Controller function to handle the GET request
const getSubmissionByUUID = (req, res) => {
    const uuid = req.params.uuid;
    // Here you would typically fetch data from a database or another service
    // For now, we'll just return a mock response
    res.json({
        message: `Received request for UUID: ${uuid}`
    });
};

// Controller function to handle the GET request by ID
const getSubmissionById = (req, res) => {
    const id = req.params.id;
    // Here you would typically fetch data from a database or another service
    // For now, we'll just return a mock response
    res.json({
        message: `Received request for ID: ${id}`
    });
};

// Define the GET route
router.get('/api/submissions/test/uuid/:uuid', getSubmissionByUUID);

// Define the GET route by ID
router.get('/api/submissions/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`https://testapi.nexterchat.com/api/submissions/test/uuid/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            success: false,
            message: error.message || 'Error fetching data from external API'
        });
    }
});

module.exports = router;
