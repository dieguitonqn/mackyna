import { NextResponse } from "next/server";
import Plantilla from "@/lib/models/plantilla";
import { IPlantilla } from "@/types/plantilla";

export const POST = async (req: Request) => {
  const plantilla: IPlantilla = await req.json();
  if (!plantilla || typeof plantilla !== "object") {
    console.error("No request body found");
  }
  console.log("Request body:", plantilla);

  // Aquí puedes agregar la lógica para guardar la plantilla en la base de datos
  try {
    const newPlantilla = new Plantilla(plantilla);
    await newPlantilla.save();
    console.log("Plantilla guardada:", newPlantilla);
    return new NextResponse(
      JSON.stringify({
        message: "POST request received",
        //   data: req.body,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error al guardar la plantilla:", error);

    return new NextResponse(
      JSON.stringify({ message: "Error al guardar la plantilla." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

};


export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("plantillaID");
  console.log("ID de plantilla recibido:", id);
  if (id) {
    try {
      const plantilla = await Plantilla.findById(id);
      if (!plantilla) {
        return new NextResponse(
          JSON.stringify({ message: "Plantilla no encontrada." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      console.log("Plantilla encontrada:", plantilla);
      return new NextResponse(
        JSON.stringify(plantilla.toObject()),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error al obtener la plantilla:", error);
      return new NextResponse(
        JSON.stringify({ message: "Error al obtener la plantilla." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    try {
      const plantillas = await Plantilla.find();
      console.log("Plantillas encontradas:", plantillas);
      const plantillasWithStringIds = plantillas.map((plantilla) => {
        return {
          ...plantilla.toObject(),
          _id: plantilla._id.toString(), // Convertir ObjectId a string
        };
      });
      return new NextResponse(
        JSON.stringify(plantillasWithStringIds),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error al obtener las plantillas:", error);
      return new NextResponse(
        JSON.stringify({ message: "Error al obtener las plantillas." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};