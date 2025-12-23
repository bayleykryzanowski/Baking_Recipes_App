const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './recipes.json';

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// --- HELPER FUNCTIONS ---
const getRecipes = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveRecipes = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// --- EXTERNAL API CONSUMPTION ---
// Backend consumes the API and transforms it for the frontend
app.get('/api/baking-tip', async (req, res) => {
    try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        // Transform 'advice' to 'dailyTip' for frontend
        const transformedData = {
            id: response.data.slip.id,
            dailyTip: `Pro Tip: ${response.data.slip.advice}`
        };
        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch daily tip" });
    }
});

// --- RECIPE ROUTES ---
app.get('/api/recipes', (req, res) => {
    res.json(getRecipes());
});

app.post('/api/recipes', (req, res) => {
    const recipes = getRecipes();
    const newRecipe = { id: Date.now(), ...req.body };
    recipes.push(newRecipe);
    saveRecipes(recipes);
    res.status(201).json(newRecipe);
});

app.delete('/api/recipes/:id', (req, res) => {
    let recipes = getRecipes();
    recipes = recipes.filter(r => r.id != req.params.id);
    saveRecipes(recipes);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));