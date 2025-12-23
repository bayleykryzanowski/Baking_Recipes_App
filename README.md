🧁 Bayley’s Favourite Baking Recipes
A full-stack web application designed to help home bakers track their favorite creations, discover daily baking tips, and share recipes with friends.


🛠️ Features
Recipe Management: Create, view, edit, and delete baking recipes.

Favorites System: Pin your most-loved recipes to the top of the grid.

Baking Tip of the Day: Real-time tips fetched from an external API, processed and transformed by the backend.

Email Sharing: Automatically format recipes into an email to share with others.

Responsive Design: Optimized for both desktop and mobile viewing.

🚀 Installation & Setup
Follow these steps to get the project running on your local machine:

1. Prerequisites
Ensure you have Node.js installed (LTS version recommended).

2. Project Structure
Ensure your files are organized as follows:

bayley-baking-app/
├── public/              # Frontend files
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js            # Node.js/Express Backend
├── recipes.json         # Local Database (JSON)
├── package.json         # Project dependencies
└── README.md            # This documentation

3. Install Dependencies
Open your terminal in the root directory and run:

npm install express axios cors

4. Run the Application
   
Start the server by running:

node server.js

5. Access the App
   
Open your browser and navigate to: http://localhost:3000

🏗️ Technical Details
Backend Technology
Node.js & Express: Used to build a RESTful API and serve static frontend files.

FileSystem (fs): Used to persist recipe data in a local recipes.json file.

External API Integration
API Used: Advice Slip API

Transformation: The backend consumes the raw "advice" data, filters it, and transforms the object structure into a custom bakingTip format before sending it to the frontend. This ensures the frontend never communicates directly with third-party services.

Frontend Technology
Vanilla JavaScript: Handles DOM manipulation, asynchronous fetch requests, and local filtering.

CSS3: Custom styles using CSS variables for a consistent "Bakery" theme.

📝 Submission Credentials
External API: Publicly available (No API Key required).

Database: Local JSON storage (Reset by clearing recipes.json to []).
