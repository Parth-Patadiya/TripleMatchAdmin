// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the MongoClient is not repeatedly instantiated during hot reloading
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }
} else {
  // In production, it's safe to not use a global variable
  clientPromise = client.connect();
}

export default clientPromise;
