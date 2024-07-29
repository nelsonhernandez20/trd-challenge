// components/CustomToast.tsx
import React from "react";

// Define el tipo para las props
interface CustomToastProps {
  icon?: React.ReactNode; // icon es opcional
  message: string;
}

// Usa la interfaz en el componente
const CustomToast: React.FC<CustomToastProps> = ({ icon, message }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "8px",
      borderRadius: "4px",
      backgroundColor: "#27AE60", // Color de fondo verde
      color: "#FFFFFF", // Color del texto blanco
      fontSize: "16px",
      maxWidth: "300px",
      fontWeight: "normal",
      border: "none", // Asegúrate de que no haya borde
      boxShadow: "none", // Asegúrate de que no haya sombra
    }}
  >
    {icon && (
      <span
        style={{
          marginRight: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </span>
    )}
    <span>{message}</span>
  </div>
);

export default CustomToast;
