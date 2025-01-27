const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

// Database Connection
const client = new Client({
  connectionString: 'postgresql://postgres:password@localhost:5432/foodbuddydatabase',
});

// Connect to the database once
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/launchpage.html');
});

app.post('/form', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

app.post('/submit', async (req, res) => {
    const { f_name, mail, phone, height, weight } = req.body;

    if (!f_name || !mail || !phone || !height || !weight) {
        return res.status(400).send('All fields are required!');
    }

    const query = 'INSERT INTO foodbuddy (f_name, mail, phone, height, weight) VALUES ($1, $2, $3, $4, $5)';

    try {
        await client.query(query, [f_name, mail, phone, height, weight]);
        console.log('Data inserted successfully:', { f_name, mail, phone, height, weight });
        res.sendFile(__dirname + '/profile.html');
    } catch (err) {
        console.error('Error inserting data into database:', err.stack);
        res.status(500).send('Failed to save data.');
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
