// Global state to keep track of recipes currently loaded
let allRecipes = [];

// INITIAL LOAD: Fetch data when the page opens
window.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
    fetchBakingTip();
});

// FETCH Daily TIP: Consumes the transformed data from Backend
async function fetchDailyTip() {
    try {
        const response = await fetch('/api/baking-tip');
        const data = await response.json();
        // Uses the transformed key 'dailyTip' created in server.js
        document.getElementById('daily-tip').innerText = data.dailyTip;
    } catch (error) {
        console.error("Error fetching tip:", error);
        document.getElementById('daily-tip').innerText = "Pro Tip: Always preheat your oven!";
    }
}

// FETCH RECIPES: Gets the JSON array from your server
async function fetchRecipes() {
    try {
        const response = await fetch('/api/recipes');
        allRecipes = await response.json();
        displayRecipes(allRecipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// DISPLAY FUNCTION: Renders cards to the HTML
function displayRecipes(recipeArray) {
    const list = document.getElementById('recipeList');
    list.innerHTML = '';

    // Sort: Favorites first (true = 1, false = 0)
    const sorted = [...recipeArray].sort((a, b) => b.favorite - a.favorite);

    sorted.forEach(recipe => {
        const card = document.createElement('div');
        card.className = `recipe-card ${recipe.favorite ? 'is-fav' : ''}`;
        card.innerHTML = `
            <div class="card-header">
                <small class="badge">Baking</small>
                <button onclick="toggleFavorite('${recipe.id}')" class="fav-btn">
                    ${recipe.favorite ? '❤️' : '🤍'}
                </button>
            </div>
            <h3>${recipe.title}</h3>
            <p class="time-tag">⏱ ${recipe.prepTime} mins</p>
            <div class="card-content">
                <strong>Ingredients:</strong>
                <p>${recipe.ingredients}</p>
                <strong>Steps:</strong>
                <p>${recipe.steps}</p>
            </div>
            <div class="card-actions">
                <button onclick="editRecipe('${recipe.id}')" class="edit-btn">Edit</button>
                <button onclick="shareRecipe('${recipe.id}')" class="share-btn">✉️ Share</button>
                <button onclick="deleteRecipe('${recipe.id}')" class="delete-btn">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// ADD / UPDATE RECIPE: 
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const recipeData = {
        title: document.getElementById('title').value,
        prepTime: document.getElementById('prepTime').value,
        ingredients: document.getElementById('ingredients').value,
        steps: document.getElementById('steps').value,
        favorite: false
    };

    // Send data to backend
    await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
    });

    e.target.reset();
    fetchRecipes(); // Refresh the grid
});

// TOGGLE FAVORITE
window.toggleFavorite = async function(id) {

    const recipe = allRecipes.find(r => r.id == id);
    if (recipe) {
        recipe.favorite = !recipe.favorite;
       
        displayRecipes(allRecipes);
    }
};

// DELETE RECIPE: Communicates with backend DELETE route
window.deleteRecipe = async function(id) {
    if (confirm("Remove this recipe from your collection?")) {
        await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        fetchRecipes();
    }
};

// EDIT RECIPE: Populates form and scrolls down
window.editRecipe = function(id) {
    const recipe = allRecipes.find(r => r.id == id);
    if (recipe) {
        document.getElementById('title').value = recipe.title;
        document.getElementById('prepTime').value = recipe.prepTime;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('steps').value = recipe.steps;
        document.getElementById('add-section').scrollIntoView({ behavior: 'smooth' });
        
        // Temporarily delete so the "Save" acts as an update
        fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    }
};

window.shareRecipe = async function(id) {
    const r = allRecipes.find(rec => rec.id == id);
    if (!r) return;

    const shareData = {
        title: `Baking Recipe: ${r.title}`,
        text: `Check out this recipe for ${r.title}!\n\n` +
              `Prep Time: ${r.prepTime} mins\n` +
              `Ingredients: ${r.ingredients}\n\n` +
              `Steps: ${r.steps}`,
        url: window.location.href // Includes the link to your app
    };

    // Try the Native Share Menu (Best for Mobile/Mac/Chrome)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log("Shared successfully");
        } catch (err) {
            console.log("Share cancelled or failed");
        }
    } 
    // Fallback: Copy to Clipboard (Best for Desktop)
    else {
        try {
            const fullText = `${shareData.text}\n\nSent from Bayley's Baking App`;
            await navigator.clipboard.writeText(fullText);
            alert("Recipe copied to clipboard! You can now paste it into any message or email.");
        } catch (err) {
            alert("Could not share or copy recipe.");
        }
    }
};

//  FILTER: Local search logic
window.filterRecipes = function() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filtered = allRecipes.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.ingredients.toLowerCase().includes(query)
    );
    displayRecipes(filtered);
};