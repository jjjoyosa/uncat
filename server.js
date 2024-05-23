const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // You can change the port if needed

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, '/')));

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Assuming your HTML file is named index.html
});

app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'page.html')); // Assuming your HTML file is named index.html
  });

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));