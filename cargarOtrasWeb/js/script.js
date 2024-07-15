import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(cors());

app.get('/proxy', async (req, res) => {
    try {
        const response = await fetch('https://www.google.com');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
