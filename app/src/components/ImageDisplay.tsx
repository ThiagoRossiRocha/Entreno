import React, { useEffect, useState } from 'react';
import base64js from 'base64-js';

const ImageDisplay: React.FC<{ base64Image: string }> = ({ base64Image }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base64String = base64Image;
        const decodedBytes = base64js.toByteArray(base64String);
        const blob = new Blob([new Uint8Array(decodedBytes)], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [base64Image]);

  const windowHeightInPixels = window.innerHeight;
  const heightInPixels = (20 / 100) * windowHeightInPixels;

  return (
    <div>
      {imageUrl && (
        <img
          className="imageProfile"
          // width="170"
          // height="170"
          height={heightInPixels || 200}
          width={heightInPixels || 200}
          alt="Imagem de perfil"
          src={imageUrl}
        />
      )}
    </div>
  );
};

export default ImageDisplay;

