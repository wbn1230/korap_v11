import "./LBroad.css";
import React, { useEffect } from "react";
import DropdownForm from "./DropdownForm";
import Accordion from "./Accordion";
import CheckboxForm from "./CheckboxForm";
import useInfo from "../hooks/use-info";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

const LBroad = (menuToggle) => {
  const { info, setInfo, isSelect, setIsSelect, setTaasInfo, setTmsInfo } =
    useInfo();

  useEffect(() => {
    !isSelect &&
      setInfo((prev) => ({
        ...prev,
        roadNo: { ...prev.roadNo, selected: null },
      }));
  }, [isSelect, setInfo]);

  const roadOps = [
    [1, "목포-신의주"],
    [2, "신안-부산"],
    [3, "남해-초산"],
    [4, "부안-경주"],
    [5, "통영-중강진"],
    [6, "인천-강릉"],
    [7, "부산-온성"],
    [13, "완도-금산"],
    [14, "거제-포항"],
    [15, "고흥-남원"],
    [17, "여수-광주"],
    [18, "진도-구례"],
    [19, "남해-홍천"],
    [20, "산청-포항"],
    [21, "남원-이천"],
    [22, "정읍-순천"],
    [23, "강진-천안"],
    [24, "신안-울산"],
    [25, "진해-청주"],
    [26, "군산-대구"],
    [27, "완도-군산"],
    [28, "영주-포항"],
    [29, "보성-서산"],
    [30, "부안-대구"],
    [31, "부산-신고산"],
    [32, "태안-대전"],
    [33, "고성-구미"],
    [34, "당진-영덕"],
    [35, "부산-강릉"],
    [36, "보령-울진"],
    [37, "거창-파주"],
    [38, "태안-동해"],
    [39, "부여-의정부"],
    [40, "당진-공주"],
    [42, "인천-동해"],
    [43, "세종-고성"],
    [44, "양평-양양"],
    [45, "서산-가평"],
    [46, "인천-고성"],
    [47, "안산-철원"],
    [48, "강화-서울"],
    [56, "철원-양양"],
    [58, "진해-청도"],
    [59, "광양-양양"],
    [67, "칠곡-군위"],
    [75, "가평-화천"],
    [77, "부산-파주"],
    [79, "의령-창녕"],
    [82, "평택-화성"],
    [87, "포천-철원"],
    [88, "영양-울진"],
  ];

  ///////////////////////////////////////////////////////////////
  const checklist = [
    {
      name: "차로수별",
      options: ["1차선", "2차선", "4차선", "5-8차선", "9차선이상"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          laneOps: { ...prev.laneOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "교통시설물별",
      options: ["일반도로", "교량", "터널", "고가도로", "지하도로"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          facilOps: { ...prev.facilOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "제한속도별",
      options: ["20", "30", "40", "50", "60", "70", "80", "90이상", "결측"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          speedOps: { ...prev.speedOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "중앙분리대유형별",
      options: ["없음", "벽", "봉", "화단", "안전지대", "금속", "기타"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          barrierOps: { ...prev.barrierOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "신호등개수별",
      options: ["0", "1", "2", "3", "4", "결측"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          lightOps: { ...prev.lightOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "자동차전용도로유무별",
      options: ["비해당", "해당", "결측"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          caronlyOps: { ...prev.caronlyOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "일방통행유무별",
      options: ["비해당", "해당"],
      updateInfo: (sel, chb) =>
        setInfo((prev) => ({
          ...prev,
          onewayOps: { ...prev.onewayOps, selected: sel, checkboxes: chb },
        })),
    },
    {
      name: "TAAS관점",
      options: [
        "사고 안전구간 | 무사고",
        "사고 발생구간 | 중위",
        "사고 위험구간 | 상위 1%",
      ],
      updateInfo: (sel, chb) => setTaasInfo(chb),
    },
    {
      name: "AADT관점",
      options: ["저", "중", "고"],
      updateInfo: (sel, chb) => setTmsInfo(chb),
    },
    {
      name: "AADTDOT관점",
      options: ["예측치 과다", "예측치 정확", "예측치 과소"],
      updateInfo: (sel, chb) => setTmsInfo(chb),
    },
  ];

  const roadStatusItems = [
    {
      id: "국도번호별",
      label: "• 국도번호별",
      content: (
        <div>
          <div className="roadNo" onClick={() => setIsSelect(!isSelect)}>
            <div>
              {info.roadNo.selected && info.roadNo.selected.length !== 0
                ? info.roadNo.selected.length > 9
                  ? info.roadNo.selected.slice(0, 9).join(",") + "..."
                  : info.roadNo.selected.join(",")
                : "선택"}
            </div>
            {isSelect ? <GoTriangleUp /> : <GoTriangleDown />}
          </div>
          {isSelect && <DropdownForm options={roadOps} type="general" />}
        </div>
      ),
    },
    {
      id: "차로수별",
      label: "• 차로수별",
      content: (
        <div className="lane roadItem">
          <CheckboxForm name={"차로수별"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "교통시설물별",
      label: "• 교통 시설물별",
      content: (
        <div className="facil roadItem">
          <CheckboxForm name={"교통시설물별"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "제한속도별",
      label: "• 제한속도별",
      content: (
        <div className="speed roadItem">
          <CheckboxForm name={"제한속도별"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "중앙분리대유형별",
      label: "• 중앙분리대 유형별",
      content: (
        <div className="barrier roadItem">
          <CheckboxForm name={"중앙분리대유형별"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "신호등개수별",
      label: "• 신호등개수별",
      content: (
        <div className="light roadItem">
          <CheckboxForm name={"신호등개수별"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "자동차전용도로유무별",
      label: "• 자동차전용도로 유무별",
      content: (
        <div className="caronly roadItem">
          <CheckboxForm name={"자동차전용도로유무별"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "일방통행유무별",
      label: "• 일방통행 유무별",
      content: (
        <div className="oneway roadItem">
          <CheckboxForm name={"일방통행유무별"} checklist={checklist} />
        </div>
      ),
    },
  ];
  const tmsItems = [
    {
      id: "교통량구간",
      label: "• 예측 교통량",
      content: (
        <div className="roadItem">
          <CheckboxForm name={"AADT관점"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "교통량지점",
      label: "• 교통량 측정 지점",
      content: (
        <div className="roadItem">
          <CheckboxForm name={"AADTDOT관점"} checklist={checklist} />
        </div>
      ),
    },
  ];
  const taasItems = [
    {
      id: "차량관점",
      label: "• 차량 관점",
      content: (
        <div className="roadItem">
          <CheckboxForm name={"TAAS관점"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "보행자관점",
      label: "• 보행자 관점",
      content: (
        <div className="roadItem">
          <CheckboxForm name={"TAAS관점"} checklist={checklist} />
        </div>
      ),
    },
    {
      id: "자전거관점",
      label: "• 자전거 관점",
      content: (
        <div className="roadItem">
          <CheckboxForm name={"TAAS관점"} checklist={checklist} />
        </div>
      ),
    },
  ];
  ///////////////////////////////////////////////////////////////
  const items = [
    {
      id: "도로현황",
      label: "도로현황",
      content: <Accordion items={roadStatusItems} />,
    },
    {
      id: "TMS",
      label: "교통량(TMS)",
      content: <Accordion items={tmsItems} />,
    },
    {
      id: "TAAS",
      label: "교통사고(TAAS)",
      content: <Accordion items={taasItems} />,
    },
  ];
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <div className={`detail_div ${menuToggle ? "" : "hidden"}`}>
        <div className="accordion_div">
          <Accordion items={items} />
        </div>
      </div>
    </div>
  );
};

export default LBroad;
