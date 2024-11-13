import "./LBstar.css";
import React, { useState } from "react";
import Accordion2 from "./Accordion2";
import RightBar from "../components/RB";
import DropdownForm from "./DropdownForm";
import StarProfile from "./StarProfile";
import { MdOutlineSsidChart, MdIndeterminateCheckBox } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import useInfo from "../hooks/use-info";
import { FaCar, FaWalking, FaBiking } from "react-icons/fa";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

const LBstar = ({ setDMBoundary, resetMdata, setSelectedDM, menuToggle }) => {
  const {
    setSelectedRoad,
    setDetailMap,
    scbx,
    setScbx,
    detailMap,
    RBtoggle,
    setRBToggle,
    showProfile,
    setShowProfile,
    setView,
    INITIAL_VIEW_STATE,
    isSelect,
    setIsSelect,
  } = useInfo();
  const [selectedRPIcon, setSelectedRPIcon] = useState("car");
  const [selection, setSelection] = useState("");
  const roads = [
    ["1", "목포-신의주"],
    ["2", "신안-부산"],
    ["3", "남해-초산"],
    ["4", "부안-경주"],
    ["5", "통영-중강진"],
    ["6", "인천-강릉"],
    ["7", "부산-온성"],
    ["13", "완도-금산"],
    ["14", "거제-포항"],
    ["15", "고흥-남원"],
    ["17", "여수-광주"],
    ["18", "진도-구례"],
    ["19", "남해-홍천"],
    ["20", "산청-포항"],
    ["21", "남원-이천"],
    ["22", "정읍-순천"],
    ["23", "강진-천안"],
    ["24", "신안-울산"],
    ["25", "진해-청주"],
    ["26", "군산-대구"],
    ["27", "완도-군산"],
    ["28", "영주-포항"],
    ["29", "보성-서산"],
    ["30", "부안-대구"],
    ["31", "부산-신고산"],
    ["32", "태안-대전"],
    ["33", "고성-구미"],
    ["34", "당진-영덕"],
    ["35", "부산-강릉"],
    ["36", "보령-울진"],
    ["37", "거창-파주"],
    ["38", "태안-동해"],
    ["39", "부여-의정부"],
    ["40", "당진-공주"],
    ["42", "인천-동해"],
    ["43", "세종-고성"],
    ["44", "양평-양양"],
    ["45", "서산-가평"],
    ["46", "인천-고성"],
    ["47", "안산-철원"],
    ["48", "강화-서울"],
    ["56", "철원-양양"],
    ["58", "진해-청도"],
    ["59", "광양-양양"],
    ["67", "칠곡-군위"],
    ["75", "가평-화천"],
    ["77", "부산-파주"],
    ["79", "의령-창녕"],
    ["82", "평택-화성"],
    ["87", "포천-철원"],
    ["88", "영양-울진"],
  ];

  const toggleRB = () => {
    setRBToggle((prev) => !prev);
  };

  const handleSCbx = (idx) => {
    setScbx((prev) => {
      const lst = [...prev];
      lst[idx] = !lst[idx];
      return lst;
    });
  };

  const resetMap = (roadNo) => {
    if (roadNo) {
      setView({
        longitude: INITIAL_VIEW_STATE.longitude,
        latitude: INITIAL_VIEW_STATE.latitude - 1.5,
        zoom: 6.35,
        maxZoom: 17.45,
        minZoom: 5.5,
      });
    }
  };

  const handleSelection = (options) => {
    const roadNo = options[0];
    setSelectedRoad(roadNo);
    setSelection(`국도 ${roadNo}호선 (${options[1]})`);
    setIsSelect(false);
    resetMap(roadNo);
  };

  const toggleDetailMap = () => {
    setDetailMap((prev) => !prev);
    setShowProfile(false);
    setDMBoundary(null);
    resetMdata(false);
  };

  const toggleProfile = () => {
    setDetailMap(false);
    setIsSelect(false);
    setSelectedRoad(null);
    setSelection("");
    setShowProfile((prev) => !prev);
  };

  const handleProfileIconClick = (op) => {
    setSelectedRPIcon(op);
  };

  ///////////////////////////////////////////////////////////////
  const items = [
    {
      id: "별점평가",
      label: "별점 평가 결과",
      content: (
        <div>
          <div id="별점평가 관점" className="inner-accordion-item">
            <span className="label">• 관점</span>
            <div className="icon_container">
              <button className={`icon_button car selected`} /* edit later */>
                <FaCar />
                <div className="icon_label">차량</div>
              </button>
              <button className={`star_icon_button walk `}>
                <FaWalking />
                <div className="icon_label">보행자</div>
              </button>
              <button className={`star_icon_button bike `}>
                <FaBiking />
                <div className="icon_label">자전거</div>
              </button>
            </div>
          </div>
          <div id="별점평가 점수" className="inner-accordion-item">
            <span className="label">• 별점평가 점수</span>
            <div className="checkbox_container">
              <label className="checkbox_label" style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  id="scbx_vh"
                  className="hidden_checkbox"
                  checked={scbx[0]}
                  onChange={() => handleSCbx(0)}
                />
                <span className="custom_checkbox"></span>
                <MdIndeterminateCheckBox className="color_box star_veryHigh" />
                5점
              </label>
              <label className="checkbox_label" style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  id="scbx_h"
                  className="hidden_checkbox"
                  checked={scbx[1]}
                  onChange={() => handleSCbx(1)}
                />
                <span className="custom_checkbox"></span>
                <MdIndeterminateCheckBox className="color_box star_high" />
                4점
              </label>
              <label className="checkbox_label" style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  id="scbx_m"
                  className="hidden_checkbox"
                  checked={scbx[2]}
                  onChange={() => handleSCbx(2)}
                />
                <span className="custom_checkbox"></span>
                <MdIndeterminateCheckBox className="color_box star_medium" />
                3점
              </label>
              <label className="checkbox_label" style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  id="scbx_l"
                  className="hidden_checkbox"
                  checked={scbx[3]}
                  onChange={() => handleSCbx(3)}
                />
                <span className="custom_checkbox"></span>
                <MdIndeterminateCheckBox className="color_box star_low" /> 2점
              </label>
              <label className="checkbox_label" style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  id="scbx_vl"
                  className="hidden_checkbox"
                  checked={scbx[4]}
                  onChange={() => handleSCbx(4)}
                />
                <span className="custom_checkbox"></span>
                <MdIndeterminateCheckBox className="color_box star_veryLow" />
                1점
              </label>
              <label className="checkbox_label">
                <input
                  type="checkbox"
                  id="scbx_na"
                  className="hidden_checkbox"
                  checked={scbx[5]}
                  onChange={() => handleSCbx(5)}
                />
                <span className="custom_checkbox"></span>
                <MdIndeterminateCheckBox className="color_box star_NA" /> 결측
              </label>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const profileStyle = {
    width: "99%",
    height: "87.5%",
    paddingLeft: "10px",
  };
  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <div className={`detail_div ${menuToggle ? "" : "hidden"}`}>
        <div className="accordion_div">{<Accordion2 items={items} />}</div>
        <div
          className="detailmap_button"
          onClick={toggleRB}
          style={{
            backgroundColor: RBtoggle ? "#e5fcf6" : "",
          }}
        >
          별점평가 속성 조회
        </div>
        <div
          className="detailmap_button"
          onClick={toggleDetailMap}
          style={{
            backgroundColor: detailMap ? "#e5fcf6" : "",
            borderTop: "none",
            borderBottom: "2px solid #cccccc",
            fontSize: "16px",
          }}
        >
          정밀도로지도
        </div>
        <div className={`star_buttons_div`}>
          <button className="data_button detailmap" onClick={toggleProfile}>
            <MdOutlineSsidChart />
            <span className="detailmap_text">
              별점평가 프로필을 표출합니다.
            </span>
          </button>
          <button className="data_button chart">
            <IoStatsChart />
            <span className="star_chart_text">별점평가 차트를 표출합니다.</span>
          </button>
        </div>
      </div>
      {RBtoggle && (
        <div>
          <RightBar />
        </div>
      )}
      <div>
        {showProfile && (
          <div
            className={`star_profile_container ${menuToggle ? "" : "hidden"}`}
            style={{
              width: RBtoggle
                ? "calc(100vw - 635px)"
                : menuToggle
                ? "calc(100vw - 220px)"
                : "100vw",
            }}
          >
            <div className="rpoptions">
              <div className="rp_icon_container">
                <button
                  className={`sp_icon car ${
                    selectedRPIcon === "car" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("car")}
                >
                  <FaCar />
                </button>
                <button className={`sp_icon walk`}>
                  <FaWalking />
                </button>
                <button className={`sp_icon bike`}>
                  <FaBiking />
                </button>
              </div>
              <div className="dropdown_container" style={{ width: "40%" }}>
                <div
                  className="rp_roadNo"
                  onClick={() => setIsSelect(!isSelect)}
                >
                  <div>{selection ? `${selection}` : "국도 선택"}</div>
                  {isSelect ? <GoTriangleUp /> : <GoTriangleDown />}
                </div>
                {isSelect && (
                  <DropdownForm
                    options={roads}
                    handleSelection={handleSelection}
                    type="riskprofile"
                  />
                )}
              </div>
            </div>

            <div style={profileStyle}>
              <div id="legend"></div>
              <StarProfile setSelectedDM={setSelectedDM} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LBstar;
