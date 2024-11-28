import connect from './db'
import User from './models/user';


async function FetchUsers() {
  
  await connect();
  
  // Obtener los usuarios como objetos planos usando `.lean()`
  const usersDB = await User.find().lean();
   
  // Convertir `_id` a string para evitar problemas de serialización
 
  const users = usersDB.map((user) => (
    
    {
    
    // _id: user._id.toString(), // Convertir ObjectId a string
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
  }));
  console.log(users)
  return users; // Devolver la lista procesada
}

export default FetchUsers;

