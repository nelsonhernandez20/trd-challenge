import React from "react";

export default function InputText({
  id,
  type = "text",
  placeholder,
  value,
  handleInputChange = () => {},
  editable = true, // Por defecto, el input es editable
}) {
  return (
    <div className="bg-[#272A33] border border-transparent rounded-[11px] h-[66px] relative">
      <label
        className="absolute top-2 left-3 text-[#FFFFFF] text-[14px] font-normal mb-[4px]"
        htmlFor={id}
      >
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        className="w-full h-full px-3 pt-6 pb-1 text-[#9396A5] bg-transparent border-none focus:outline-none text-[16px] font-normal"
        placeholder={placeholder}
        value={value}
        onChange={editable ? handleInputChange : undefined} // Solo asigna handleInputChange si editable es true
        readOnly={!editable} // Hace que el input sea de solo lectura si editable es false
      />
    </div>
  );
}
