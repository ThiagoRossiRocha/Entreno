import React from "react";

interface Props {
  readonly?: boolean;
  name?: any;
  value?: any;
  onChange?: any;
  classname?: string;
  style?: any
}

const TextareaComponent: React.FC<Props> = ({
  readonly,
  name,
  value,
  onChange,
  classname,
  style
}) => {
  return (
    <div>
      <textarea
        className={classname || "inputData"}
        id="textArea"
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        style={style || { width: "100%", resize: "none" }}
        readOnly={readonly}
      />
    </div>
  );
};

export default TextareaComponent;
