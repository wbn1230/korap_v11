import "./RB.css";
import React from "react";
// import RBDropdown from "./RBDropdown";
import useInfo from "../hooks/use-info";

// commented Dropdown code will be used in the future

const RB = () => {
  const { RBtoggle, selectedDM, data } = useInfo();

  // const [activeDropdown, setActiveDropdown] = useState(null);
  // const [selectedOptions, setSelectedOptions] = useState({
  //   dm1: "",
  //   dm2: "",
  //   dm3: "",
  //   dm4: "",
  //   dm5: "",
  //   dm6: "",
  //   dm7: "",
  //   dm8: "",
  //   dm9: "",
  //   dm10: "",
  //   dm11: "",
  //   dm12: "",
  // });

  const selectedRoad =
    data.nroad &&
    data.nroad.features.find(
      (feature) => feature.properties.uid === selectedDM
    );

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

  const barrierOps = (code) => {
    switch (code) {
      case "A1":
        return "중앙선 (0m ~ 0.3m)";
      case "A2":
        return "넓은 중앙선 (0.3m ~ 1m)";
      case "A3":
        return "도로 안전지대 (1m ~ )";
      case "B1":
        return "중앙분리대 폭원 (0m ~ 5m)";
      case "B2":
        return "중앙분리대 폭원 (5m ~ 10m)";
      case "B3":
        return "중앙분리대 폭원 (10m ~ 20m)";
      case "B4":
        return "중앙분리대 폭원 (20m ~ )";
      case "C1":
        return "차량방호 울타리 (콘트리트)";
      case "C2":
        return "차량방호 울타리 (금속)";
      case "C3":
        return "차량방호 울타리 (이륜차에 적합한)";
      case "C4":
        return "차량방호 울타리 (로프형)";
      case "D1":
        return "일방향";
      default:
        return "결측";
    }
  };

  const slopeOps = (code) => {
    switch (code) {
      case "0":
        return "0 =< ~ < 7.5%";
      case "1":
        return "7.5% =< ~ < 10%";
      case "2":
        return "10% =<";
      default:
        return "결측";
    }
  };

  const roshdrlOps = (code) => {
    switch (code) {
      case "0":
        return "없음";
      case "1":
        return "좁음 (0m ~ 1m)";
      case "2":
        return "중간 (1m ~ 2.4m)";
      case "3":
        return "넓음 (2.4m ~)";
      default:
        return "결측";
    }
  };

  const roshdrrOps = (code) => {
    switch (code) {
      case "0":
        return "없음";
      case "1":
        return "좁음 (0m ~ 1m)";
      case "2":
        return "중간 (1m ~ 2.4m)";
      case "3":
        return "넓음 (2.4m ~)";
      default:
        return "결측";
    }
  };

  const lineOps = (code) => {
    switch (code) {
      case "0":
        return "4차로이상";
      case "1":
        return "3차로";
      case "2":
        return "2~3차로";
      case "3":
        return "2차로";
      case "4":
        return "1~2차로";
      case "5":
        return "1차로";
      default:
        return "결측";
    }
  };

  const linewidthOps = (code) => {
    switch (code) {
      case "0":
        return "좁음 (0 ~ 2.75m)";
      case "1":
        return "중간 (2.75m ~ 3.25m)";
      case "2":
        return "넓음 (3.25m =< ~ )";

      default:
        return "결측";
    }
  };

  const curvapprOps = (code) => {
    switch (code) {
      case "0":
        return "반경 200m미만";
      case "1":
        return "반경 200~400m";
      case "2":
        return "반경 400~800m";
      case "3":
        return "반경 800m 이상";
      default:
        return "결측";
    }
  };

  const curvqualOps = (code) => {
    switch (code) {
      case "0":
        return "불량";
      case "1":
        return "해당없음";
      case "2":
        return "양호";
      default:
        return "결측";
    }
  };

  const intersectionOps = (code) => {
    switch (code) {
      case "A1":
        return "4지 점멸신호 교차로";
      case "A2":
        return "4지 점멸신호 교차로";
      case "A3":
        return "4지 점멸신호 교차로";
      case "A4":
        return "4지 점멸신호 교차로";
      case "B1":
        return "3지 점멸신호 교차로";
      case "B2":
        return "3지 점멸신호 교차로";
      case "B3":
        return "3지 점멸신호 교차로";
      case "B4":
        return "3지 점멸신호 교차로";
      case "C1":
        return "소형 회전교차로";
      case "C2":
        return "회전교차로";
      case "C3":
        return "철도와의 교차";
      case "C4":
        return "합류차로";
      case "C5":
        return "중앙분리대 횡단 지점 ";
      case "C6":
        return "없음";
      default:
        return "결측";
    }
  };

  const speedregOps = (code) => {
    switch (code) {
      case "0":
        return "있음";
      case "1":
        return "없음";
      default:
        return "결측";
    }
  };

  const visdtOps = (code) => {
    switch (code) {
      case "0":
        return "있음";
      case "1":
        return "없음";
      default:
        return "결측";
    }
  };

  const serviceroOps = (code) => {
    switch (code) {
      case "0":
        return "있음";
      case "1":
        return "없음";
      default:
        return "결측";
    }
  };

  // const toggleDmDropdown = (dropdownId) => {
  //   setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  // };

  // const handleOptionSelect = (dropdownId, option) => {
  //   setSelectedOptions({
  //     ...selectedOptions,
  //     [dropdownId]: option,
  //   });
  //   setActiveDropdown(null);
  // };

  // const dropdowns = [
  //   {
  //     id: "dm1",
  //     label: "중앙분리대 유형",
  //     options: [
  //       "중앙선",
  //       "넓은 중앙선 (0.3m ~1m)",
  //       "도로 안전지대 ( >1m )",
  //       "연속적인 중앙 좌회전 차선",
  //       "차선 규제봉",
  //       "중앙분리대의 물리적 폭원 (0 ~ < 1m)",
  //       "중앙분리대의 물리적 폭원 (1 ~ < 5m)",
  //       "중앙분리대의 물리적 폭원 (5 ~ < 10m)",
  //       "중앙분리대의 물리적 폭원 (10 ~ < 20m)",
  //       "중앙분리대의 물리적 폭원 (20 =< ~)",
  //       "차량 방호울타리 - 콘크리트",
  //       "차량 방호울타리 - 금속",
  //       "차량 방호울타리 - 이륜차에 적합한",
  //       "차량 방호울타리 - 로프형",
  //       "일방향",
  //     ],
  //   },
  //   {
  //     id: "dm2",
  //     label: "경사도",
  //     options: ["10% =<", "7.5% =< ~ < 10%", "0 =< ~ < 7.5%"],
  //   },
  //   {
  //     id: "dm3",
  //     label: "길어깨포장 (운전석)",
  //     options: ["없음", "좁음(0m =< ~ < 1m)"],
  //   },
  //   {
  //     id: "dm4",
  //     label: "길어깨포장 (동승석)",
  //     options: ["중간(1m =< ~ < 2.4m )", "넓음(2.4m =< ~ )"],
  //   },
  //   {
  //     id: "dm5",
  //     label: "차로 수",
  //     options: ["4차로 이상", "3차로", "2~3 차로", "2차로", "1~2차로", "1차로"],
  //   },
  //   {
  //     id: "dm6",
  //     label: "차로폭",
  //     options: ["좁음 0=< ~ < 2.75", "중간 2.75=< ~ < 3.25", "넓음 ~ =< 3.25"],
  //   },
  //   {
  //     id: "dm7",
  //     label: "곡선의 적절성",
  //     options: [
  //       "매우 급격히 변하는 곡선",
  //       "반경 200m미만",
  //       "급격히 변하는 곡선 (반경 200~400)",
  //       "보통 수준의 곡선 (반경 400~800)",
  //       "직선 또는 완만한 곡선 (반경 800이상)",
  //     ],
  //   },
  //   {
  //     id: "dm8",
  //     label: "곡선의 품질",
  //     options: ["불량", "해당없음", "양호"],
  //   },
  //   {
  //     id: "dm9",
  //     label: "교차로 유형",
  //     options: [
  //       "점멸신호 교차로",
  //       "소형 회전교차로 (반경 4m 미만)",
  //       "철도와의 교차",
  //       "회전교차로 (반경 4m 이상)",
  //       "합류차로",
  //       "중앙분리대 횡단 지점",
  //       "없음",
  //     ],
  //   },
  //   {
  //     id: "dm10",
  //     label: "속도 관리/\n교통 정온화 기법",
  //     options: ["있음", "없음"],
  //   },
  //   {
  //     id: "dm11",
  //     label: "시거",
  //     options: ["있음", "없음"],
  //   },
  //   {
  //     id: "dm12",
  //     label: "서비스 도로",
  //     options: ["있음", "없음"],
  //   },
  // ];

  return (
    <div className={`rb_div ${RBtoggle ? "" : "hidden"}`}>
      <div style={{ flex: "0.9" }}>
        <div className="rb-separator">
          <div className="separator-line"></div>
          <div className="separator-text">기본 속성</div>
          <div className="separator-line"></div>
        </div>

        <div className="baseprop">
          <div className="baseprop-left">노선명</div>
          <div className="baseprop-right">
            {selectedDM ? `국도 ${selectedRoad.properties.road_no}호선` : "-"}
          </div>
        </div>
        <div className="baseprop">
          <div className="baseprop-left">구간</div>
          <div className="baseprop-right">
            {selectedDM
              ? roads.find(
                  (road) => road[0] === selectedRoad.properties.road_no
                )[1]
              : "-"}
          </div>
        </div>
        <div className="baseprop">
          <div className="baseprop-left">지점</div>
          <div className="baseprop-right">-</div>
        </div>

        <div className="rb-separator">
          <div className="separator-line"></div>
          <div className="separator-text">별점평가 속성</div>
          <div className="separator-line"></div>
        </div>

        <div className="sdprops">
          <div className="sdprops-title">설계속성</div>
          <div className="sdcontent">
            <div className="sdprops-left">■ 중앙분리대 유형</div>
            <div className="sdprops-right">
              {selectedDM
                ? barrierOps(selectedRoad.properties.barrier_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">■ 경사도</div>
            <div className="sdprops-right">
              {selectedDM ? slopeOps(selectedRoad.properties.slope_class) : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">□ 길어깨포장(운전석)</div>
            <div className="sdprops-right">
              {selectedDM
                ? roshdrlOps(selectedRoad.properties.roshdrL_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">□ 길어깨포장(보조석)</div>
            <div className="sdprops-right">
              {selectedDM
                ? roshdrrOps(selectedRoad.properties.roshdrR_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">■ 차로수</div>
            <div className="sdprops-right">
              {selectedDM ? lineOps(selectedRoad.properties.line_class) : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">■ 차로폭</div>
            <div className="sdprops-right">
              {selectedDM
                ? linewidthOps(selectedRoad.properties.linewidth_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">■ 곡선의 적절성</div>
            <div className="sdprops-right">
              {selectedDM
                ? curvapprOps(selectedRoad.properties.curvappr_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">□ 곡선의 품질</div>
            <div className="sdprops-right">
              {selectedDM
                ? curvqualOps(selectedRoad.properties.curvqual_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">■ 교차로 유형</div>
            <div className="sdprops-right">
              {selectedDM
                ? intersectionOps(selectedRoad.properties.intersection_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">□ 속도관리/정온화 기법</div>
            <div className="sdprops-right">
              {selectedDM
                ? speedregOps(selectedRoad.properties.speedreg_class)
                : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">□ 시거</div>
            <div className="sdprops-right">
              {selectedDM ? visdtOps(selectedRoad.properties.visdt_class) : "-"}
            </div>
          </div>
          <div className="sdcontent">
            <div className="sdprops-left">□ 서비스 도로</div>
            <div className="sdprops-right">
              {selectedDM
                ? serviceroOps(selectedRoad.properties.servicero_class)
                : "-"}
            </div>
          </div>
          <div className="sdboxlegend">
            <div className="sdlegend-left">
              <span style={{ color: "#36546c" }}>■</span> 입력완료
            </div>
            <div className="sdlegend-right">
              <span style={{ color: "#36546c" }}>□</span> 입력필요
            </div>
          </div>
        </div>

        <div className="smprops">
          <div className="smprops-title">운영속성</div>
        </div>
        {/* <div className="table-row-header">
        <div className="category-cell-header-1">속성</div>
        <div className="category-cell-header-2">항목</div>
      </div>
      <div className="property-container">
        {dropdowns.map((dropdown) => (
          <RBDropdown
            key={dropdown.id}
            dropdownId={dropdown.id}
            label={dropdown.label}
            selectedOption={selectedOptions[dropdown.id]}
            activeDropdown={activeDropdown}
            options={dropdown.options}
            toggleDmDropdown={toggleDmDropdown}
            handleOptionSelect={handleOptionSelect}
          />
        ))}
      </div> */}
      </div>
      <div className="rb-buttons" style={{ flex: "0.1" }}>
        <button
          className="rb-edit"
          onClick={() => window.alert("로그인이 필요한 기능입니다.")}
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default RB;
