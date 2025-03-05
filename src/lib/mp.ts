import { MercadoPagoConfig, Preference } from "mercadopago";

interface ILinkPago {
  clase: string;
  precio: number;
}

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function link_pago({ clase, precio }: ILinkPago) {
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
    },
  });

  //   preference.auto_return = "approved";
  console.log(preference.init_point);
  return preference.init_point;
}
