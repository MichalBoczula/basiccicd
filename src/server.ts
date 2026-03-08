import express from 'express';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      console.error('Missing WEATHER_API_KEY');
      return res.status(500).json({
        error: 'I am tired, boss.',
        details: 'Server configuration error'
      });
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          units: 'metric',
          appid: apiKey
        }
      }
    );

    return res.json(response.data);
  } catch (error: any) {
    if (error.response && error.response.data) {
      return res.status(error.response.status).json({
        error: 'I am tired, boss.',
        details: error.response.data.message
      });
    }

    console.error('Unexpected error while fetching weather:', error);

    return res.status(500).json({
      error: 'I am tired, boss.',
      details: 'Internal server error'
    });
  }
});

export default app;

if (require.main === module) {
  console.log('Starting weather app...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}