// app/profile/[id]/page.tsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Importa useParams para obtener los parámetros de la URL
import InputText from "@component/app/components/InputText";
import Image from "next/image";
import Carousel from "@component/app/components/Carousel";
import LoadingComponent from "@component/app/components/LoadingComponent";

const Profile = () => {
  const { id } = useParams(); // Obtén el ID desde la URL
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchTemperature = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
              );
              const data = await response.json();
              setTemperature(data.current_weather.temperature.toFixed(1)); // Redondea la temperatura a un decimal
            } catch (error) {
              console.error("Error fetching temperature:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchTemperature();
  }, []);

  if (!id) return <p>ID no disponible</p>;
  if (loading) return <LoadingComponent title={'Obteniendo datos del usuario'} />;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-[#111317]">
      <div className="mb-[71px] mt-[50px] flex justify-center">
        <svg
          width="78"
          height="24"
          viewBox="0 0 78 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.352 4.27819H14.6119V24H9.74011V4.27819H0V0H24.352V4.27819Z"
            fill="white"
          />
          <path
            d="M38.5773 15.3884H32.5531V24H27.6193V0H39.5986C42.6763 0.025342 45.0144 0.695734 46.613 2.01121C48.2116 3.32669 49.0098 5.22045 49.0075 7.69245C49.0443 9.24184 48.5888 10.7629 47.7068 12.0363C46.7257 13.3217 45.3708 14.2707 43.8287 14.7525L49.5389 24H43.8287L38.5773 15.3884ZM32.5531 11.359H39.847C41.1374 11.3382 42.1484 10.9719 42.8764 10.2669C43.2323 9.93884 43.5164 9.5403 43.7106 9.09655C43.9048 8.6528 44.0049 8.1735 44.0046 7.68899C43.9805 6.48985 43.6044 5.57063 42.8764 4.92441C42.1484 4.27819 41.1512 4.00517 39.847 4.00517H32.5531V11.359Z"
            fill="white"
          />
          <path
            d="M64.9856 0C68.9535 0.0437725 72.0426 1.13809 74.2531 3.28294C76.4635 5.42779 77.5791 8.3329 77.5998 11.9983C77.5745 15.6475 76.4589 18.5423 74.2531 20.6825C72.0472 22.8228 68.9581 23.9286 64.9856 24H53.6377V0H64.9856ZM64.9856 19.9775C66.8808 20.0492 68.7362 19.4208 70.199 18.2117C71.7286 17.0137 72.5279 14.9402 72.5969 11.9914C72.5256 9.05168 71.7263 6.97825 70.199 5.77105C68.7362 4.56195 66.8808 3.93349 64.9856 4.00517H58.5716V19.9603L64.9856 19.9775Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="flex flex-row justify-around md:justify-between mb-[32px] mx-[10px] md:mx-[80px]">
        <div>
          <h2 className="text-[#CCCCCC] font-semibold md:text-[27px] text-[15px]">
            Hola {userData.nombre} {userData.apellido}
          </h2>
        </div>
        <div className="flex flex-row space-x-2">
          <h2 className="text-[#CCCCCC] font-normal text-[27px]">
            {temperature ? `${temperature}°` : "Cargando temperatura..."}
          </h2>
          <Image
            src="/images/climate.gif"
            objectFit="cover"
            className="rounded-[11px]"
            alt="image"
            width={46}
            height={46}
          />
        </div>
      </div>
      <div className="flex mx-[10px] md:mx-[80px] pb-[171px]">
        <div className="flex-shrink-0">
          <Carousel images={userData.imagelinks} width="509px" height="536px" />
        </div>
        <div className="flex-1 flex flex-col gap-6 md:pl-[40px] max-w-[620px] md:max-w-[620px] sm:max-w-[620px] mx-auto">
          {/* personal information */}
          <div className="bg-[#181A1F] px-[16px] pt-[24px] pb-[4px] rounded-lg shadow-md mb-5 w-full">
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
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6">
              <InputText
                value={userData.apellido}
                type={"text"}
                id={"apellido"}
                placeholder={"Apellido"}
                editable={false}
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6 bg-[#272A33] border border-transparent rounded-[11px] h-[66px] relative pr-5">
              <InputText
                value={userData.tipodocumento}
                type={"text"}
                id={"tipodocumento"}
                placeholder={"Tipo de Documento"}
                editable={false}
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6">
              <InputText
                value={userData.numerodocumento}
                type={"text"}
                id={"numerodocumento"}
                placeholder={"Número de documento"}
                editable={false}
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6">
              <InputText
                value={userData.email}
                type={"email"}
                id={"email"}
                placeholder={"Correo electrónico"}
                editable={false}
                handleInputChange={() => {}}
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
                  placeholder="+593 989 878 109"
                  value={userData.telefono}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* other information */}
          <div className="bg-[#181A1F] px-[16px] pt-[24px] pb-[4px] rounded-lg shadow-md mb-5 w-full">
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
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6">
              <InputText
                value={userData.apellido}
                type={"text"}
                id={"apellido"}
                placeholder={"Apellido"}
                editable={false}
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6 bg-[#272A33] border border-transparent rounded-[11px] h-[66px] relative pr-5">
              <InputText
                value={userData.tipodocumento}
                type={"text"}
                id={"tipodocumento"}
                placeholder={"Tipo de Documento"}
                editable={false}
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6">
              <InputText
                value={userData.numerodocumento}
                type={"text"}
                id={"numerodocumento"}
                placeholder={"Número de documento"}
                editable={false}
                handleInputChange={() => {}}
              />
            </div>

            <div className="mb-6">
              <InputText
                value={userData.email}
                type={"email"}
                id={"email"}
                placeholder={"Correo electrónico"}
                editable={false}
                handleInputChange={() => {}}
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
                  placeholder="+593 989 878 109"
                  value={userData.telefono}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
