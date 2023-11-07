import logoEntreno from "../images/logo-entreno.png";
import picturePadel from "../images/picture-padel.png";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiURL } from "../util/getDotEnv";


export function SetNewPassword(): JSX.Element {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !formData ||
        !formData.password ||
        !formData.passwordConfirm
      )
        return toast.error("Por favor, preencha os campos.");
      if (formData.password !== formData.passwordConfirm)
        return toast.error(
          "As senhas não coincidem. Por favor, tente novamente."
        );
      await axios.post(`${apiURL}/reset-password`, formData, {
        headers: { Authorization: token },
      });
      toast.success("senha alterada com sucesso!");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) {
          const err: any = axiosError.response?.data;
          toast.error(err.message);
        } else {
          toast.error(axiosError.message);
        }
      } else {
        toast.error("Erro!");
      }
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fechData = async () => {
      try {
        await axios.get(`${apiURL}/token-password`, {
          headers: { Authorization: token },
        });
        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            const err: any = axiosError.response?.data;
            toast.error(err.message);
          } else {
            toast.error(axiosError.message);
          }
        } else {
          toast.error("Erro!");
        }
        navigate("/");
      }
    };
    fechData();
  }, [navigate, token]);

  return (
    <div>
      {loading && <div className="loader"></div>}
      {isAuthorized && !loading && (
        <>
          <div className="boxTwoElementsLogin">
            <div className="boxLogin">
              {/* eslint-disable-next-line jsx-a11y/alt-text*/}
              <img src={logoEntreno} className="logoicon" />
              <br />
              <div className="boxData">
                <div className="boxTitle">Redefinir Senha</div>
                <br />
                <form onSubmit={handleResetPassword} className="data">
                  <label>
                    Senha:
                    <input
                      className="inputData"
                      type={"password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </label>
                  <br />
                  <label>
                    Confirmar senha:
                    <input
                      className="inputData"
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                    />
                  </label>
                  <br />
                  <br />
                  <br />
                  <button type="submit" className="buttonAccept">
                    Registrar
                  </button>
                  <br />
                  <br />
                </form>
              </div>
            </div>
            {/* eslint-disable-next-line jsx-a11y/alt-text*/}
            <img className="boxPicture" src={picturePadel}></img>
          </div>
        </>
      )}
    </div>
  );
}

export default SetNewPassword;
