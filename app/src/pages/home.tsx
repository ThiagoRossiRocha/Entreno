import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TextareaComponent from "../components/TextareaComponent";
import SportSelect, { sportOptions } from "../components/SportSelect";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import WhatsAppLink from "../components/WhatsAppLink";
import { IoFunnelOutline } from "react-icons/io5";
import Modal from "../components/Modal";
import useModal from "../hooks/UseModal";
import axios, { AxiosError } from "axios";
import { GrFormClose } from "react-icons/gr";
import CreatableSelect from "react-select/creatable";
import { BsFillPinFill } from "react-icons/bs";
import { categoryOptions } from "../util/data";
import { data } from "../util/estados-cidades";
import { TiTick, TiTimes } from "react-icons/ti";
import toast from "react-hot-toast";
import { apiURL } from "../util/getDotEnv";

export function Home(): JSX.Element {
  const [formData, setFormData] = useState({
    sport: "",
    category: "",
    city: "",
    state: "",
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
      profile_phoneNumber: "",
    },
  ]);
  const [formDataFavoriteMatch, setFormDataFavoriteMatch] = useState([
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
      profile_phoneNumber: "",
    },
  ]);
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCidade, setSelectedCidade] = useState<string>("");
  const [loadingFixed, setLoadingFixed] = useState<boolean>(true);
  const [filter, setFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isOpen, toggle } = useModal();
  const [modalFixedOpen, setModalFixedOpen] = useState(false);
  const openModal = () => {
    setModalFixedOpen(true);
  };
  const closeModal = () => {
    setModalFixedOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (loadingFixed) {
        const responseMatchesFavorite = await axios.get(
          `${apiURL}/matches-favorite`,
          {
            headers: { Authorization: localStorage.getItem("authToken") },
          }
        );
        setFormDataFavoriteMatch(responseMatchesFavorite.data);
        setLoadingFixed(false);
        if (!filter) {
          const responseMatchesDefault = await axios.get(
            `${apiURL}/matches-default`,
            {
              headers: { Authorization: localStorage.getItem("authToken") },
            }
          );
          setFormDataResponse(responseMatchesDefault.data);
          setLoading(false);
        }
        setLoading(false);
      }
    };

    const checkForNewData = (currentData: any[], newData: any[]) => {
      if (currentData.length !== newData.length) {
        return true;
      }
      for (let i = 0; i < currentData.length; i++) {
        if (currentData[i].id !== newData[i].id) {
          return true;
        }
      }
      return false;
    };

    const fetchDataAndNotify = async () => {
      await fetchData();
      const responseDefault = await axios.get(`${apiURL}/matches-default`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });

      if (checkForNewData(formDataResponse, responseDefault.data)) {
        toast(
          () => (
            <div style={{ textAlign: "center" }}>
              🔄 Novos dados disponíveis!
              <button
                className="custom-toast-button"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Atualizar
              </button>
            </div>
          ),
          {
            duration: 10000,
          }
        );
      }
    };
    fetchData();

    const intervalId = setInterval(fetchDataAndNotify, 30000);

    return () => clearInterval(intervalId);
  }, [
    filter,
    loadingFixed,
    setFormDataResponse,
    setFormDataFavoriteMatch,
    formDataResponse,
  ]);

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

  const handleFunnelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.get(`${apiURL}/matches-funnel`, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
        sportFilter: formData.sport,
        categoryFilter: formData.category,
        cityFilter: formData.city,
        stateFilter: formData.state,
      },
    });
    setFormDataResponse(response.data);
    toast.success("Filtragem de dados concluída.");
    setFilter(true);
    toggle();
  };

  const handleFavoriteMatch = async (
    e: React.ChangeEvent<HTMLInputElement>,
    matchId: any
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiURL}/matches-favorite`,
        { matchId: matchId },
        {
          headers: { Authorization: localStorage.getItem("authToken") },
        }
      );
      toast.success("Match fixado com sucesso!");
      setLoadingFixed(true);
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

  const handleAcceptedMatch = async (
    e: React.ChangeEvent<HTMLInputElement>,
    matchId: any
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiURL}/matches-accepted`,
        { matchId: matchId },
        {
          headers: { Authorization: localStorage.getItem("authToken") },
        }
      );
      toast.success("Match aceito com sucesso!");
      setLoadingFixed(true);
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

  const handleRefusedMatch = async (
    e: React.ChangeEvent<HTMLInputElement>,
    matchId: any
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiURL}/matches-refused`,
        { matchId: matchId },
        {
          headers: { Authorization: localStorage.getItem("authToken") },
        }
      );
      toast.success("Match recusado com sucesso!");
      setLoadingFixed(true);
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

  const deleteFavoriteMatch = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: any
  ) => {
    e.preventDefault();
    try {
      await axios.delete(`${apiURL}/matches-favorite/${id}`, {
        headers: { Authorization: localStorage.getItem("authToken") },
      });
      toast.success("Match desafixado com sucesso!");
      setLoadingFixed(true);
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

  const handleCloseModal = () => {
    setFormData({
      sport: "",
      category: "",
      city: "",
      state: "",
    });
    toggle();
  };

  const viewportHeight = window.innerHeight;
  const iconSizePx = (3 / 100) * viewportHeight;

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
      <Modal isOpen={isOpen} toggle={toggle} className={"modal-filter"}>
        <div style={{ textAlign: "right" }}>
          <button
            title="Fechar"
            onClick={handleCloseModal}
            className="buttonClose"
          >
            <GrFormClose size={iconSizePx} />
          </button>
        </div>
        <form onSubmit={handleFunnelSubmit}>
          <div className="dataFilter">
            <label>
              Esporte:
              {/* <CreatableSelect
                className="select"
                placeholder="Selecione..."
                styles={customStyles}
                value={sportOptions?.find(
                  (option: any) => option.value === formData.sport
                )}
                onChange={(selected: any) => {
                  setFormData({
                    ...formData,
                    sport: selected.value,
                  });
                }}
                options={sportOptions}
              /> */}
              <select
                className="styledSelectHome"
                value={formData.sport}
                onChange={(e) => {
                  setFormData({
                    ...formData,
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
            <label>
              Categoria:
              {/* <CreatableSelect
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
              /> */}
              <select
                className="styledSelectHome"
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
              Estado:
              <select
                className="styledSelectHome"
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
            <label>
              Cidade:
              <select
                className="styledSelectHome"
                name="city"
                value={formData.city}
                onChange={handleCidadeChange}
                disabled={!(formData.state || selectedEstado)}
              >
                <option value="">Selecione...</option>
                {(formData.state || selectedEstado) &&
                  data
                    .find(
                      (item) => item.nome === (formData.state || selectedEstado)
                    )
                    ?.cidades.map((cidade, index) => (
                      <option key={index} value={cidade}>
                        {cidade}
                      </option>
                    ))}
              </select>
              <br /> <br />
            </label>
            <button className="buttonAccept">Filtrar</button>
          </div>
        </form>
      </Modal>
      <div className="titlePrincipal">HOME</div>
      <div className="titleFixed">
        {!modalFixedOpen && (
          <div className="container">
            <div className="divCentralizada">
              <label>Fixados</label>
            </div>
            <div className="divDireita">
              <button
                onClick={openModal}
                title="Abrir"
                className="buttonCloseFixed"
              >
                <MdKeyboardArrowDown size={iconSizePx} />
              </button>
            </div>
          </div>
        )}
        {modalFixedOpen && (
          <div className="container">
            <div className="divCentralizada">
              <label>Fixados</label>
            </div>
            <div className="divDireita">
              <button
                title="Fechar"
                onClick={closeModal}
                className="buttonCloseFixed"
              >
                <MdKeyboardArrowUp size={iconSizePx} />
              </button>
            </div>
          </div>
        )}
      </div>
      {modalFixedOpen && (
        <div className="modal">
          <form className="data">
            {formDataFavoriteMatch.map((obj, index) => (
              <>
                {loadingFixed ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    <div className="boxFiveElementsHomeFixed">
                      <div className="boxMatches">
                        <div className="boxDataHome">
                          <div className="boxTitleMatches">Esporte</div>
                          <br />
                          <div
                            style={{
                              background: "white",
                              borderRadius: "1.5vh",
                              display: "grid",
                              placeItems: "center",
                              height: "18.3vh",
                            }}
                          >
                            {
                              sportOptions?.find((op) => op.value === obj.sport)
                                ?.icon
                            }
                          </div>
                          {/* <SportSelect
                            styles={customStyles}
                            value={sportOptions?.find(
                              (option: any) => option.value === obj.sport
                            )}
                            onChange={(e: any) => handleData(e, index)}
                            disabled={true}
                          /> */}
                        </div>
                      </div>
                      <div className="boxMatches">
                        <div className="boxData">
                          <div className="boxTitleMatches">Descrição</div>
                          <br />
                          <TextareaComponent
                            name="description"
                            style={{
                              height: "17.2vh",
                              width: "100%",
                              resize: "none",
                              padding: "0.25vh",
                            }}
                            value={obj.description}
                            onChange={(e: any) => handleData(e, index)}
                            readonly={true}
                          />
                        </div>
                      </div>
                      <div className="boxMatches">
                        <div className="boxData">
                          <div className="boxTitleMatches">Local</div>
                          <div className="data">
                            <label>
                              Estado
                              <br />
                              <input
                                className="styledSelectHome"
                                type="text"
                                name="state"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.state}
                                readOnly={true}
                              />
                            </label>
                            <br />
                            <label>
                              Cidade
                              <br />
                              <input
                                className="styledSelectHome"
                                type="text"
                                name="city"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.city}
                                readOnly={true}
                              />
                            </label>
                            <label>
                              Clube
                              <br />
                              <input
                                className="styledSelectHome"
                                type="text"
                                name="city"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.club}
                                readOnly={true}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="boxMatches">
                        <div className="boxData">
                          <div className="boxTitleMatches">Data</div>
                          <div className="data">
                            <label>
                              Data
                              <br />
                              <input
                                className="styledSelectHome"
                                type="text"
                                name="date"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.date}
                                readOnly={true}
                              />
                            </label>
                            <br />
                            <label>
                              Início
                              <br />
                              <input
                                className="styledSelectHome"
                                type="text"
                                name="startHour"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.startHour}
                                readOnly={true}
                              />
                            </label>
                            <label>
                              Fim
                              <br />
                              <input
                                className="styledSelectHome"
                                type="text"
                                name="endHour"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.endHour}
                                readOnly={true}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div
                        className="boxMatches"
                        style={{ padding: "4vh 0.5vh" }}
                      >
                        <div style={{ margin: "1vh 0" }}>
                          <WhatsAppLink
                            phoneNumber={obj.profile_phoneNumber}
                            sizeButton={(2.5 / 100) * viewportHeight}
                          />
                        </div>
                        <div style={{ margin: "1vh 0" }}>
                          <button
                            title="Desafixar"
                            className="buttonReject"
                            onClick={(e: any) => deleteFavoriteMatch(e, obj.id)}
                          >
                            <BsFillPinFill
                              size={(2.5 / 100) * viewportHeight}
                            />
                          </button>
                        </div>
                        <div style={{ margin: "1vh 0" }}>
                          <button
                            onClick={(e: any) => {
                              if (obj.id !== null) {
                                handleAcceptedMatch(e, obj.id);
                              }
                            }}
                            title="Aceitar"
                            className="buttonAccept"
                          >
                            <TiTick size={iconSizePx} />
                          </button>
                        </div>
                        <div style={{ margin: "1vh 0" }}>
                          <button
                            className="buttonReject"
                            title="Recusar"
                            onClick={(e: any) => {
                              if (obj.id !== null) {
                                handleRefusedMatch(e, obj.id);
                              }
                            }}
                          >
                            <TiTimes size={iconSizePx} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
          </form>
        </div>
      )}

      <div className="alignCenterBox">
        <button onClick={toggle} className="buttonFilter">
          <IoFunnelOutline />
        </button>
      </div>
      <form className="data">
        {formDataResponse.map((obj, index) => (
          <>
            {loading ? (
              <div className="loader"></div>
            ) : (
              <>
                <div className="boxFiveElementsHome">
                  <div className="boxMatches">
                    <div className="boxDataHome">
                      <div className="boxTitleMatches">Esporte</div>
                      <br />
                      <div
                        style={{
                          background: "white",
                          borderRadius: "1.5vh",
                          display: "grid",
                          placeItems: "center",
                          height: "18.3vh",
                        }}
                      >
                        {
                          sportOptions?.find((op) => op.value === obj.sport)
                            ?.icon
                        }
                      </div>
                      {/* <SportSelect
                        styles={customStyles}
                        value={sportOptions?.find(
                          (option: any) => option.value === obj.sport
                        )}
                        onChange={(e: any) => handleData(e, index)}
                        disabled={true}
                      /> */}
                    </div>
                  </div>
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Descrição</div>
                      <br />
                      <TextareaComponent
                        name="description"
                        style={{
                          height: "17.2vh",
                          width: "100%",
                          resize: "none",
                          padding: "0.25vh",
                        }}
                        value={obj.description}
                        onChange={(e: any) => handleData(e, index)}
                        readonly={true}
                      />
                    </div>
                  </div>
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Local</div>
                      <div className="data">
                        <label>
                          Estado
                          <br />
                          <input
                            className="styledSelectHome"
                            type="text"
                            name="state"
                            onChange={(e: any) => handleData(e, index)}
                            value={obj.state}
                            readOnly={true}
                          />
                        </label>
                        <br />
                        <label>
                          Cidade
                          <br />
                          <input
                            className="styledSelectHome"
                            type="text"
                            name="city"
                            onChange={(e: any) => handleData(e, index)}
                            value={obj.city}
                            readOnly={true}
                          />
                        </label>
                        <label>
                          Clube
                          <br />
                          <input
                            className="styledSelectHome"
                            type="text"
                            name="city"
                            onChange={(e: any) => handleData(e, index)}
                            value={obj.club}
                            readOnly={true}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Data</div>
                      <div className="data">
                        <label>
                          Data
                          <br />
                          <input
                            className="styledSelectHome"
                            type="text"
                            name="date"
                            onChange={(e: any) => handleData(e, index)}
                            value={obj.date}
                            readOnly={true}
                          />
                        </label>
                        <br />
                        <label>
                          Início
                          <br />
                          <input
                            className="styledSelectHome"
                            type="text"
                            name="startHour"
                            onChange={(e: any) => handleData(e, index)}
                            value={obj.startHour}
                            readOnly={true}
                          />
                        </label>
                        <label>
                          Fim
                          <br />
                          <input
                            className="styledSelectHome"
                            type="text"
                            name="endHour"
                            onChange={(e: any) => handleData(e, index)}
                            value={obj.endHour}
                            readOnly={true}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="boxMatches" style={{ padding: "4vh 0.5vh" }}>
                    <div style={{ margin: "1vh 0" }}>
                      <WhatsAppLink
                        phoneNumber={obj.profile_phoneNumber}
                        sizeButton={(2.5 / 100) * viewportHeight}
                      />
                    </div>
                    <div style={{ margin: "1vh 0" }}>
                      <button
                        title="Fixar"
                        className="buttonStyleEdit"
                        onClick={(e: any) => handleFavoriteMatch(e, obj.id)}
                      >
                        <BsFillPinFill size={(2.5 / 100) * viewportHeight} />
                      </button>
                    </div>
                    <div style={{ margin: "1vh 0" }}>
                      <button
                        onClick={(e: any) => {
                          if (obj.id !== null) {
                            handleAcceptedMatch(e, obj.id);
                          }
                        }}
                        title="Aceitar"
                        className="buttonAccept"
                      >
                        <TiTick size={iconSizePx} />
                      </button>
                    </div>
                    <div style={{ margin: "1vh 0" }}>
                      <button
                        className="buttonReject"
                        title="Recusar"
                        onClick={(e: any) => {
                          if (obj.id !== null) {
                            handleRefusedMatch(e, obj.id);
                          }
                        }}
                      >
                        <TiTimes size={iconSizePx} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div style={{ padding: "0.5vh" }}></div>
          </>
        ))}
      </form>
    </>
  );
}
