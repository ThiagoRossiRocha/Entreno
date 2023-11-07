import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TextareaComponent from "../components/TextareaComponent";
import SportSelect, { sportOptions } from "../components/SportSelect";
import axios, { AxiosError } from "axios";
import ImageDisplay from "../components/ImageDisplay";
import { BsPersonCircle } from "react-icons/bs";
import { data } from "../util/estados-cidades";
import { isDatePassed } from "../util/isDatePassed";
import WhatsAppLink from "../components/WhatsAppLink";
import { MdOutlineExitToApp } from "react-icons/md";
import toast from "react-hot-toast";
import { apiURL } from "../util/getDotEnv";


export function Confrontations(): JSX.Element {
  const [formDataResponse, setFormDataResponse] = useState([
    {
      block: "",
      category: "",
      city: "",
      club: "",
      date: "",
      description: "",
      endHour: "",
      match_id: "",
      userIdToken: "",
      player1: {
        image: "",
        category: "",
        city: "",
        cpf: "",
        fullName: "",
        phoneNumber: "",
        position: "",
        sport: "",
        state: "",
        user_id: "",
      },
      player2: {
        image: "",
        category: "",
        city: "",
        cpf: "",
        fullName: "",
        phoneNumber: "",
        position: "",
        sport: "",
        state: "",
        user_id: "",
      },
      player3: {
        image: "",
        category: "",
        city: "",
        cpf: "",
        fullName: "",
        phoneNumber: "",
        position: "",
        sport: "",
        state: "",
        user_id: "",
      },
      player4: {
        image: "",
        category: "",
        city: "",
        cpf: "",
        fullName: "",
        phoneNumber: "",
        position: "",
        sport: "",
        state: "",
        user_id: "",
      },
      sport: "",
      startHour: "",
      state: "",
      user_id_owner: "",
      vacancies: "",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    Authorization: localStorage.getItem("authToken"),
  };

  const isPlayer = (userId: any, userIdToken: any) => {
    if (userId === userIdToken) return true;
    else return false;
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

  const handleExitUser = async (
    e: React.ChangeEvent<HTMLInputElement>,
    matchId: any
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiURL}/matches-exit`,
        { matchId: matchId },
        {
          headers,
        }
      );
      toast.success("Saida da partida!");
      setLoading(true)
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

  useEffect(() => {
    const fechData = async () => {
      if (loading) {
        const response = await axios.get(
          `${apiURL}/matches-accepted`,
          {
            headers: { Authorization: localStorage.getItem("authToken") },
          }
        );
        setFormDataResponse(response.data);
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
      await fechData();
      const responseDefault = await axios.get(
        `${apiURL}/matches-accepted`,
        {
          headers: { Authorization: localStorage.getItem("authToken") },
        }
      );

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
    fechData();
    const intervalId = setInterval(fetchDataAndNotify, 30000);

    return () => clearInterval(intervalId);
  }, [formDataResponse, loading, setFormDataResponse]);

  const viewportHeight = window.innerHeight;
  const iconSizePx = (3 / 100) * viewportHeight;

  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="titlePrincipal">CONFRONTOS</div>
      <div style={{ padding: "0.2vh" }}></div>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <form className="data">
          {formDataResponse.map((obj, index) => (
            <>
              <div className="boxConfrontation">
                <br />
                <div className="boxTitleConfrontation">Match</div>
                <div className="boxFourElementsConfrontationMatch">
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Esporte</div>
                      <br />
                      {/* <SportSelect
                      classname="selectSport"
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
                          height: "16.2vh",
                        }}
                      >
                        {
                          sportOptions?.find((op) => op.value === obj.sport)
                            ?.icon
                        }
                      </div>
                    </div>
                  </div>
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Descrição</div>
                      <br />
                      <TextareaComponent
                        style={{
                          width: "98.5%",
                          height: "15.2vh",
                          resize: "none",
                          padding: "0.25vh",
                        }}
                        classname="inputDataConfrontation"
                        name="description"
                        value={obj.description}
                        onChange={(e: any) => handleData(e, index)}
                        readonly={true}
                      />
                    </div>
                  </div>
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Local</div>
                      <div
                        style={{
                          width: "100%",
                          height: "19.7vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="data">
                          <div className="boxTwoElementsCityState">
                            <label>
                              Cidade
                              <br />
                              <input
                                className="styledSelectConfrontation"
                                type="text"
                                name="city"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.city}
                                readOnly={true}
                              />
                            </label>
                            <label>
                              Estado
                              <br />
                              <input
                                className="styledSelectConfrontation"
                                type="text"
                                name="state"
                                onChange={(e: any) => handleData(e, index)}
                                value={
                                  data?.find(
                                    (option: any) => option.nome === obj.state
                                  )?.sigla
                                }
                                readOnly={true}
                              />
                            </label>
                          </div>
                          <div className="boxTwoElementsCityState">
                            <label>
                              Clube
                              <br />
                              <input
                                className="styledSelectConfrontation"
                                type="text"
                                name="club"
                                onChange={(e: any) => handleData(e, index)}
                                value={obj.club}
                                readOnly={true}
                              />
                            </label>
                            <label>
                              Quadra
                              <br />
                              <input
                                className="styledSelectConfrontation"
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
                    </div>
                  </div>
                  <div className="boxMatches">
                    <div className="boxData">
                      <div className="boxTitleMatches">Data</div>
                      <div
                        style={{
                          width: "100%",
                          height: "19.7vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="data">
                          <label>
                            Data
                            <br />
                            <input
                              style={{ width: "97.5%" }}
                              className={`styledSelect ${
                                isDatePassed(obj.date, obj.startHour)
                                  ? "redText"
                                  : ""
                              }`}
                              type="text"
                              name="date"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.date}
                              readOnly={true}
                            />
                          </label>
                          <br />
                          <div className="boxTwoElementsConfrontation">
                            <div style={{ marginRight: "0.25vh" }}>
                              <label>
                                Início
                                <br />
                                <input
                                  className="styledSelectConfrontation"
                                  type="text"
                                  onChange={(e: any) => handleData(e, index)}
                                  value={obj.startHour}
                                  readOnly={true}
                                />
                              </label>
                            </div>
                            <div style={{ marginRight: "0.25vh" }}>
                              <label>
                                Fim
                                <br />
                                <input
                                  className="styledSelectConfrontation"
                                  type="text"
                                  onChange={(e: any) => handleData(e, index)}
                                  value={obj.endHour}
                                  readOnly={true}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="boxFourElementsConfrontation">
                  <div className="boxMatches">
                    {obj.player1 && (
                      <div
                        className={`boxData ${
                          isPlayer(obj.player1.user_id, obj.userIdToken)
                            ? "BoxDataUser"
                            : ""
                        }`}
                      >
                        <div
                          className={`boxTitleMatches ${
                            isPlayer(obj.player1.user_id, obj.userIdToken)
                              ? "boxTitleMatchesUser"
                              : ""
                          }`}
                        >
                          Jogador 1
                        </div>
                        <div className="data">
                          <div style={{ textAlign: "center" }}>
                            {!obj.player1.image && (
                              <BsPersonCircle size={170} />
                            )}
                            <ImageDisplay base64Image={obj.player1.image} />
                          </div>
                          <label>
                            Nome
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player1.fullName}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Estado
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player1.state}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Cidade
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player1.city}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Categoria
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player1.category}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Posição de Jogo
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player1.position}
                              readOnly={true}
                            />
                          </label>
                          {isPlayer(obj.player1.user_id, obj.userIdToken) ? (
                            <div
                              style={{
                                margin: "1.8vh 0",
                                textAlign: "center",
                                fontSize: "3vh",
                              }}
                            >
                              Responsável
                            </div>
                          ) : (
                            <div style={{ margin: "1vh 0" }}>
                              <WhatsAppLink
                                sizeButton={iconSizePx}
                                phoneNumber={obj.player1.phoneNumber}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="boxMatches">
                    {obj.player2 && (
                      <div
                        className={`boxData ${
                          isPlayer(obj.player2.user_id, obj.userIdToken)
                            ? "BoxDataUser"
                            : ""
                        }`}
                      >
                        <div
                          className={`boxTitleMatches ${
                            isPlayer(obj.player2.user_id, obj.userIdToken)
                              ? "boxTitleMatchesUser"
                              : ""
                          }`}
                        >
                          Jogador 2
                        </div>
                        <div className="data">
                          <div style={{ textAlign: "center" }}>
                            {!obj.player2.image && (
                              <BsPersonCircle size={170} />
                            )}
                            <ImageDisplay base64Image={obj.player2.image} />
                          </div>
                          <label>
                            Nome
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player2.fullName}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Estado
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player2.state}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Cidade
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player2.city}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Categoria
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player2.category}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Posição de Jogo
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player2.position}
                              readOnly={true}
                            />
                          </label>
                          {isPlayer(obj.player2.user_id, obj.userIdToken) ? (
                            <div style={{ margin: "1vh 0" }}>
                              <button
                                title="Sair da partida"
                                className="buttonReject"
                                onClick={(e: any) => {
                                  if (obj.match_id !== null) {
                                    handleExitUser(e, obj.match_id);
                                  }
                                }}
                              >
                                <MdOutlineExitToApp size={iconSizePx} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ margin: "1vh 0" }}>
                              <WhatsAppLink
                                sizeButton={iconSizePx}
                                phoneNumber={obj.player2.phoneNumber}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="boxMatches">
                    {obj.player3 && (
                      <div
                        className={`boxData ${
                          isPlayer(obj.player3.user_id, obj.userIdToken)
                            ? "BoxDataUser"
                            : ""
                        }`}
                      >
                        <div
                          className={`boxTitleMatches ${
                            isPlayer(obj.player3.user_id, obj.userIdToken)
                              ? "boxTitleMatchesUser"
                              : ""
                          }`}
                        >
                          Jogador 3
                        </div>
                        <div className="data">
                          <div style={{ textAlign: "center" }}>
                            {!obj.player3.image && (
                              <BsPersonCircle size={170} />
                            )}
                            <ImageDisplay base64Image={obj.player3.image} />
                          </div>
                          <label>
                            Nome
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player3.fullName}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Estado
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player3.state}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Cidade
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player3.city}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Categoria
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player3.category}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Posição de Jogo
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player3.position}
                              readOnly={true}
                            />
                          </label>
                          {isPlayer(obj.player3.user_id, obj.userIdToken) ? (
                            <div style={{ margin: "1vh 0" }}>
                              <button
                                title="Sair da partida"
                                className="buttonReject"
                                onClick={(e: any) => {
                                  if (obj.match_id !== null) {
                                    handleExitUser(e, obj.match_id);
                                  }
                                }}
                              >
                                <MdOutlineExitToApp size={iconSizePx} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ margin: "1vh 0" }}>
                              <WhatsAppLink
                                sizeButton={iconSizePx}
                                phoneNumber={obj.player3.phoneNumber}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="boxMatches">
                    {obj.player4 && (
                      <div
                        className={`boxData ${
                          isPlayer(obj.player1.user_id, obj.userIdToken)
                            ? "BoxDataUser"
                            : ""
                        }`}
                      >
                        <div
                          className={`boxTitleMatches ${
                            isPlayer(obj.player4.user_id, obj.userIdToken)
                              ? "boxTitleMatchesUser"
                              : ""
                          }`}
                        >
                          Jogador 4
                        </div>
                        <div className="data">
                          <div style={{ textAlign: "center" }}>
                            {!obj.player4.image && (
                              <BsPersonCircle size={170} />
                            )}
                            <ImageDisplay base64Image={obj.player4.image} />
                          </div>
                          <label>
                            Nome
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player4.fullName}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Estado
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player4.state}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Cidade
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player4.city}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Categoria
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player4.category}
                              readOnly={true}
                            />
                          </label>
                          <label>
                            Posição de Jogo
                            <br />
                            <input
                              className="styledSelect"
                              onChange={(e: any) => handleData(e, index)}
                              value={obj.player4.position}
                              readOnly={true}
                            />
                          </label>
                          {isPlayer(obj.player4.user_id, obj.userIdToken) ? (
                            <div style={{ margin: "1vh 0" }}>
                              <button
                                title="Sair da partida"
                                className="buttonReject"
                                onClick={(e: any) => {
                                  if (obj.match_id !== null) {
                                    handleExitUser(e, obj.match_id);
                                  }
                                }}
                              >
                                <MdOutlineExitToApp size={iconSizePx} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ margin: "1vh 0" }}>
                              <WhatsAppLink
                                sizeButton={iconSizePx}
                                phoneNumber={obj.player4.phoneNumber}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ padding: "0.5vh" }}></div>
            </>
          ))}
        </form>
      )}
    </>
  );
}
