import mongoose, { Document, Schema } from 'mongoose';

// Define the Movie interface
export interface IMovie extends Document {
  title: string;
  videoUrl: string;
}

// Define the Movie schema
const movieSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

// Create and export the Movie model
export default mongoose.model<IMovie>('Movie', movieSchema);