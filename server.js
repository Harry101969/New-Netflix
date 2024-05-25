const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const apiEndpoint = "https://api.themoviedb.org/3";
const apiKey = process.env.API_KEY;

app.use(express.static('public'));

app.get('/api/genres', async (req, res) => {
    try {
        const response = await axios.get(`${apiEndpoint}/genre/movie/list?api_key=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/movies', async (req, res) => {
    const { genreId } = req.query;
    try {
        const response = await axios.get(`${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const response = await axios.get(`${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyALflbsAUPWoNvgyEJ35u2I-1aP_rUwX84`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
