"use server";
import { NextRequest, NextResponse } from "next/server";
import { S3 } from "aws-sdk";
import { createClient } from "@supabase/supabase-js";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];
    const folderName = formData.get("folderName") as string;
    const numeroDocumento = formData.get("numeroDocumento") as string;

    if (!folderName) {
      throw new Error("No folder name provided");
    }

    if (!numeroDocumento) {
      throw new Error("No document number provided");
    }

    const { data: existingRecords, error: fetchError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("numerodocumento", numeroDocumento);

    if (fetchError) {
      console.error("Error al verificar el número de documento:", fetchError);
      return NextResponse.json(
        { error: "Error al verificar el número de documento" },
        { status: 500 }
      );
    }

    if (existingRecords.length > 0) {
      return NextResponse.json(
        { error: "Número de documento ya existe" },
        { status: 400 }
      );
    }

    const filePromises = files.map(async (file) => {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `${folderName}/${Date.now()}_${file.name}`,
        Body: fileBuffer,
        ContentType: file.type,
      };

      console.log("Upload params:", uploadParams);

      try {
        const s3Response = await s3.upload(uploadParams).promise();
        console.log("S3 response:", s3Response);
        return s3Response.Location;
      } catch (uploadError) {
        console.error("Error al subir archivo a S3:", uploadError);
        throw new Error("Error al subir archivo a S3");
      }
    });

    const fileUrls = await Promise.all(filePromises);

    const { data: insertData, error: insertError } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre: formData.get("nombre"),
          apellido: formData.get("apellido"),
          tipodocumento: formData.get("tipoDocumento"),
          numerodocumento: formData.get("numeroDocumento"),
          email: formData.get("email"),
          telefono: formData.get("telefono"),
          imagelinks: fileUrls,
        },
      ])
      .select()

    if (insertError) {
      console.error("Supabase error:", insertError);
      return NextResponse.json(
        { error: "Error al guardar en Supabase" },
        { status: 500 }
      );
    }
    console.log(insertData, "insert data");
    const userId = insertData[0].id;
    
    return NextResponse.json({
      message: "Formulario enviado con éxito",
      userId,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al subir las imágenes o guardar los datos" },
      { status: 500 }
    );
  }
}
