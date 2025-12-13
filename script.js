// 1. Initial Data
const starterRecipes = [
    { id: "s1", title: "Bayley's Signature Sourdough", prepTime: 120, ingredients: "500g Bread Flour, 350g Water, 10g Salt", steps: "Mix, stretch and fold, proof overnight, bake at 230°C.", favorite: false },
    { id: "s2", title: "Golden Lemon Drizzle Cake", prepTime: 45, ingredients: "225g Butter, 225g Sugar, 4 Eggs, 2 Lemons", steps: "Cream butter/sugar. Bake 180°C. Pour syrup over while warm.", favorite: false },
    { id: "s3", title: "Soft Chocolate Chip Cookies", prepTime: 15, ingredients: "1 cup Butter, 1 cup Sugar, Choc Chips", steps: "Cream butter, fold in dry ingredients. Bake at 190°C.", favorite: false },
    { id: "s4", title: "Blueberry Muffins", prepTime: 20, ingredients: "1.5 cups Flour, Blueberries, 1 Egg", steps: "Mix wet/dry. Fold in berries. Bake at 200°C.", favorite: false }
];

let customRecipes = JSON.parse(localStorage.getItem('bayleyCustomRecipes')) || [];

// 2. Display Function
function displayRecipes(recipeArray) {
    const list = document.getElementById('recipeList');
    if (!list) return;
    list.innerHTML = '';

    // Sort: Favorites first
    const sortedArray = [...recipeArray].sort((a, b) => b.favorite - a.favorite);

    sortedArray.forEach(recipe => {
        const card = document.createElement('div');
        card.className = `recipe-card ${recipe.favorite ? 'is-fav' : ''}`;
        card.innerHTML = `
            <div class="card-header">
                <small style="color: #d2a679; font-weight: bold;">RECIPE</small>
                <button onclick="toggleFavorite('${recipe.id}')" class="fav-btn">
                    ${recipe.favorite ? '❤️' : '🤍'}
                </button>
            </div>
            <h3>${recipe.title}</h3>
            <p><strong>⏱ ${recipe.prepTime} mins</strong></p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p style="margin-top: 10px;"><strong>Steps:</strong> ${recipe.steps}</p>
            <div class="card-actions">
                <button onclick="editRecipe('${recipe.id}')" class="edit-btn">Edit</button>
                <button onclick="shareRecipe('${recipe.id}')" class="share-btn">✉️ Share</button>
                <button onclick="deleteRecipe('${recipe.id}')" class="delete-btn">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// 3. Action Logic
window.toggleFavorite = function(id) {
    let recipe = customRecipes.find(r => r.id == id) || starterRecipes.find(r => r.id == id);
    if (recipe) {
        recipe.favorite = !recipe.favorite;
        localStorage.setItem('bayleyCustomRecipes', JSON.stringify(customRecipes));
        displayRecipes([...starterRecipes, ...customRecipes]);
    }
};

window.deleteRecipe = function(id) {
    if (confirm("Delete this recipe?")) {
        customRecipes = customRecipes.filter(r => r.id != id);
        localStorage.setItem('bayleyCustomRecipes', JSON.stringify(customRecipes));
        displayRecipes([...starterRecipes, ...customRecipes]);
    }
};

window.editRecipe = function(id) {
    const recipe = [...starterRecipes, ...customRecipes].find(r => r.id == id);
    if (recipe) {
        document.getElementById('title').value = recipe.title;
        document.getElementById('prepTime').value = recipe.prepTime;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('steps').value = recipe.steps;
        document.getElementById('add-section').scrollIntoView({behavior: 'smooth'});
        customRecipes = customRecipes.filter(r => r.id != id);
    }
};

window.shareRecipe = function(id) {
    const recipe = [...starterRecipes, ...customRecipes].find(r => r.id == id);
    if (recipe) {
        const subject = encodeURIComponent(`Baking Recipe: ${recipe.title}`);
        const body = encodeURIComponent(`Check out this recipe:\n\nTitle: ${recipe.title}\nPrep: ${recipe.prepTime}m\n\nIngredients:\n${recipe.ingredients}\n\nSteps:\n${recipe.steps}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
};

// 4. Form & Search
document.getElementById('recipeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newRecipe = {
        id: Date.now(),
        title: document.getElementById('title').value,
        prepTime: document.getElementById('prepTime').value,
        ingredients: document.getElementById('ingredients').value,
        steps: document.getElementById('steps').value,
        favorite: false
    };
    customRecipes.push(newRecipe);
    localStorage.setItem('bayleyCustomRecipes', JSON.stringify(customRecipes));
    e.target.reset();
    displayRecipes([...starterRecipes, ...customRecipes]);
});

window.filterRecipes = function() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filtered = [...starterRecipes, ...customRecipes].filter(r => 
        r.title.toLowerCase().includes(query) || r.ingredients.toLowerCase().includes(query)
    );
    displayRecipes(filtered);
};

// Start
window.addEventListener('DOMContentLoaded', () => {
    displayRecipes([...starterRecipes, ...customRecipes]);
});