// "use client";

// // import React, { useEffect } from "react";
// // import { useState } from "react";

// interface EditButtonProps {
//   userID: string;
// }

// // type EditMetricUser = {
// //   userID: string;
// //   birthDate: Date | null;
// //   altura: number | 0;
// //   objetivo: string;
// // };

// export const EditButton = ({ userID }: EditButtonProps) => {
  
//   // const [user, setUser] = useState<EditMetricUser>({
//   //   userID: userID,
//   //   birthDate: null,
//   //   altura: 0,
//   //   objetivo: "",
//   // });

//   // useEffect(() => {
//   //   // fetch user data
//   //   const fetchUser = async () => {
//   //     try {
//   //       const userMetric = await fetch(`/api/usuarios?id=${userID}`);
//   //       const user = await userMetric.json();
//   //       setUser(user);
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };
//   //   fetchUser();
//   //   // setUser({ userID: userID, birthDate: new Date(), altura: 1.8, objetivo: "perder peso" });
//   // }, [userID]);



//   return (
//     <div>
//       <button className="btn btn-primary">Editar</button>
//       {/* {editing && (
//         <div className="card bg-slate-200 p-5 rounded-md mx-10 inset-0 z-50">
//           <form>
//             <label htmlFor="birthdate">Fecha de Nacimiento: </label>
//             <input
//               type="date"
//               id="birthdate"
//               value={user.birthDate?.toISOString().split("T")[0] || ""}
//             />
//             <label htmlFor="altura">Altura: </label>
//             <input type="number" id="altura" value={user.altura} />
//             <label htmlFor="objetivo">Objetivo: </label>
//             <input type="text" id="objetivo" value={user.objetivo} />
//             <button type="submit">Guardar</button>
//           </form>
//         </div>
//       )} */}
//     </div>
//   );
// };
