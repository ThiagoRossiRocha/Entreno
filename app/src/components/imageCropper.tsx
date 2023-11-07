import axios from "axios";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { Cropper, getCroppedImg } from "react-cropper-custom";
import "react-cropper-custom/dist/index.css";
import { MdModeEdit } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { apiURL } from "../util/getDotEnv";

interface Props {
  headers: any;
  buttonDisable?: boolean;
  width?: any;
  height?: any;
  breakline?: boolean;
}

const ImageCropper: React.FC<Props> = ({
  headers,
  buttonDisable,
  width,
  height,
  breakline,
}) => {
  const [editImage, setEditImage] = useState<boolean>(false);
  const [imageIcon, setimageIcon] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBaseString, setImageBaseString] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const windowHeightInPixels = window.innerHeight;
  const heightInPixels = (height / 100) * windowHeightInPixels;
  const iconSizeVh = 3.5;
  const iconSizePx = (iconSizeVh / 100) * windowHeightInPixels;

  const onCropComplete = async (croppedArea: any) => {
    try {
      const canvasSize = {
        width: 170,
        height: 170,
      };
      const cropped = await getCroppedImg(
        selectedImage!,
        croppedArea,
        canvasSize
      );
      setCroppedImage(cropped);
    } catch (error) {
      console.error("Erro ao cortar imagem: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (loading) {
        try {
          const response = await axios.get(`${apiURL}/image-profile`, {
            responseType: "arraybuffer",
            headers,
          });
          const blob = new Blob([response.data], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setSelectedImage(url);
        } catch (error) {
          setimageIcon(true);
          setLoading(false);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [headers, loading]);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setEditImage(true);
      setImageFile(acceptedFiles[0]);
    }
  };

  const editButton = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!selectedImage) toast.error("Nenhuma imagem para editar.");
    setEditImage(true);
  };

  const imageToBase64 = (
    imageFile: File,
    callback: (base64String: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === "string") {
        const base64String = event.target.result;
        callback(base64String);
      }
    };
    reader.readAsDataURL(imageFile);
  };

  const saveCroppedImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (croppedImage) {
      const formData = new FormData();
      formData.append("croppedImage", dataURItoBlob(croppedImage));
      try {
        await axios.post(`${apiURL}/image-profile`, formData, {
          headers,
        });
        toast.success("Imagem salva com sucesso!");
        setEditImage(false);
        setLoading(true);
      } catch (error) {
        console.error("Erro ao salvar a imagem: ", error);
      }
    } else {
      imageToBase64(imageFile, async (base64String) => {
        const formData = new FormData();
        formData.append("croppedImage", dataURItoBlob(base64String));
        setImageBaseString(base64String);
        await axios.post(`${apiURL}/image-profile`, formData, {
          headers,
        });
      });
      toast.success("Imagem salva com sucesso!");
      window.location.reload();
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  return (
    <>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {!selectedImage && imageIcon && (
            <BsPersonCircle size={width || 170} />
          )}
          <div style={{ padding: "1.5vh 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedImage && editImage && (
                <div className="wrapper">
                  <Cropper
                    src={selectedImage}
                    width={heightInPixels || 170}
                    height={heightInPixels || 170}
                    onCropComplete={onCropComplete}
                  />
                </div>
              )}
            </div>
            {selectedImage && !editImage && (
              <>
                <img
                  src={selectedImage}
                  height={heightInPixels || 170}
                  width={heightInPixels || 170}
                  className="imageProfile"
                  alt="Imagem de perfil"
                />
                {breakline && <br />}
              </>
            )}
            <br />
            {buttonDisable ? null : (
              <>
                <button
                  title="Salvar"
                  className="button"
                  onClick={(e: any) => saveCroppedImage(e)}
                >
                  <IoIosSave size={iconSizePx} />
                </button>
                <button
                  title="Editar"
                  className="button"
                  onClick={(e: any) => editButton(e)}
                >
                  <MdModeEdit size={iconSizePx} />
                </button>
                <Dropzone onDrop={handleDrop} multiple={false}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="dropzone">
                      <input {...getInputProps()} />
                      <button title="Enviar" className="button">
                        <FaCloudUploadAlt size={iconSizePx} />
                      </button>
                    </div>
                  )}
                </Dropzone>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ImageCropper;
