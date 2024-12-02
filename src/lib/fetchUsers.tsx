import connect from './db';
import User from './models/user';

interface User {
  _id: string; // Assuming ObjectId is converted to string on server-side
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

async function FetchUsers(): Promise<User[]> {
  try {
    // Connect to the database
    await connect();

    // Fetch users from the database using `User.find().lean()`
    const usersDB = await User.find().lean<User[]>(); // Explicitly specify return type

    // Process and return the users
    return usersDB;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error for handling in the calling component
  }
}

export default FetchUsers;
