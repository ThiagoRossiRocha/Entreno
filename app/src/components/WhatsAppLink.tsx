import React from "react";
import { BsWhatsapp } from "react-icons/bs";

interface Props {
  phoneNumber: string;
  sizeButton?: number;
}

const WhatsAppLink: React.FC<Props> = ({ phoneNumber, sizeButton }) => {
  const handleOpenWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    window.open(url, "_blank");
  };
  return (
    <button
      title="Conversar no WhatsApp"
      onClick={handleOpenWhatsApp}
      className="buttonWhatsapp"
    >
      <BsWhatsapp size={sizeButton || 20} />
    </button>
  );
};

export default WhatsAppLink;
