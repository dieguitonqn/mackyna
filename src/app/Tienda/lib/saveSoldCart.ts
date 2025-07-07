"use server";
import connect from "@/lib/db";
import Venta, { CartItemSold } from "@/lib/models/ventasTienda";

export async function saveSoldCart(
  cart: CartItemSold[],
  name: string,
  email: string,
  telefono: string,
  totalPrice: number
) {
  // console.log("Guardando carrito vendido:", {
  //   cart,
  //   name,
  //   email,
  //   telefono,
  //   totalPrice,
  // });
  try {
    await connect();
    const newVenta = new Venta({
      userName: name,
      email: email,
      telefono: telefono,
      totalPrice: totalPrice,
      cart: cart,
      state: "pending",
    });
    
    const response = await Venta.create({
      userName: name,
      email: email,
      telefono: telefono,
      totalPrice: totalPrice,
      cart: cart,
      state: "pending",
    });

    if (!response) {
      console.error("Error al guardar el carrito vendido");
      return false;
    }

    // console.log("Carrito vendido guardado correctamente:", response);
    return true;
  } catch (error) {
    console.error("Error al guardar el carrito vendido:", error);
    return false;
  }
}
