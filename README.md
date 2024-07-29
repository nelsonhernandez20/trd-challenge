# Documentación del Proyecto

¡Hola! Bienvenido a la documentación de mi proyecto. Aquí te explico cómo está estructurado y qué funcionalidades he implementado. Este documento te ayudará a entender cada aspecto del proyecto y cómo he cumplido con los requisitos establecidos.


## Diseño Responsivo

Me aseguré de que la landing page sea completamente responsiva y se adapte a diferentes tamaños de pantalla, lo que incluye:

- **Móvil**: El diseño se ajusta perfectamente a pantallas pequeñas.
- **Tablet**: La interfaz está optimizada para pantallas medianas.
- **Escritorio**: La experiencia de usuario está adaptada para pantallas grandes.

Esto garantiza que todos los usuarios, sin importar el dispositivo que utilicen, disfruten de una experiencia de navegación fluida y agradable.

## API

He implementado una API robusta utilizando Next.js con App Router, conectada a una base de datos a través de Supabase. Esto permite:

- **Almacenamiento de Datos de Perfil**: Los datos del perfil se gestionan eficientemente mediante esta API.
- **Interacción con la Base de Datos**: Supabase maneja el almacenamiento y la recuperación de datos de manera eficaz.

## Navegación por ID de Perfil

La pantalla de perfil utiliza el ID del perfil en la URL para recuperar y mostrar los datos correspondientes. Esto permite:

- **Navegación Directa**: Cada perfil tiene una URL única que incluye su ID.
- **Obtención de Datos**: Llamo al endpoint específico para obtener la información del perfil según el ID en la URL.

Por ejemplo, la URL para acceder a un perfil podría ser `/perfil/[id]`, donde `[id]` se reemplaza con el identificador real del perfil.

## Temperatura Actual

Para ofrecer una experiencia personalizada, solicito al usuario su ubicación actual y utilizo el API de Open-Meteo para obtener la temperatura del lugar donde se encuentra. El proceso es el siguiente:

1. **Solicitud de Ubicación**: Pido al usuario permiso para acceder a su ubicación.
2. **Consulta del API**: Utilizo la ubicación para consultar Open-Meteo y obtener la temperatura.
3. **Visualización**: Muestro la temperatura actual en la interfaz de usuario.

Esto proporciona información relevante y útil a los usuarios.

## Pantalla de Carga

La pantalla de carga mejora la experiencia del usuario durante la espera. He implementado:

- **Animación de Carga**: Una animación atractiva que mantiene la atención del usuario.
- **Tiempo de Visualización**: La pantalla de carga permanece visible durante al menos 3 segundos adicionales a la duración de la operación del API, garantizando una transición suave.

## Almacenamiento de Imágenes

Para el manejo de imágenes, las almaceno en Amazon S3. Esto permite:

- **Almacenamiento Escalable**: Las imágenes se almacenan de manera segura y escalable.
- **Acceso y Gestión**: Se configuran las políticas adecuadas para el acceso y la gestión de imágenes en S3.

## Configuración del Proyecto

Para iniciar el proyecto, es necesario configurar las claves de acceso para Supabase y AWS. Aquí están los pasos para configurar tu entorno local:

1. **Supabase**:
   - Crea un archivo `.env.local` en la raíz del proyecto.
   - Agrega las siguientes variables con tus claves de Supabase:
     ```env
     SUPABASE_URL=tu_url_de_supabase
     SUPABASE_ANON_KEY=tu_clave_anonima
     ```

2. **AWS S3**:
   - Crea un archivo `.env.local` en la raíz del proyecto (si no lo has hecho ya).
   - Agrega las siguientes variables con tus credenciales de AWS:
     ```env
     AWS_ACCESS_KEY_ID=tu_id_de_clave_de_acceso
     AWS_SECRET_ACCESS_KEY=tu_clave_de_acceso_secreta
     AWS_REGION=tu_region_de_aws
     AWS_S3_BUCKET=tu_nombre_de_bucket
     ```

---

Si tienes alguna pregunta o necesitas más detalles, no dudes en contactarme directamente. ¡Estoy aquí para ayudarte!

