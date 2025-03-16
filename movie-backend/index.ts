import express, { Request, Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
import {LRUCache}  from 'lru-cache';
import cors from 'cors';

const app = express();
app.use(cors());
// ttl = time to live
const cache = new LRUCache({ max: 100, ttl: 1000 * 60 * 5 }); // 5-minute cache

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moviestreaming', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

// Define a Movie schema
interface IMovie extends mongoose.Document {
  title: string;
  videoUrl: string;
}

const movieSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

const Movie = mongoose.model<IMovie>('Movie', movieSchema);

// Web scraping endpoint
app.get('/scrape-movies', async(req: Request, res: Response): Promise<any> => {
  const cachedMovies = cache.get('scrapedMovies');
  if (cachedMovies) {
    return res.json(cachedMovies);
  }

  const { data } = await axios.get<string>('https://example-movie-site.com');
  const $ = cheerio.load(data);
  const movies: { title: string; videoUrl: string }[] = [];

  $('.movie').each((i, element) => {
    const title = $(element).find('.title').text();
    const videoUrl = $(element).find('a').attr('href') || '';
    movies.push({ title, videoUrl });
  });

  cache.set('scrapedMovies', movies);
  res.json(movies);
});





// API endpoint to fetch movies
app.get('/movies', async (req: Request, res: Response): Promise<any> => {
  const cachedMovies = cache.get('movies');
  if (cachedMovies) {
    return res.json(cachedMovies);
  }

  const movies = await Movie.find();
  cache.set('movies', movies);
  res.json(movies);
});

// API endpoint to fetch a single movie
app.get('/movies/:id', async (req: Request, res: Response) => {
  const movie = await Movie.findById(req.params.id);
  res.json(movie);
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
