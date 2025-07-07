import { CartItem } from "@/app/Tienda/types/cartContext";
import { Product } from "@/app/Tienda/types/procucts";
import { ObjectId, Schema, model, models } from "mongoose";

export interface CartItemSold {
  productItemName: string;
  productItemDescription: string;
  productItemPrice: number;
  productItemSlug: string;
  quantity: number; // Opcional si no se necesita la cantidad
}

export interface SalesStore {
  _id: ObjectId | string;
  userName: string;
  totalPrice: number;
  date: Date;
  state: string;
  email: string;
  telefono?: string;
  cart: CartItemSold[];
}
const cartSchema = new Schema<CartItemSold>({
  productItemName: { type: String, required: true },
  productItemDescription: { type: String, required: true },
  productItemPrice: { type: Number, required: true },
  productItemSlug: { type: String, required: true },
  quantity: { type: Number, required: true }, // Asegúrate de que quantity sea requerido si es necesario
});

const SalesStoreSchema = new Schema<SalesStore>(
  {
    
    userName: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    state: { type: String, default: "pending" },
    email: { type: String, required: true },
    telefono: { type: String, required: false },
    cart: {
      _id:false,
      type: [cartSchema], // Usar el esquema de cartSchema para los items del carrito
      required: true,
      default: [], // Asegurarse de que el carrito esté inicializado como un array
    },

  },
  { timestamps: true }
);

export const Venta =
  models.Venta || model<SalesStore>("Venta", SalesStoreSchema);
export default Venta;
