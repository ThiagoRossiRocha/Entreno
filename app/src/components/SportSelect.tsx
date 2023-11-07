import React from "react";
import Select from "react-select";
import padelIcon from "../images/icon-padel-racket.png";
import tennisIcon from "../images/icon-tennis-racket.png";
import beachTennisIcon from "../images/icon-beachtTennis-racket.png";

interface Props {
  onChange?: any;
  value?: any;
  styles?: any;
}

export const sportOptions = [
  {
    value: "padel",
    label: "Padel",
    icon: <img src={padelIcon} title="Padel" alt="Ícone" className="logo" />,
  },
  {
    value: "tenis",
    label: "Tenis",
    icon: <img src={tennisIcon} title="Tenis" alt="Ícone" className="logo" />,
  },
  {
    value: "beachTenis",
    label: "Beach Tenis",
    icon: (
      <img
        src={beachTennisIcon}
        title="Beach Tenis"
        alt="Ícone"
        className="logo"
      />
    ),
  },
];

const CustomOption = (props: any) => {
  const { innerProps, data } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: "2.5vh",
      }}
      {...innerProps}
    >
      {data.icon}
      {data.label}
    </div>
  );
};

const CustomSingleValue = (props: any) => {
  const { data } = props;
  return (
    <div>
      {data.icon}
    </div>
  );
};

const SportSelect: React.FC<Props> = ({ onChange, value, styles }) => {
  return (
    <Select
      className="selectSport"
      placeholder="Selecione..."
      options={sportOptions}
      value={value}
      styles={styles || ""}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      onChange={onChange}
    />
  );
};

export default SportSelect;
