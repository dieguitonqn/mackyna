import { stat } from "fs";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

interface ILinkPago {
  clase: string;
  precio: number;
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
    const { clase, precio } = await req.json();
  console.log(clase, precio);

  const preference = await new Preference(mpClient).create({
    body: {
      items: [
        {
          id: clase,
          unit_price: precio,
          quantity: 1,
          title: clase,
        },
      ],
      metadata: {
        clase,
      },
      back_urls: {
        success: "https://refresh-dairy-adding-presently.trycloudflare.com/portalAlumnos/Pago/PagoSuccess",
      },
    payment_methods: {
        excluded_payment_types: [
            {
                id: "ticket",
            },
            {
                id: "atm",                  
            },
            {
                id: "bank_transfer",
            },
            {
                id: "credit_card",
            },
            {
                id: "prepaid_card",
            },
            {
                id: "digital_currency",
            },
            {
                id: "crypto_trasfer",
            },
            {
                id: "voucher_card",
            }
            ],
      
        installments: 1,
        },
    },
  });
    
    
  console.log(preference.init_point);
  return new NextResponse(JSON.stringify({ link: preference.init_point }), {status: 200});
}



