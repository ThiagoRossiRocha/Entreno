import React, { useContext, useState } from "react";
import logoEntreno from "../images/logo-entreno.png";
import picturePadel from "../images/picture-padel.png";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../hooks/AuthContext";
import Modal from "../components/Modal";
import useModal from "../hooks/UseModal";
import { GrFormClose } from "react-icons/gr";
import { apiURL } from "../util/getDotEnv";

export function Login(): JSX.Element {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const { isOpen, toggle } = useModal();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formDataForgotPassword, setFormDataForgotPassword] = useState({
    email: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterChange = () => {
    navigate("/register");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (
        !formData ||
        !formData.email ||
        !formData.password
      )
        return toast.error("Por favor, preencha todos os campos."
      );
      if (!emailRegex.test(formData.email)) return toast.error("Email inválido. Por favor, insira um email válido.");

      const response = await axios.post(
        `${apiURL}/login`,
        formData
      );
      toast.success("Login bem-sucedido");
      auth.signin(response.data.token, () => {
        localStorage.setItem("authToken", response.data.token);
        navigate(from, { replace: true });
        navigate("/home");
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          const err: any = axiosError.response?.data;
          toast.error(err.message);
        } else {
          toast.error(
            "Credenciais de login inválidas. Por favor, tente novamente."
          );
        }
      } else {
        toast.error(
          "Credenciais de login inválidas. Por favor, tente novamente."
        );
      }
    }
  };

  const handleSubmitForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (
        !formDataForgotPassword ||
        !formDataForgotPassword.email
      )
        return toast.error("Por favor, preencha todos os campos.");
      if (!emailRegex.test(formDataForgotPassword.email))
        return toast.error(
          "Email inválido. Por favor, insira um email válido."
        );
      const response = await axios.post(
        `${apiURL}/forgot-email`,
        formDataForgotPassword
      );
      toast.success(response.data.message);
      toggle();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) {
          const err: any = axiosError.response?.data;
          toast.error(err.message);
        } else {
          toast.error(
            "Credenciais inválidas. Por favor, tente novamente."
          );
        }
      } else {
        toast.error(
          "Credenciais inválidas. Por favor, tente novamente."
        );
      }
    }
  };

  const handleForgotPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataForgotPassword({
      ...formData,
      [name]: value,
    });
  };

  const handleCloseModal = () => {
    setFormDataForgotPassword({
      email: ""
    });
    toggle();
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={"modalMatchesEdit"}>
        <div style={{ textAlign: "right" }}>
          <button
            title="Fechar"
            onClick={handleCloseModal}
            className="buttonClose"
          >
            <GrFormClose size={25} />
          </button>
        </div>
        <form onSubmit={handleSubmitForgotPassword}>
          <div className="boxData">
            <a className="styledLabel">
              Insira seu email para recuperar a conta.
            </a>
            <br />
            <br />
            <div>
              <label className="styledLabel">Email:</label>
            </div>
            <input
              className="inputData"
              type="text"
              name="email"
              value={formDataForgotPassword.email}
              onChange={handleForgotPassword}
            />
            <br /> <br />
            <button className="buttonAccept">Enviar</button>
          </div>
        </form>
      </Modal>
        <div className="boxTwoElementsLogin">
          <div className="boxLogin">
            <br />
            <img src={logoEntreno} className="logoicon" />
            <br />
            <br />
            <br />
            <div className="boxData">
              <div className="boxTitle">Login</div>
              <form onSubmit={handleSubmit} className="data">
                <br />
                <label>
                  Email:
                  <input
                    className="inputData"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <label>
                  Senha:
                  <input
                    className="inputData"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <br />
                <button title="Entrar" className="buttonAccept">
                  Entrar
                </button>
                <br />
                <br />
                <button onClick={handleRegisterChange} className="button">
                  Criar nova conta
                </button>
                <br />
                <p onClick={toggle} className="paragraph">
                  Esqueceu a senha?
                </p>
              </form>
            </div>
          </div>
          <div>
            <img className="boxPicture" src={picturePadel}></img>
          </div>
        </div>
    </>
  );
}
