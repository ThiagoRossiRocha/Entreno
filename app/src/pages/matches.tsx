import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SportSelect, { sportOptions } from "../components/SportSelect";
import CreatableSelect from "react-select/creatable";
import {
  categoryOptions,
  positionOptions,
  vacanciesOptions,
} from "../util/data";
import TextareaComponent from "../components/TextareaComponent";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { data } from "../util/estados-cidades";
import "react-time-picker/dist/TimePicker.css";
import { isDatePassed } from "../util/isDatePassed";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Modal from "../components/Modal";
import useModal from "../hooks/UseModal";
import { GrFormClose } from "react-icons/gr";
import { stringToDate } from "../util/stringToDate";
import { parseTimeStringToDate } from "../util/parseTimeStringToDate";
import { apiURL } from "../util/getDotEnv";

registerLocale("pt-br", ptBR);

export function Matches(): JSX.Element {
  const [formData, setFormData] = useState({
    id: "",
    sport: "",
    category: "",
    position: "",
    vacancies: "",
    description: "",
    city: "",
    state: "",
    club: "",
    block: "",
    date: "",
    startHour: "",
    endHour: "",
  });
  const [formDataResponse, setFormDataResponse] = useState([
    {
      id: "",
      sport: "",
      category: "",
      position: "",
      vacancies: "",
      description: "",
      city: "",
      state: "",
      club: "",
      block: "",
      date: "",
      startHour: "",
      endHour: "",
      editMatch: true,
    },
  ]);
  const [formDataEdit, setFormDataEdit] = useState({
    id: "",
    sport: "",
    category: "",
    position: "",
    vacancies: "",
    description: "",
    city: "",
    state: "",
    club: "",
    block: "",
    date: "",
    startHour: "",
    endHour: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startHour, setStartHour] = useState<Date | null>(null);
  const [endHour, setEndHour] = useState<Date | null>(null);
  const [selectedDateEdit, setSelectedDateEdit] = useState<Date | null>(null);
  const [startHourEdit, setStartHourEdit] = useState<Date | null>(null);
  const [endHourEdit, setEndHourEdit] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCidade, setSelectedCidade] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedEstadoEdit, setSelectedEstadoEdit] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCidadeEdit, setSelectedCidadeEdit] = useState<string>("");
  const { isOpen, toggle } = useModal();

  const handleStartHourChange = (timeValue: Date | null) => {
    setStartHour(timeValue);
    const dateString: any = timeValue?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormData({
      ...formData,
      startHour: dateString,
    });
  };
  const handleEndHourChange = (timeValue: Date | null) => {
    setEndHour(timeValue);
    const dateString: any = timeValue?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormData({
      ...formData,
      endHour: dateString,
    });
  };

  const handleStartHourChangeEdit = (timeValue: Date | null) => {
    setStartHourEdit(timeValue);
    const dateString: any = timeValue?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormDataEdit({
      ...formDataEdit,
      startHour: dateString,
    });
  };
  const handleEndHourChangeEdit = (timeValue: Date | null) => {
    setEndHourEdit(timeValue);
    const dateString: any = timeValue?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormDataEdit({
      ...formDataEdit,
      endHour: dateString,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const dateString: any = date?.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setFormData({
      ...formData,
      date: dateString,
    });
  };

  const handleDateChangeEdit = (date: Date | null) => {
    setSelectedDateEdit(date);
    const dateString: any = date?.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setFormDataEdit({
      ...formDataEdit,
      date: dateString,
    });
  };
  const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEstado(event.target.value);
    setFormData({
      ...formData,
      state: event.target.value,
    });
    setSelectedCidade("");
  };

  const handleEstadoChangeEdit = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEstadoEdit(event.target.value);
    setFormDataEdit({
      ...formDataEdit,
      state: event.target.value,
    });
    setSelectedCidadeEdit("");
  };

  const handleCidadeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCidade(event.target.value);
    setFormData({
      ...formData,
      city: event.target.value,
    });
  };

  const handleCidadeChangeEdit = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCidadeEdit(event.target.value);
    setFormDataEdit({
      ...formDataEdit,
      city: event.target.value,
    });
  };

  const handleData = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setFormDataResponse((data) => {
      const newData = [...data];
      newData[index] = {
        ...newData[index],
        [name]: value,
      };
      return newData;
    });
  };

  const handleInputChangeEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormDataEdit({
      ...formDataEdit,
      [name]: value,
    });
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    Authorization: localStorage.getItem("authToken"),
  };

  useEffect(() => {
    const fechData = async () => {
      if (loading) {
        const response = await axios.get(`${apiURL}/matches`, {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        });
        setLoading(false);
        formDataResponse.map((item) => ({
          ...item,
          editMatch: response.data.editMatches,
        }));
        setFormDataResponse(response.data);
      }
    };
    fechData();
  }, [formDataResponse, loading]);

  const handleEditMatch = (
    e: React.ChangeEvent<HTMLInputElement>,
    matchId: any
  ) => {
    e.preventDefault();
    const editedMatch: any = formDataResponse.find((match) => match.id === matchId);
    if (editedMatch) {
      if (editedMatch.editMatches === true) {
        setFormDataEdit(editedMatch);
        setSelectedDateEdit(stringToDate(editedMatch.date));
        setStartHourEdit(parseTimeStringToDate(editedMatch.startHour));
        setEndHourEdit(parseTimeStringToDate(editedMatch.endHour));
      } else {
        return toast.error(
          "Não é possível editar a partida porque já existem jogadores inscritos nela."
        );
      }
    }
    toggle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !formData ||
        !formData.sport ||
        !formData.category ||
        !formData.position ||
        !formData.vacancies ||
        !formData.description ||
        !formData.state ||
        !formData.city ||
        !formData.club ||
        !formData.block ||
        !formData.date ||
        !formData.startHour ||
        !formData.endHour
      )
        return toast.error("Por favor, preencha todos os campos.");
      await axios.post(`${apiURL}/matches`, formData, { headers });
      toast.success("Dados salvos com sucesso!");
      window.location.reload();
      setLoading(true);
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
        toast.error("Erro ao registrar dados!");
      }
    }
  };

  const handleMatchEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !formDataEdit ||
        !formDataEdit.sport ||
        !formDataEdit.category ||
        !formDataEdit.position ||
        !formDataEdit.vacancies ||
        !formDataEdit.description ||
        !formDataEdit.state ||
        !formDataEdit.city ||
        !formDataEdit.club ||
        !formDataEdit.block ||
        !formDataEdit.date ||
        !formDataEdit.startHour ||
        !formDataEdit.endHour
      )
        return toast.error("Por favor, preencha todos os campos.");
      await axios.post(`${apiURL}/matches-update`, formDataEdit, {
        headers,
      });
      toast.success("Dados salvos com sucesso!");
      setLoading(true);
      toggle();
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
        toast.error("Erro ao registrar dados!");
      }
    }
  };

  const handleCloseModal = () => {
    setFormDataEdit({
      id: "",
      sport: "",
      category: "",
      position: "",
      vacancies: "",
      description: "",
      city: "",
      state: "",
      club: "",
      block: "",
      date: "",
      startHour: "",
      endHour: "",
    });
    toggle();
  };

  const deleteMatch = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: any
  ) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let cancelDelete = false;
    toast(
      () => (
        <div style={{ textAlign: "center" }}>
          🗑️ Tem certeza que deseja excluir?
          <div style={{ display: "flex", justifyContent: "center", padding: "1vh 0" }}>
            <button
              className="custom-toast-button-accept"
              onClick={async () => {
                try {
                  await axios.delete(`${apiURL}/matches/${id}`, {
                    headers: {
                      Authorization: localStorage.getItem("authToken"),
                    },
                  });
                  toast.dismiss();
                  toast.success("Item excluído com sucesso!");
                  setLoading(true);
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
              }}
            >
              Excluir
            </button>
            <button
              className="custom-toast-button-reject"
              onClick={() => {
                cancelDelete = true;
                toast.dismiss();
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "1.5vh",
    }),
  };

  const viewportHeight = window.innerHeight;
  const iconSizePx = (3 / 100) * viewportHeight;

  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <Modal isOpen={isOpen} toggle={toggle} className={"modalMatchesEdit"}>
        <div style={{ textAlign: "right" }}>
          <button
            title="Fechar"
            onClick={handleCloseModal}
            className="buttonClose"
          >
            <GrFormClose size={iconSizePx} />
          </button>
        </div>
        <form onSubmit={handleMatchEditSubmit}>
          <div className="dataFilterEdit">
            <div style={{ paddingLeft: "7.6vh" }}>
              <div className="boxFourElementsMatchesEdit">
                <div style={{ margin: "1.5vh" }}>
                  <div className="boxDataMatchesEdit">
                    <div className="boxTilteMatchesEdit">Esporte</div>
                    <label
                      style={{
                        fontSize: "2.5vh",
                        fontWeight: "bold",
                        textAlign: "start",
                      }}
                    >
                      Esporte:
                      <br />
                      <select
                        className="styledSelect"
                        style={{ width: "99.5%", height: "3.5vh" }}
                        value={formDataEdit.sport}
                        onChange={(e) => {
                          setFormDataEdit({
                            ...formDataEdit,
                            sport: e.target.value,
                          });
                        }}
                      >
                        <option value="">Selecione...</option>
                        {sportOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label
                      style={{
                        fontSize: "2.5vh",
                        fontWeight: "bold",
                        textAlign: "start",
                      }}
                    >
                      Categoria:
                      <br />
                      <select
                        className="styledSelect"
                        style={{ width: "100%", height: "3.5vh" }}
                        value={formDataEdit.category}
                        onChange={(e) => {
                          setFormDataEdit({
                            ...formDataEdit,
                            category: e.target.value,
                          });
                        }}
                      >
                        <option value="">Selecione...</option>
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label
                      style={{
                        fontSize: "2.5vh",
                        fontWeight: "bold",
                        textAlign: "start",
                      }}
                    >
                      Posição:
                      <br />
                      <select
                        className="styledSelect"
                        style={{ width: "100%", height: "3.5vh" }}
                        value={formDataEdit.position}
                        onChange={(e) => {
                          setFormDataEdit({
                            ...formDataEdit,
                            position: e.target.value,
                          });
                        }}
                      >
                        <option value="">Selecione...</option>
                        {positionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label
                      style={{
                        fontSize: "2.5vh",
                        fontWeight: "bold",
                        textAlign: "start",
                      }}
                    >
                      Vagas:
                      <br />
                      <select
                        className="styledSelect"
                        style={{ width: "100%", height: "3.5vh" }}
                        value={formDataEdit.vacancies}
                        onChange={(e) => {
                          setFormDataEdit({
                            ...formDataEdit,
                            vacancies: e.target.value,
                          });
                        }}
                      >
                        <option value="">Selecione...</option>
                        {vacanciesOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                <div style={{ margin: "1.5vh" }}>
                  <div className="boxDataMatchesEdit">
                    <div className="boxTilteMatchesEdit">Descrição</div>
                    <form style={{ padding: "2.5vh 0" }} className="data">
                      <TextareaComponent
                        style={{
                          width: "98.5%",
                          height: "23.6vh",
                          resize: "none",
                          padding: "0.25vh",
                        }}
                        classname="inputDataConfrontation"
                        name="description"
                        value={formDataEdit.description}
                        onChange={handleInputChangeEdit}
                      />
                    </form>
                  </div>
                </div>
                <div style={{ margin: "1.5vh" }}>
                  <div className="boxDataMatchesEdit">
                    <div className="boxTilteMatchesEdit">Local</div>
                    <div className="styledLabelMatchesEdit">
                      <label>
                        Estado:
                        <select
                          className="styledSelect"
                          name="state"
                          style={{ width: "99.5%", height: "3.5vh" }}
                          value={formDataEdit.state}
                          onChange={handleEstadoChangeEdit}
                        >
                          <option value="">Selecione...</option>
                          {data.map((item, index) => (
                            <option key={index} value={item.nome}>
                              {item.nome}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Cidade:
                        <br />
                        <select
                          className="styledSelect"
                          name="city"
                          style={{ width: "99.5%", height: "3.5vh" }}
                          value={formDataEdit.city}
                          onChange={handleCidadeChangeEdit}
                          disabled={!(formDataEdit.state || selectedEstado)}
                        >
                          <option value="">Selecione...</option>
                          {(formDataEdit.state || selectedEstado) &&
                            data
                              .find(
                                (item) =>
                                  item.nome ===
                                  (formDataEdit.state || selectedEstado)
                              )
                              ?.cidades.map((cidade, index) => (
                                <option key={index} value={cidade}>
                                  {cidade}
                                </option>
                              ))}
                        </select>
                      </label>
                      <label>
                        Clube:
                        <input
                          className="styledSelect"
                          style={{ width: "98.5%", height: "3.5vh" }}
                          type="text"
                          name="club"
                          onChange={handleInputChangeEdit}
                          value={formDataEdit.club}
                        />
                      </label>
                      <label>
                        Quadra:
                        <input
                          className="styledSelect"
                          style={{ width: "98.5%", height: "3.5vh" }}
                          type="text"
                          name="block"
                          onChange={handleInputChangeEdit}
                          value={formDataEdit.block}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div style={{ margin: "1.5vh" }}>
                  <div
                    className="boxDataMatchesEdit"
                    style={{ width: "19.5vh" }}
                  >
                    <div className="boxTilteMatchesEdit">Data</div>
                    <div
                      style={{
                        width: "98.5%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="styledLabelMatchesEdit">
                        <br />
                        <label>
                          Data:
                          <br />
                          <DatePicker
                            className="styledSelect"
                            locale="pt-br"
                            dateFormat="dd/MM/yyyy"
                            name="date"
                            onChange={handleDateChangeEdit}
                            selected={selectedDateEdit}
                          />
                        </label>

                        <br />
                        <label>
                          Início:
                          <div>
                            <DatePicker
                              className="styledSelect"
                              selected={startHourEdit}
                              onChange={handleStartHourChangeEdit}
                              name="startHour"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              dateFormat="h:mm aa"
                              timeCaption="Início"
                            />
                          </div>
                        </label>
                        <label>
                          Término:
                          <div>
                            <DatePicker
                              className="styledSelect"
                              selected={endHourEdit}
                              onChange={handleEndHourChangeEdit}
                              name="endHour"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              dateFormat="h:mm aa"
                              timeCaption="Fim"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: "0 9.3vh" }}>
              <button className="buttonAccept">Salvar</button>
            </div>
          </div>
        </form>
      </Modal>
      <div className="titlePrincipal">MATCHES</div>
      <div style={{ padding: "0.2vh" }}></div>
      <form onSubmit={handleSubmit} className="data">
        <div className="boxFourElementsMatches">
          <div className="boxMatches">
            <div className="boxData">
              <div className="boxTitleMatches">Esporte</div>
              <div
                style={{
                  width: "98.5%",
                  height: "28vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="boxTwoElements">
                  <div className="boxSportSelectOne">
                    <div className="styledLabel">
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
                  </div>
                  <div className="boxSportSelectTwo">
                    <form className="data">
                      <label>
                        Categoria:
                        <br />
                        {/* <CreatableSelect
                          styles={customSelectStyles}
                          className="select"
                          placeholder="Selecione..."
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
                        /> */}
                        <select
                          className="styledSelect"
                          value={formData.category}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            });
                          }}
                        >
                          <option value="">Selecione...</option>
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Posição:
                        {/* <CreatableSelect
                          styles={customSelectStyles}
                          className="select"
                          placeholder="Selecione..."
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
                        /> */}
                        <select
                          className="styledSelect"
                          value={formData.position}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              position: e.target.value,
                            });
                          }}
                        >
                          <option value="">Selecione...</option>
                          {positionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Vagas:
                        {/* <CreatableSelect
                          styles={customSelectStyles}
                          className="select"
                          placeholder="Selecione..."
                          value={vacanciesOptions?.find(
                            (option: any) => option.value === formData.vacancies
                          )}
                          onChange={(selected: any) => {
                            setFormData({
                              ...formData,
                              vacancies: selected.value,
                            });
                          }}
                          options={vacanciesOptions}
                        /> */}
                        <select
                          className="styledSelect"
                          value={formData.vacancies}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              vacancies: e.target.value,
                            });
                          }}
                        >
                          <option value="">Selecione...</option>
                          {vacanciesOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="boxMatches">
            <div className="boxDataMatches">
              <div className="boxTitleMatches">Descrição</div>
              <form className="data">
                <br />
                <TextareaComponent
                  style={{
                    width: "98.5%",
                    height: "21.6vh",
                    resize: "none",
                    padding: "0.25vh",
                  }}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </div>
          <div className="boxMatches">
            <div className="boxData">
              <div className="boxTitleMatches">Local</div>
              <div className="styledLabel">
                <label>
                  Estado:
                  <br />
                  <select
                    className="styledSelect"
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
                    className="styledSelect"
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
                  Clube:
                  <input
                    style={{ width: "98.5%", height: "3.5vh" }}
                    className="styledSelect"
                    type="text"
                    name="club"
                    onChange={handleInputChange}
                    value={formData.club}
                  />
                </label>
                <label>
                  Quadra:
                  <input
                    style={{ width: "98.5%", height: "3.5vh" }}
                    className="styledSelect"
                    type="text"
                    name="block"
                    onChange={handleInputChange}
                    value={formData.block}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="boxMatches">
            <div className="boxDataMatches">
              <div className="boxTitleMatches">Data</div>
              <div
                style={{
                  width: "98.5%",
                  height: "28vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="styledLabel">
                  <label>
                    Data:
                    <DatePicker
                      className="styledSelect"
                      locale="pt-br"
                      dateFormat="dd/MM/yyyy"
                      name="date"
                      onChange={handleDateChange}
                      selected={selectedDate}
                    />
                  </label>
                  <label>
                    Início:
                    <div>
                      <DatePicker
                        className="styledSelect"
                        selected={startHour}
                        onChange={handleStartHourChange}
                        name="startHour"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        dateFormat="h:mm aa"
                        timeCaption="Início"
                      />
                    </div>
                  </label>
                  <label>
                    Término:
                    <div>
                      <DatePicker
                        className="styledSelect"
                        selected={endHour}
                        onChange={handleEndHourChange}
                        name="endHour"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        dateFormat="h:mm aa"
                        timeCaption="Fim"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonBox">
          <button type="submit" className="buttonAccept">
            Registrar
          </button>
        </div>
      </form>
      <div className="titleSecond">Histórico</div>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <form className="data">
          {formDataResponse.map((obj, index) => (
            <>
              <div className="boxFiveElementsMatches">
                <div className="boxMatches">
                  <div className="boxData">
                    <div className="boxTitleMatches">Esporte</div>
                    <div
                      style={{
                        width: "98.5%",
                        height: "28vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="boxTwoElements">
                        <div className="boxSportSelectOne">
                          <div className="styledLabel">
                            <label>
                              Esporte:
                              {/* <SportSelect
                                styles={customStyles}
                                value={sportOptions?.find(
                                  (option: any) => option.value === obj.sport
                                )}
                                onChange={(e: any) => handleData(e, index)}
                                disabled={true}
                              /> */}
                              <div
                                style={{
                                  background: "white",
                                  borderRadius: "1.5vh",
                                  display: "grid",
                                  placeItems: "center",
                                  height: "17vh",
                                }}
                              >
                                {
                                  sportOptions?.find(
                                    (op) => op.value === obj.sport
                                  )?.icon
                                }
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="boxSportSelectTwo">
                          <form className="data">
                            <label>
                              Categoria:
                              {/* <CreatableSelect
                                styles={customSelectStyles}
                                className="select"
                                placeholder="Selecione..."
                                value={categoryOptions?.find(
                                  (option: any) => option.value === obj.category
                                )}
                                onChange={(e: any) => handleData(e, index)}
                                isDisabled={true}
                              /> */}
                              <input
                                style={{ width: "100%", height: "3.5vh" }}
                                className="styledSelect"
                                type="text"
                                name="category"
                                value={obj.category}
                              />
                            </label>
                            <label>
                              Posição:
                              {/* <CreatableSelect
                                styles={customSelectStyles}
                                className="select"
                                placeholder="Selecione..."
                                value={positionOptions?.find(
                                  (option: any) => option.value === obj.position
                                )}
                                onChange={(e: any) => handleData(e, index)}
                                isDisabled={true}
                              /> */}
                              <input
                                style={{ width: "100%", height: "3.5vh" }}
                                className="styledSelect"
                                type="text"
                                name="position"
                                value={obj.position}
                              />
                            </label>
                            <label>
                              Vagas:
                              {/* <CreatableSelect
                                styles={customSelectStyles}
                                className="select"
                                placeholder="Selecione..."
                                value={vacanciesOptions?.find(
                                  (option: any) =>
                                    option.value === obj.vacancies
                                )}
                                onChange={(e: any) => handleData(e, index)}
                                isDisabled={true}
                              /> */}
                              <input
                                style={{ width: "100%", height: "3.5vh" }}
                                className="styledSelect"
                                type="text"
                                name="vacancies"
                                value={obj.vacancies}
                              />
                            </label>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="boxMatches">
                  <div className="boxDataMatches">
                    <div className="boxTitleMatches">Descrição</div>
                    <form className="data">
                      <br />
                      <TextareaComponent
                        style={{
                          width: "98.5%",
                          height: "21.8vh",
                          resize: "none",
                          padding: "0.25vh",
                        }}
                        name="description"
                        value={obj.description}
                        onChange={(e: any) => handleData(e, index)}
                        readonly={true}
                      />
                    </form>
                  </div>
                </div>
                <div className="boxMatches">
                  <div className="boxDataMatches">
                    <div className="boxTitleMatches">Local</div>
                    <div className="styledLabel">
                      <label>
                        Estado:
                        <br />
                        <input
                          style={{ width: "97.5%", height: "3.5vh" }}
                          className="styledSelect"
                          type="text"
                          name="state"
                          onChange={(e: any) => handleData(e, index)}
                          value={obj.state}
                          readOnly={true}
                        />
                      </label>
                      <br />
                      <label>
                        Cidade:
                        <br />
                        <input
                          style={{ width: "97.5%", height: "3.5vh" }}
                          className="styledSelect"
                          type="text"
                          name="city"
                          onChange={(e: any) => handleData(e, index)}
                          value={obj.city}
                          readOnly={true}
                        />
                      </label>
                      <label>
                        Clube:
                        <input
                          style={{ width: "97.5%", height: "3.5vh" }}
                          className="styledSelect"
                          type="text"
                          name="club"
                          onChange={(e: any) => handleData(e, index)}
                          value={obj.club}
                          readOnly={true}
                        />
                      </label>
                      <label>
                        Quadra:
                        <input
                          style={{ width: "97.5%", height: "3.5vh" }}
                          className="styledSelect"
                          type="text"
                          name="block"
                          onChange={(e: any) => handleData(e, index)}
                          value={obj.block}
                          readOnly={true}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="boxMatches">
                  <div className="boxDataMatches">
                    <div className="boxTitleMatches">Data</div>
                    <div
                      style={{
                        width: "98.5%",
                        height: "28.4vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="styledLabel">
                        <label>
                          Data:
                          <input
                            style={{ width: "98.5%", height: "3.5vh" }}
                            type="text"
                            className={`styledSelect ${
                              isDatePassed(obj.date, obj.startHour)
                                ? "redText"
                                : ""
                            }`}
                            value={obj.date}
                            onChange={(e: any) => handleData(e, index)}
                            readOnly={true}
                          />
                        </label>
                        <label>
                          Início:
                          <input
                            style={{ width: "98.5%", height: "3.5vh" }}
                            type="text"
                            className="styledSelect"
                            value={obj.startHour}
                            onChange={(e: any) => handleData(e, index)}
                            readOnly={true}
                          />
                        </label>
                        <label>
                          Término:
                          <input
                            style={{ width: "98.5%", height: "3.5vh" }}
                            type="text"
                            className="styledSelect"
                            value={obj.endHour}
                            onChange={(e: any) => handleData(e, index)}
                            readOnly={true}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "14vh 0.5vh" }} className="boxMatches">
                  <div style={{ margin: "1vh 0" }}>
                    <button
                      title="Editar"
                      className="buttonStyleEdit"
                      onClick={(e: any) => handleEditMatch(e, obj.id)}
                    >
                      <MdModeEdit size={iconSizePx} />
                    </button>
                  </div>
                  <div style={{ margin: "1vh 0" }}>
                    <button
                      title="Apagar"
                      className="buttonReject"
                      onClick={(e: any) => deleteMatch(e, obj.id)}
                    >
                      <MdDelete size={iconSizePx} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ padding: "0.2vh" }}></div>
            </>
          ))}
        </form>
      )}
    </>
  );
}
