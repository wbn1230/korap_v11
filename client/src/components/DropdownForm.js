import "./DropdownForm.css";
import React from "react";
import useInfo from "../hooks/use-info";

const DropdownType1 = ({ options }) => {
  const { info, setInfo } = useInfo();

  const toggle = (option) => {
    setInfo((prev) => {
      const prevlist = prev.roadNo.selected || [];
      const sel = prevlist.includes(option)
        ? prevlist.filter((o) => o !== option)
        : [...prevlist, option];
      return {
        ...prev,
        roadNo: {
          ...prev.roadNo,
          selected: sel,
        },
      };
    });
  };

  const opt = (info && info.roadNo && info.roadNo.selected) || [];

  return (
    <div className="dropdown">
      <ul>
        {options.map((option) => (
          <li key={option[0]}>
            <input
              type="checkbox"
              id={option[0]}
              className="option-checkbox"
              checked={opt.includes(option[0])}
              onChange={() => toggle(option[0])}
            />
            <label
              htmlFor={option[0]}
              className={`option-label ${
                opt.includes(option[0]) ? "selected" : ""
              }`}
            >
              국도 {option[0]}호선({option[1]})
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DropdownType2 = ({ options, handleSelection }) => {
  const { isSelect } = useInfo();

  return (
    <div>
      {isSelect && (
        <ul className="dropdown-rp">
          {options.map((option) => (
            <li key={option[0]} onClick={() => handleSelection(option)}>
              <label className="option-label2">
                국도 {option[0]}호선 ({option[1]})
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DropdownForm = ({ options, handleSelection, type }) => {
  if (type === "general") {
    return <DropdownType1 options={options} />;
  }
  if (type === "riskprofile") {
    return (
      <DropdownType2 options={options} handleSelection={handleSelection} />
    );
  }
  return null;
};

export default DropdownForm;
