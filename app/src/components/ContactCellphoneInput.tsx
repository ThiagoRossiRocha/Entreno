import React, { useState } from "react";

interface Props {
  className: string;
  onChange?: any;
  value?: any;
}

const ContactCellphoneInput: React.FC<Props> = ({ className, onChange, value }) => {
  const [numeroCelular, setNumeroCelular] = useState<string>("");

  const formatarCelular = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      const formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(
        2,
        7
      )}-${cleaned.substring(7, 11)}`;
      setNumeroCelular(formatted);
    } else {
      setNumeroCelular(cleaned);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formatarCelular(event.target.value);
  };

  return (
    <>
      <input
        className={className}
        placeholder="(xx) xxxxx - xxxx"
        type="text"
        name="phoneNumber"
        value={value || numeroCelular}
        onChange={onChange || handleInputChange}
      />
    </>
  );
};

export default ContactCellphoneInput;
