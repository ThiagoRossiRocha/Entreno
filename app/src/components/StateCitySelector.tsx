import React, { useState } from "react";
import { data } from "../util/estados-cidades";

interface Props {
  onChangeState?: any;
  onChangeCity?: any;
  valueState?: any;
  valueCity?: any;
}

const StateCitySelector: React.FC<Props> = ({
  onChangeState,
  onChangeCity,
  valueState,
  valueCity,
}) => {
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [selectedCidade, setSelectedCidade] = useState<string>("");

  const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEstado(event.target.value);
    setSelectedCidade("");
  };

  const handleCidadeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCidade(event.target.value);
  };

  return (
    <div className="styledLabel">
      <label className="styledLabel">
        Estado:
        <br />
        <select
          className="styledSelect"
          name="state"
          value={valueState || selectedEstado}
          onChange={onChangeState || handleEstadoChange}
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
          value={valueCity || selectedCidade}
          onChange={onChangeCity || handleCidadeChange}
          disabled={!selectedEstado}
        >
          <option value="">Selecione...</option>
          {selectedEstado &&
            data
              .find((item) => item.nome === selectedEstado)
              ?.cidades.map((cidade, index) => (
                <option key={index} value={cidade}>
                  {cidade}
                </option>
              ))}
        </select>
      </label>
    </div>
  );
};

export default StateCitySelector;
