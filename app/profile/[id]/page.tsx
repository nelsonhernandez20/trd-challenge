// app/profile/[id]/page.tsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Importa useParams para obtener los parámetros de la URL
import InputText from "@component/app/components/InputText";
import Image from "next/image";

const Profile = () => {
  const { id } = useParams(); // Obtén el ID desde la URL
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/users/${id}`);

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          console.log(data, "data");
          setUserData(data);
        } catch (error: any) {
          setError(error.message || "Error al obtener datos del usuario");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id]);

  if (!id) return <p>ID no disponible</p>;
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-[#111317] flex-row items-center">
      <div>
        {/* personal information */}
        <div className="bg-[#181A1F] px-[16px] pt-[24px] pb-[4px] rounded-lg shadow-md mb-5 w-full max-w-xl md:max-w-[620px] mx-auto my-6">
          <h1 className="text-[20px] mb-6 text-[#9396A5] font-normal">
            Información personal
          </h1>
          <div className="mb-6">
            <InputText
              value={userData.nombre}
              type={"text"}
              id={"nombre"}
              placeholder={"Nombre"}
              editable={false}
            />
          </div>

          <div className="mb-6">
            <InputText
              value={userData.apellido}
              type={"text"}
              id={"apellido"}
              placeholder={"Apellido"}
              editable={false}
            />
          </div>

          <div className="mb-6 bg-[#272A33] border border-transparent rounded-[11px] h-[66px] relative pr-5">
            <InputText
              value={userData.tipodocumento}
              type={"text"}
              id={"tipodocumento"}
              placeholder={"Tipo de Documento"}
              editable={false}
            />
          </div>

          <div className="mb-6">
            <InputText
              value={userData.numerodocumento}
              type={"text"}
              id={"numerodocumento"}
              placeholder={"Número de documento"}
              editable={false}
            />
          </div>

          <div className="mb-6">
            <InputText
              value={userData.email}
              type={"email"}
              id={"email"}
              placeholder={"Correo electrónico"}
              editable={false}
            />
          </div>
          <div className="flex flex-row mb-6">
            <div className="bg-[#272A33] border border-transparent rounded-[11px] h-[56px] w-[54px] flex items-center justify-center">
              <Image
                src="/images/ecuador.png"
                objectFit="cover"
                className="rounded-[11px]"
                alt="image"
                width={34}
                height={24}
              />
            </div>
            <div className="bg-[#272A33] border border-transparent rounded-[11px] h-[56px] flex-1 ml-4 relative">
              <label
                className="absolute top-2 left-3 text-[#FFFFFF] text-[14px] font-normal mb-[4px]"
                htmlFor="telefono"
              >
                Número de Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                className="w-full h-full px-3 pt-6 pb-1 text-[#9396A5] bg-transparent border-none focus:outline-none text-[16px] font-normal"
                placeholder="Número de teléfono"
                value={userData.telefono}
                readOnly={false}
              />
            </div>
          </div>
        </div>
        {/* Billing information */}
        <div className="bg-[#181A1F] px-[16px] pt-[24px] pb-[4px] rounded-lg shadow-md mb-5 w-full max-w-xl md:max-w-[620px] mx-auto my-6">
          <h1 className="text-[20px] mb-6 text-[#9396A5] font-normal">
            Datos de facturación
          </h1>
          <div className="mb-6">
            <InputText
              value={userData.nombre}
              type={"text"}
              id={"nombre"}
              placeholder={"Nombre"}
              editable={false}
            />
          </div>

          <div className="mb-6">
            <InputText
              value={userData.apellido}
              type={"text"}
              id={"apellido"}
              placeholder={"Apellido"}
              editable={false}
            />
          </div>

          <div className="mb-6 bg-[#272A33] border border-transparent rounded-[11px] h-[66px] relative pr-5">
            <InputText
              value={userData.tipodocumento}
              type={"text"}
              id={"tipodocumento"}
              placeholder={"Tipo de Documento"}
              editable={false}
            />
          </div>

          <div className="mb-6">
            <InputText
              value={userData.numerodocumento}
              type={"text"}
              id={"numerodocumento"}
              placeholder={"Número de documento"}
              editable={false}
            />
          </div>

          <div className="mb-6">
            <InputText
              value={userData.email}
              type={"email"}
              id={"email"}
              placeholder={"Correo electrónico"}
              editable={false}
            />
          </div>
          <div className="flex flex-row mb-6">
            <div className="bg-[#272A33] border border-transparent rounded-[11px] h-[56px] w-[54px] flex items-center justify-center">
              <Image
                src="/images/ecuador.png"
                objectFit="cover"
                className="rounded-[11px]"
                alt="image"
                width={34}
                height={24}
              />
            </div>
            <div className="bg-[#272A33] border border-transparent rounded-[11px] h-[56px] flex-1 ml-4 relative">
              <label
                className="absolute top-2 left-3 text-[#FFFFFF] text-[14px] font-normal mb-[4px]"
                htmlFor="telefono"
              >
                Número de Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                className="w-full h-full px-3 pt-6 pb-1 text-[#9396A5] bg-transparent border-none focus:outline-none text-[16px] font-normal"
                placeholder="Número de teléfono"
                value={userData.telefono}
                readOnly={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
