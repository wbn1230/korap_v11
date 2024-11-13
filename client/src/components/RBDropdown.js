import React from "react";
import { GoTriangleDown } from "react-icons/go";

const DropdownRow = ({
  dropdownId,
  label,
  selectedOption,
  activeDropdown,
  options,
  toggleDmDropdown,
  handleOptionSelect,
}) => {
  return (
    <div className="table-row">
      <div className="category-cell">
        <button className="dm-button-header">
          <div className="labeltext">{label}</div>
        </button>
      </div>
      <div className="dropdown-cell">
        <div className="input-container">
          <input
            type="text"
            readOnly
            className="dropdown-input"
            value={selectedOption}
            onClick={() => toggleDmDropdown(dropdownId)}
            placeholder="선택"
          />
          <GoTriangleDown className="input-icon" />
        </div>
        <div
          id={dropdownId}
          className={`dm-dropdown-content ${
            activeDropdown === dropdownId ? "active" : ""
          }`}
        >
          <ul>
            {options.map((option, index) => (
              <li key={index}>
                <label
                  className="dm-option-label"
                  onClick={() => handleOptionSelect(dropdownId, option)}
                >
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropdownRow;
