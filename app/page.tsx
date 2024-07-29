"use client";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import InputText from "./components/InputText";
import { useRouter } from "next/navigation";
import LoadingComponent from "./components/LoadingComponent";
import { toast } from "react-toastify";
import CustomToast from "./components/CustomToast";

//types
interface FormData {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
}
type FileList = File[];

export default function FormPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    email: "",
    telefono: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es requerido.";
    if (!formData.apellido) newErrors.apellido = "El apellido es requerido.";

    if (!formData.tipoDocumento)
      newErrors.tipoDocumento = "El tipo de documento es requerido.";

    if (
      !formData.numeroDocumento ||
      formData.numeroDocumento.length < 6 ||
      isNaN(Number(formData.numeroDocumento))
    ) {
      newErrors.numeroDocumento = "Número de documento inválido.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Correo electrónico inválido.";

    const phoneRegex = /^\d{7,}$/;
    if (!formData.telefono || !phoneRegex.test(formData.telefono))
      newErrors.telefono = "Número de teléfono inválido.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    const validTypes = ["image/jpeg", "image/png", "image/tiff"];

    const validFiles = files.filter(
      (file) => validTypes.includes(file.type) && file.size <= maxSize
    );
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
      });
    }, 300);

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setIsUploading(true);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      if (isChecked) {
        setLoading(true);
        const formDataToSend = new FormData();

        selectedFiles.forEach((file) => formDataToSend.append("files", file));

        Object.entries(formData).forEach(([key, value]) =>
          formDataToSend.append(key, value)
        );

        formDataToSend.append("folderName", "user-images");

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formDataToSend,
          });

          const result = await response.json();

          if (response.ok) {
            console.log("Formulario enviado con éxito");
            console.log("ID del usuario registrado:", result.userId);
            setUserId(result.userId);
          } else {
            console.error("Error al enviar el formulario:", result.error);
          }
        } catch (error) {
          console.error("Error al enviar el formulario", error);
        }
      } else {
        toast.error('Debes Aceptar Usar los mismos datos para la facturación', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      }
    }
  };

  useEffect(() => {
    if (userId !== null) {
      setTimeout(() => {
        router.push(`/profile/${userId}`);
        setLoading(false);
      }, 3000);
    }
  }, [userId, router]);

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="min-h-screen bg-[#111317] flex items-center justify-center">
          <form
            className="w-full max-w-xl md:max-w-[695px] mx-auto my-6"
            onSubmit={handleSubmit}
          >
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
            <div className="bg-[#181A1F] px-[16px] pt-[24px] pb-[4px] rounded-lg shadow-md w-full mb-5">
              <h1 className="text-[20px] mb-6 text-[#9396A5] font-normal">
                Información personal
              </h1>
              <div className="mb-6">
                <InputText
                  value={formData.nombre}
                  type={"text"}
                  id={"nombre"}
                  placeholder={"Nombre"}
                  handleInputChange={handleInputChange}
                  error={errors.nombre}
                />
              </div>

              <div className="mb-6">
                <InputText
                  value={formData.apellido}
                  type={"text"}
                  id={"apellido"}
                  placeholder={"Apellido"}
                  handleInputChange={handleInputChange}
                  error={errors.apellido}
                />
              </div>

              <div className="mb-6 bg-[#272A33] border border-transparent rounded-[11px] h-[66px] relative pr-5">
                <label
                  className="absolute top-2 left-3 text-[#FFFFFF] text-[14px] font-normal mb-[4px]"
                  htmlFor="tipoDocumento"
                >
                  Tipo de Documento
                </label>
                <select
                  id="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleInputChange}
                  className="w-full h-full px-3 pt-6 pb-1 text-[#FFFFFF] bg-[#272A33] border-none focus:outline-none text-[18px] font-normal"
                >
                  <option value="">RUC</option>
                  <option value="dni">DNI</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="licencia">Licencia de Conducir</option>
                </select>
                {errors.tipoDocumento && (
                  <p className="text-red-500 text-sm">{errors.tipoDocumento}</p>
                )}
              </div>

              <div className="mb-6">
                <InputText
                  value={formData.numeroDocumento}
                  type={"text"}
                  id={"numeroDocumento"}
                  placeholder={"Número de documento"}
                  handleInputChange={handleInputChange}
                  error={errors.numeroDocumento}
                />
              </div>

              <div className="mb-6">
                <InputText
                  value={formData.email}
                  type={"email"}
                  id={"email"}
                  placeholder={"Correo electrónico"}
                  handleInputChange={handleInputChange}
                  error={errors.email}
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
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm">{errors.telefono}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block text-[#9396A5] text-[20px] font-normal mb-[16px]"
                  htmlFor="fileUpload"
                >
                  Carga hasta 4 imágenes para tu perfil
                </label>
                {isUploading ? (
                  <div className="w-full border-2 border-transparent rounded-[11px] flex flex-col items-start justify-center bg-[#272A33] h-[75px] overflow-hidden">
                    <div className="w-full relative h-full">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#76c7c0] rounded-[11px]"
                        style={{
                          width: `${progress}%`,
                          background:
                            "linear-gradient(90deg, #FCB115, #E96DA2, #00CDDA)",
                          transition: "width 0.3s ease-in-out",
                        }}
                      ></div>
                      {progress === 100 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            width="23"
                            height="23"
                            viewBox="0 0 23 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5 22.25C5.57 22.25 0.75 17.43 0.75 11.5C0.75 5.57 5.57 0.75 11.5 0.75C17.43 0.75 22.25 5.57 22.25 11.5C22.25 17.43 17.43 22.25 11.5 22.25ZM11.5 2.25C6.4 2.25 2.25 6.4 2.25 11.5C2.25 16.6 6.4 20.75 11.5 20.75C16.6 20.75 20.75 16.6 20.75 11.5C20.75 6.4 16.6 2.25 11.5 2.25Z"
                              fill="white"
                            />
                            <path
                              d="M10.0795 15.0801C9.8795 15.0801 9.6895 15.0001 9.5495 14.8601L6.71945 12.0301C6.42945 11.7401 6.42945 11.2601 6.71945 10.9701C7.00945 10.6801 7.48945 10.6801 7.77945 10.9701L10.0795 13.2701L15.2195 8.1301C15.5095 7.8401 15.9895 7.8401 16.2795 8.1301C16.5695 8.4201 16.5695 8.9001 16.2795 9.1901L10.6095 14.8601C10.4695 15.0001 10.2795 15.0801 10.0795 15.0801Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      ) : (
                        <p className="absolute inset-0 flex items-center justify-center text-white font-medium">
                          Cargando documento...
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full px-3 py-[16px] border-2 border-transparent rounded-[11px] flex flex-col items-start justify-center bg-[#272A33] cursor-pointer"
                    onClick={() => {
                      const fileUploadElement =
                        document.getElementById("fileUpload");
                      if (fileUploadElement) {
                        fileUploadElement.click();
                      }
                    }}
                  >
                    <div className="flex flex-row items-center">
                      <div className="mr-4">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 13C15.8667 13 15.7467 12.9733 15.6133 12.92C15.24 12.7733 15 12.4 15 12V2.66666C15 2.11999 15.4533 1.66666 16 1.66666C16.5467 1.66666 17 2.11999 17 2.66666V9.58666L17.96 8.62666C18.3467 8.23999 18.9867 8.23999 19.3733 8.62666C19.76 9.01332 19.76 9.65332 19.3733 10.04L16.7067 12.7067C16.52 12.8933 16.2667 13 16 13Z"
                            fill="white"
                          />
                          <path
                            d="M15.9993 12.9999C15.746 12.9999 15.4927 12.9066 15.2927 12.7066L12.6259 10.0399C12.2393 9.65324 12.2393 9.01325 12.6259 8.62658C13.0126 8.23991 13.6527 8.23991 14.0393 8.62658L16.706 11.2932C17.0927 11.6799 17.0927 12.3199 16.706 12.7066C16.506 12.9066 16.2527 12.9999 15.9993 12.9999Z"
                            fill="white"
                          />
                          <path
                            d="M18.3473 23.6667H13.6407C12.2406 23.6667 10.9873 22.8933 10.3606 21.64L8.80062 18.52C8.74729 18.4 8.62729 18.3333 8.50729 18.3333H2.64062C2.09396 18.3333 1.64062 17.88 1.64062 17.3333C1.64062 16.7867 2.09396 16.3333 2.64062 16.3333H8.52063C9.41396 16.3333 10.214 16.8267 10.614 17.6267L12.174 20.7467C12.454 21.32 13.0273 21.6667 13.6673 21.6667H18.374C19.014 21.6667 19.5873 21.32 19.8673 20.7467L21.4273 17.6267C21.8273 16.8267 22.6273 16.3333 23.5207 16.3333H29.334C29.8807 16.3333 30.334 16.7867 30.334 17.3333C30.334 17.88 29.8807 18.3333 29.334 18.3333H23.5207C23.3873 18.3333 23.2807 18.4 23.2273 18.52L21.6673 21.64C21.0007 22.8933 19.7473 23.6667 18.3473 23.6667Z"
                            fill="white"
                          />
                          <path
                            d="M20 30.3332H12C4.75996 30.3332 1.66663 27.2399 1.66663 19.9999V14.6665C1.66663 8.41325 3.98663 5.27991 9.18663 4.51991C9.74663 4.43991 10.24 4.81325 10.32 5.35991C10.4 5.90658 10.0266 6.41325 9.47996 6.49325C5.29329 7.10658 3.66663 9.39991 3.66663 14.6665V19.9999C3.66663 26.1465 5.85329 28.3332 12 28.3332H20C26.1466 28.3332 28.3333 26.1465 28.3333 19.9999V14.6665C28.3333 9.39991 26.7066 7.10658 22.52 6.49325C21.9733 6.41325 21.6 5.90658 21.68 5.35991C21.76 4.81325 22.2666 4.43991 22.8133 4.51991C28.0133 5.27991 30.3333 8.41325 30.3333 14.6665V19.9999C30.3333 27.2399 27.24 30.3332 20 30.3332Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[16px] font-medium text-[#FFFFFF]">
                          Haz clic o arrastra los archivos a esta área para
                          cargarlos{" "}
                          {selectedFiles.length > 0 && selectedFiles.length}
                        </p>
                        <p className="text-[14px] font-normal text-[#9396A5]">
                          JPG, PNG, Tiff, hasta 2 mb
                        </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          id="fileUpload"
                          className="hidden"
                          accept="image/jpeg, image/png, image/tiff"
                          multiple
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  {selectedFiles.length > 0 && (
                    <label
                      className="block text-[#9396A5] text-[20px] font-normal mb-[16px]"
                      htmlFor="fileUpload"
                    >
                      Imágenes cargadas
                    </label>
                  )}
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 rounded-md"
                    >
                      <p className="text-[#FFFFFF]">{file.name}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.9998 4.48666C13.9864 4.48666 13.9664 4.48666 13.9464 4.48666C10.4198 4.13333 6.89978 3.99999 3.41309 4.35333L2.05309 4.48666C1.77309 4.51333 1.52643 4.31333 1.49976 4.03333C1.47309 3.75333 1.67309 3.51333 1.94643 3.48666L3.30643 3.35333C6.85311 2.99333 10.4464 3.13333 14.0464 3.48666C14.3198 3.51333 14.5198 3.75999 14.4931 4.03333C14.4731 4.29333 14.2531 4.48666 13.9998 4.48666Z"
                            fill="white"
                          />
                          <path
                            d="M5.66718 3.81333C5.64052 3.81333 5.61385 3.81333 5.58052 3.80666C5.31385 3.75999 5.12718 3.49999 5.17385 3.23333L5.32052 2.35999C5.42718 1.71999 5.57385 0.833328 7.12716 0.833328H8.87382C10.4338 0.833328 10.5805 1.75333 10.6805 2.36666L10.8272 3.23333C10.8738 3.50666 10.6872 3.76666 10.4205 3.80666C10.1472 3.85333 9.88716 3.66666 9.84716 3.39999L9.70049 2.53333C9.60716 1.95333 9.58716 1.83999 8.88049 1.83999H7.13382C6.42718 1.83999 6.41385 1.93333 6.31385 2.52666L6.16052 3.39333C6.12052 3.64 5.90718 3.81333 5.66718 3.81333Z"
                            fill="white"
                          />
                          <path
                            d="M10.1403 15.1667H5.86028C3.53361 15.1667 3.44028 13.8801 3.36694 12.8401L2.93361 6.12671C2.91361 5.85338 3.12694 5.61338 3.40028 5.59338C3.68028 5.58005 3.91361 5.78672 3.93361 6.06005L4.36694 12.7734C4.44028 13.7867 4.46694 14.1667 5.86028 14.1667H10.1403C11.5403 14.1667 11.567 13.7867 11.6336 12.7734L12.067 6.06005C12.087 5.78672 12.327 5.58005 12.6003 5.59338C12.8736 5.61338 13.087 5.84671 13.067 6.12671L12.6336 12.8401C12.5603 13.8801 12.467 15.1667 10.1403 15.1667Z"
                            fill="white"
                          />
                          <path
                            d="M9.10673 11.5H6.88673C6.61339 11.5 6.38672 11.2733 6.38672 11C6.38672 10.7267 6.61339 10.5 6.88673 10.5H9.10673C9.38007 10.5 9.60673 10.7267 9.60673 11C9.60673 11.2733 9.38007 11.5 9.10673 11.5Z"
                            fill="white"
                          />
                          <path
                            d="M9.66665 8.83333H6.33331C6.05998 8.83333 5.83331 8.60666 5.83331 8.33333C5.83331 8.05999 6.05998 7.83333 6.33331 7.83333H9.66665C9.93998 7.83333 10.1666 8.05999 10.1666 8.33333C10.1666 8.60666 9.93998 8.83333 9.66665 8.83333Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#181A1F] px-4 py-6 rounded-lg shadow-md w-full mb-5 space-y-6">
              <h3 className="text-[#9396A5] font-normal text-lg">
                Datos de facturación
              </h3>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-black rounded-sm border-2 focus:ring-0 accent-[#FCB115]"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2 text-[#FFFFFF] text-sm font-semibold">
                  Usar los mismos datos para la facturación
                </span>
              </label>
            </div>
            <div className="mb-5">
              <button
                type="submit"
                className="w-full py-[18px] bg-[#FCB115] text-[#111317] rounded-[12px] font-bold"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
