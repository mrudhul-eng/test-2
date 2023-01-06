const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

app.get('/api/get-speech-token', async (request, response, next) => {
    response.setHeader('Content-Type', 'application/json');

    if (process.env.SUBSCRIPTIONKEY !== '' || process.env.REGION !== '') {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTIONKEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const result = await axios.post(`https://${process.env.REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            response.send({ token: result.data, region: process.env.REGION });
        } catch (error) {
            response.status(401).send('Error authorizing speech key.');
        }
    } else {
        response.status(400).send('Please add your subscription key or region to the .env file.');

    }
});

app.listen(3001);