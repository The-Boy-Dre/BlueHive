import mongoose from 'mongoose';
import Movie from './models/Movie'; // Import the Movie model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moviestreaming', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

// Sample movie data
const movies = [
  { title: 'Movie 1', videoUrl: 'http://example.com/movie1.mp4' },
  { title: 'Movie 2', videoUrl: 'http://example.com/movie2.mp4' },
  { title: 'Movie 3', videoUrl: 'http://example.com/movie3.mp4' },
];

// Insert movies into the database
Movie.insertMany(movies)
  .then(() => {
    console.log('Movies seeded successfully!');
    process.exit(); // Exit the script
  })
  .catch((err) => {
    console.error('Error seeding movies:', err);
    process.exit(1); // Exit with an error code
  });