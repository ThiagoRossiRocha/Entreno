import React, { useContext, useState } from "react";
import logoEntreno from "../images/logo-entreno.png";
import picturePadel from "../images/picture-padel.png";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../hooks/AuthContext";
import { apiURL } from "../util/getDotEnv";


export function Register(): JSX.Element {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    passwordConfirm:'',
    createdAt:'',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const currentDate = new Date();
    setFormData({
      ...formData,
      [name]: value,
      createdAt: currentDate.toLocaleString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (
        !formData ||
        !formData.email ||
        !formData.password ||
        !formData.passwordConfirm ||
        !formData.userName
      ) return toast.error(
        "Por favor, preencha todos os campos obrigatórios."
      );
      if (formData.password !== formData.passwordConfirm) return toast.error(
        "As senhas não coincidem. Por favor, tente novamente."
      );
      if (!emailRegex.test(formData.email)) return toast.error(
        "Email inválido. Por favor, insira um email válido."
      )
      await axios.post(`${apiURL}/register`, formData);
      toast.success("Usuário registrado com sucesso!");
      const response = await axios.post(`${apiURL}/login`, formData);
      auth.signin(response.data.token, () => {
        navigate(from, { replace: true });
        navigate("/home");
        localStorage.setItem("authToken", response.data.token);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) {
          const err: any = axiosError.response?.data;
          toast.error(err.message);
        }
        else {
          toast.error(axiosError.message);
        }
      } else {
        toast.error("Erro ao registrar usuário!");
      }
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      userName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      createdAt: "",
    });
    navigate("/")
  };

  return (
    <>
      <div className="boxTwoElementsLogin">
        <div className="boxLogin">
          <img src={logoEntreno} className="logoicon" />
          <br />
          <div className="boxData">
            <div className="boxTitle">Cadastro</div>
            <form
              onSubmit={handleSubmit}
              onReset={handleReset}
              className="data"
            >
              <label>
                Nome de usuário:
                <input
                  className="inputData"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
              </label>
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
              <button type="submit" className="buttonAccept">
                Registrar
              </button>
              <br />
              <br />
              <button type="reset" className="buttonReject">
                Descartar
              </button>
              <br />
            </form>
          </div>
        </div>
        <img className="boxPicture" src={picturePadel}></img>
      </div>
    </>
  );
}
