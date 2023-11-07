import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreatableSelect from "react-select/creatable";
import { categoryOptions, positionOptions } from "../util/data";
import SportSelect, { sportOptions } from "../components/SportSelect";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { data } from "../util/estados-cidades";
import ImageCropper from "../components/imageCropper";
import { apiURL } from "../util/getDotEnv";

export function Profile(): JSX.Element {
  const [formData, setFormData] = useState({
    sport: "",
    category: "",
    position: "",
    fullName: "",
    email: "",
    cpf: "",
    city: "",
    state: "",
    phoneNumber: "",
  });
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCidade, setSelectedCidade] = useState<string>("");

  const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEstado(event.target.value);
    setFormData({
      ...formData,
      state: event.target.value,
    });
    setSelectedCidade("");
  };

  const handleCidadeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCidade(event.target.value);
    setFormData({
      ...formData,
      city: event.target.value,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    Authorization: localStorage.getItem("authToken"),
  };

  useEffect(() => {
    const fechData = async () => {
      const response = await axios.get(`${apiURL}/profile`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
      setFormData(response.data);
    };
    fechData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiURL}/profile`, formData, {
        headers,
      });
      toast.success("Dados salvos com sucesso!");
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
        toast.error("Erro ao registrar usuário!");
      }
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "1.5vh",
    }),
  };

  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="titlePrincipal">PERFIL</div>
      <div style={{ padding: "0.5vh" }}></div>
      <form onSubmit={handleSubmit} style={{ height: "auto", width: "auto" }}>
        <div className="boxTreeElementsProfile">
          <div className="boxProfile">
            <div
              className="boxData"
              onClick={(event) => event.preventDefault()}
            >
              <div className="boxTitleProfile">Perfil</div>
              <div
                style={{
                  width: "100%",
                  padding: "8vh 0",
                }}
              >
                <ImageCropper
                  breakline={true}
                  height={21}
                  width={21}
                  headers={headers}
                />
              </div>
            </div>
          </div>
          <div className="boxProfile">
            <div className="boxData">
              <div className="boxTitleProfile">Informações</div>
              <div
                style={{
                  width: "100%",
                  padding: `6vh 0`,
                }}
              >
                <div className="data">
                  <label>
                    Nome completo:
                    <input
                      className="inputData"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
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
                    CPF:
                    <input
                      className="inputData"
                      type="text"
                      name="cpf"
                      onChange={handleInputChange}
                      maxLength={11}
                      value={formData.cpf}
                    />
                  </label>
                  <label>
                    Estado:
                    <br />
                    <select
                      className="inputData"
                      name="state"
                      value={formData.state}
                      onChange={handleEstadoChange}
                    >
                      <option value="">Selecione...</option>
                      {data.map((item, index) => (
                        <option key={index} value={item.nome}>
                          {item.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <br />
                  <label>
                    Cidade:
                    <br />
                    <select
                      className="inputData"
                      name="city"
                      value={formData.city}
                      onChange={handleCidadeChange}
                      disabled={!(formData.state || selectedEstado)}
                    >
                      <option value="">Selecione...</option>
                      {(formData.state || selectedEstado) &&
                        data
                          .find(
                            (item) =>
                              item.nome === (formData.state || selectedEstado)
                          )
                          ?.cidades.map((cidade, index) => (
                            <option key={index} value={cidade}>
                              {cidade}
                            </option>
                          ))}
                    </select>
                  </label>
                  <label>
                    WhatsApp:
                    <input
                      className="inputData"
                      type="text"
                      name="phoneNumber"
                      onChange={handleInputChange}
                      maxLength={11}
                      value={formData.phoneNumber}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="boxProfile">
            <div className="boxData">
              <div className="boxTitleProfile">Esporte</div>
              <div
                style={{
                  width: "100%",
                  padding: "5vh 0",
                }}
              >
                <div className="styledLabel">
                  <div className="select-container">
                    <label>
                      Esporte:
                      <SportSelect
                        styles={customStyles}
                        onChange={(selected: any) => {
                          setFormData({
                            ...formData,
                            sport: selected.value,
                          });
                        }}
                        value={sportOptions?.find(
                          (option: any) => option.value === formData.sport
                        )}
                      />
                    </label>
                  </div>
                  <form>
                    <div className="select-container">
                      <label>
                        Categoria:
                        <CreatableSelect
                          className="select"
                          placeholder="Selecione..."
                          styles={customStyles}
                          value={categoryOptions?.find(
                            (option: any) => option.value === formData.category
                          )}
                          onChange={(selected: any) => {
                            setFormData({
                              ...formData,
                              category: selected.value,
                            });
                          }}
                          options={categoryOptions}
                        />
                      </label>
                    </div>
                    <div className="select-container">
                      <label>
                        Posição:
                        <CreatableSelect
                          className="select"
                          placeholder="Selecione..."
                          styles={customStyles}
                          value={positionOptions?.find(
                            (option: any) => option.value === formData.position
                          )}
                          onChange={(selected: any) => {
                            setFormData({
                              ...formData,
                              position: selected.value,
                            });
                          }}
                          options={positionOptions}
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonBox">
          <button type="submit" className="buttonAccept">
            Confirmar
          </button>
        </div>
      </form>
    </>
  );
}
