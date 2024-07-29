// app/api/users/[id]/route.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Exporta la función para manejar el método GET
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single(); // Usamos single() para obtener un solo registro

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Error al obtener datos del usuario' }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error del servidor' }),
      { status: 500 }
    );
  }
}

// Maneja otros métodos HTTP si es necesario
export async function POST(req: Request) {
  // Lógica para manejar POST
  return new Response('Método POST no implementado', { status: 405 });
}

// Si es necesario manejar otros métodos HTTP, añade más funciones aquí
