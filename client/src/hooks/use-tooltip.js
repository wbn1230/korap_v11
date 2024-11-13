import useInfo from "./use-info";

const useTooltip = () => {
  const {
    activeMenu,
    acclayer1,
    acclayer2,
    rdepth,
    idepth,
    depth1,
    depth2,
    taasInfo,
    info,
  } = useInfo();
  const getTooltip = ({ object, layer }) => {
    const op = object && object.properties;
    const tooltipStyle = {
      position: "fixed",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      padding: "20px",
      color: "black",
      fontSize: "14px",
      borderRadius: "0",
      border: "solid 2px #cccccc",
      boxShadow: "0px 0px 2px 2px rgba(0, 0, 0, 0.1)",
    };

    ////////// 일반국도 //////////
    const laneF = (code) => {
      switch (code) {
        case "1":
          return "1 차선";
        case "2":
          return "2 차선";
        case "3":
          return "4 차선";
        case "4":
          return "5-8 차선";
        case "5":
          return "9 차선 이상";
        default:
          return "N/A";
      }
    };
    //facil_kind const facilRanges = ["0", "1", "2", "4", "8"];
    const facilF = (code) => {
      switch (code) {
        case "0":
          return "일반도로";
        case "1":
          return "교량";
        case "2":
          return "터널";
        case "4":
          return "고가도로";
        case "8":
          return "지하도로";
        default:
          return "N/A";
      }
    };
    //max_spd const speedRanges = [20, 30, 40, 50, 60, 70, 80]; 90 100 110 null 0
    const speedF = (code) => {
      switch (code) {
        case null:
          return "결측";
        case 0:
          return "결측";
        case 20:
          return "20";
        case 30:
          return "30";
        case 40:
          return "40";
        case 50:
          return "50";
        case 60:
          return "60";
        case 70:
          return "70";
        case 80:
          return "80";
        case 90:
          return "90이상";
        case 100:
          return "90이상";
        case 110:
          return "90이상";
        default:
          return "N/A";
      }
    };
    //barrier const barrierRanges = ["0", "1", "2", "3", "4", "5", "15"];
    const barrierF = (code) => {
      switch (code) {
        case "0":
          return "분리대 없음";
        case "1":
          return "벽";
        case "2":
          return "봉";
        case "3":
          return "화단";
        case "4":
          return "안전지대";
        case "5":
          return "금속";
        case "15":
          return "기타";
        default:
          return "N/A";
      }
    };
    //num_cross const lightRanges = [0, 1, 2, 3, 4, null];
    const lightF = (code) => {
      switch (code) {
        case 0:
          return "0";
        case 1:
          return "1";
        case 2:
          return "2";
        case 3:
          return "3";
        case 4:
          return "4";
        case null:
          return "결측";
        default:
          return "N/A";
      }
    };

    //auto_exclu const caronlyRanges = ["0", "1", null];
    const caronlyF = (code) => {
      switch (code) {
        case "0":
          return "비해당";
        case "1":
          return "해당";
        case null:
          return "결측";
        default:
          return "N/A";
      }
    };
    //oneway const onewayRanges = ["0", "1"];
    const onewayF = (code) => {
      switch (code) {
        case "0":
          return "비해당";
        case "1":
          return "해당";
        default:
          return "N/A";
      }
    };

    ////////// 사고위험지도 //////////
    const getrValue = (op, rdepth) => {
      if (!op) return "N/A";
      switch (rdepth.type) {
        case "car":
          return op.l_car_abs;
        case "walk":
          return op.l_ped_abs;
        case "bike":
          return op.l_cyc_abs;
        default:
          return "N/A";
      }
    };
    const getrBiVal = (op, rdepth) => {
      if (!op) return "N/A";
      switch (rdepth.type) {
        case "car":
          return op.l_car_bi_1;
        case "walk":
          return op.l_ped_bi_1;
        case "bike":
          return op.l_cyc_bi_1;
        default:
          return "N/A";
      }
    };
    const getrBiVal2 = (op, rdepth) => {
      if (!op) return "N/A";
      switch (rdepth.type) {
        case "car":
          return op.l_car_bi_2;
        case "walk":
          return op.l_ped_bi_2;
        case "bike":
          return op.l_cyc_bi_2;
        default:
          return "N/A";
      }
    };
    //
    const getiValue = (op, idepth) => {
      if (!op) return "N/A";
      switch (idepth.type) {
        case "car":
          return op.n_car_ai;
        case "walk":
          return op.n_ped_ai;
        case "bike":
          return op.n_cyc_ai;
        default:
          return "N/A";
      }
    };
    const getiBiVal = (op, idepth) => {
      if (!op) return "N/A";
      switch (idepth.type) {
        case "car":
          return op.n_car_bi_1;
        case "walk":
          return op.n_ped_bi_1;
        case "bike":
          return op.n_cyc_bi_1;
        default:
          return "N/A";
      }
    };
    const getiBiVal2 = (op, idepth) => {
      if (!op) return "N/A";
      switch (idepth.type) {
        case "car":
          return op.n_car_bi_2;
        case "walk":
          return op.n_ped_bi_2;
        case "bike":
          return op.n_cyc_bi_2;
        default:
          return "N/A";
      }
    };

    if (activeMenu === "acc") {
      if (!op) return;

      if (acclayer2) {
        if (!op.length_l1) {
          const val = getiValue(op, idepth);
          const bival = getiBiVal(op, idepth);
          const bival2 = getiBiVal2(op, idepth);

          if (idepth.index === 1) {
            return (
              op && {
                html: `
                      <div>
                        <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                          ${`교차로 사고위험도 정보(${op.UID})`}
                        </div>
                        <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                          ${`· 사고위험도-기본지표1: ${bival} (건/km)`}
                        </div>
                      </div>
                    `,
                style: tooltipStyle,
              }
            );
          } else if (idepth.index === 2) {
            return (
              op && {
                html: `
                      <div>
                        <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                          ${`교차로 사고위험도 정보(${op.UID})`}
                        </div>
                        <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                          ${`· 사고위험도-기본지표2: ${bival2} (건/대·km)`}
                        </div>
                      </div>
                    `,
                style: tooltipStyle,
              }
            );
          } else if (idepth.index === 3) {
            return (
              op && {
                html: `
                      <div>
                        <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                          ${`교차로 사고위험도 정보(${op.UID})`}
                        </div>
                        <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                          ${`· 사고건수: ${parseFloat(val)}건 (과거 3년 평균)`}
                        </div>
                      </div>
                    `,
                style: tooltipStyle,
              }
            );
          }
        }
      }
      if (acclayer1) {
        if (op.UID) {
          const val = getrValue(op, rdepth);
          const bival = getrBiVal(op, rdepth);
          const bival2 = getrBiVal2(op, rdepth);

          if (rdepth.index === 1) {
            return (
              op && {
                html: `
                    <div>
                      <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                        ${`단일로 사고위험도 정보(${op.UID})`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 국도번호: ${op.road_no}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 단일로 길이: ${(
                          Number(op.length_l1) / 1000
                        ).toFixed(2)}km`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 사고위험도-기본지표1: ${bival} (건/km)`}
                      </div>
                    </div>
                  `,
                style: tooltipStyle,
              }
            );
          } else if (rdepth.index === 2) {
            return (
              op && {
                html: `
                    <div>
                      <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                        ${`단일로 사고위험도 정보(${op.UID})`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 국도번호: ${op.road_no}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 단일로 길이: ${(
                          Number(op.length_l1) / 1000
                        ).toFixed(2)}km`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 사고위험도-기본지표2: ${bival2} (건/대·km)`}
                      </div>
                    </div>
                  `,
                style: tooltipStyle,
              }
            );
          } else if (rdepth.index === 3) {
            return (
              op && {
                html: `
                    <div>
                      <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                        ${`단일로 사고위험도 정보(${op.UID})`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 국도번호: ${op.road_no}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 단일로 길이: ${(
                          Number(op.length_l1) / 1000
                        ).toFixed(2)}km`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 사고건수: ${parseFloat(val)}건 (과거 3년 평균)`}
                      </div>
                    </div>
                  `,
                style: tooltipStyle,
              }
            );
          }
        }
      }
    }

    ///////////////////////////////////////////////////////////////

    switch (depth1) {
      // case "별점평가":
      //   return (
      //     op && {
      //       html: `
      //         <div style="background-color: ">
      //           <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
      //             ${`도로명: (ID: ${op.uid})`}
      //           </div>
      //           <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
      //             ${`· ${info.roadNo.name}: ${op.road_no}`}
      //           </div>
      //         </div>
      //         `,
      //       style: tooltipStyle,
      //     }
      //   );
      case "도로현황":
        return (
          op && {
            html: `
                <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                  ${`도로명: (ID: ${op.uid})`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                  ${`· ${info.roadNo.name}: ${op.road_no}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                  ${`· ${info.laneOps.name}: ${laneF(op.width)}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                ${`· ${info.facilOps.name}: ${facilF(op.facil_kind)}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                ${`· ${info.speedOps.name}: ${speedF(op.max_spd)}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                ${`· ${info.barrierOps.name}: ${barrierF(op.barrier)}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                ${`· ${info.lightOps.name}: ${lightF(op.num_cross)}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                ${`· ${info.caronlyOps.name}: ${caronlyF(op.auto_exclu)}`}
                </div>
                <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                ${`· ${info.onewayOps.name}: ${onewayF(op.oneway)}`}
                </div>
              `,
            style: tooltipStyle,
          }
        );
      case "TMS":
        if (depth2 === "교통량구간") {
          return (
            op && {
              html: `
                  <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                    ${`도로명: (ID: ${op.uid})`}
                  </div>
                    <div style="color: red; font-size: 0.8rem; line-height: 2;">
                      ${`· AADT: ${op.aadt_pred}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                      ${`· ${info.roadNo.name}: ${op.road_no}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                      ${`· ${info.laneOps.name}: ${laneF(op.width)}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                    ${`· ${info.facilOps.name}: ${facilF(op.facil_kind)}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                    ${`· ${info.speedOps.name}: ${speedF(op.max_spd)}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                    ${`· ${info.barrierOps.name}: ${barrierF(op.barrier)}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                    ${`· ${info.lightOps.name}: ${lightF(op.num_cross)}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                    ${`· ${info.caronlyOps.name}: ${caronlyF(op.auto_exclu)}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                    ${`· ${info.onewayOps.name}: ${onewayF(op.oneway)}`}
                    </div>
                  `,
              style: tooltipStyle,
            }
          );
        } else if (depth2 === "교통량지점") {
          return (
            op && {
              html: `
                  <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                    ${`지점번호: ${op.지점번호}`}
                  </div>
                    <div style="color: red; font-size: 0.8rem; line-height: 2;">
                      ${`· ERR: ${op.Resduals}`}
                      <br />
                      &nbsp 오차 [AADT관측값 - AADT예측값]
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                      ${`· AADT관측값: ${op.AADT}`}
                    </div>
                    <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                      ${`· AADT예측값: ${op.AADT_pred_}`}
                    </div>
                  `,
              style: tooltipStyle,
            }
          );
        }
        break;
      case "TAAS":
        if (op && taasInfo) {
          let fa, si, li, ri, emi;
          switch (depth2) {
            case "차량관점":
              fa = op.fa_co_v;
              si = op.si_co_v;
              li = op.li_co_v;
              ri = op.ri_co_v;
              emi = op.emi_v;
              break;
            case "보행자관점":
              fa = op.fa_co_p;
              si = op.si_co_p;
              li = op.li_co_p;
              ri = op.ri_co_p;
              emi = op.emi_p;
              break;
            case "자전거관점":
              fa = op.fa_co_b;
              si = op.si_co_b;
              li = op.li_co_b;
              ri = op.ri_co_b;
              emi = op.emi_b;
              break;
            default:
              return null;
          }
          if (layer.id === "emiRoad") {
            return {
              html: `
                    <div>
                      <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                        ${`${depth2} 사고 정보(${op.n103_fid})`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 도로명: ${op.road_name ? op.road_name : "N/A"}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 총사고건수: ${
                          Number(fa) + Number(si) + Number(li)
                        }건(과거 3년)`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 사고 종류: 사망사고 ${fa}건, 중상사고<br/>&nbsp&nbsp${si}건, 부상사고 ${li}건, 부상신고 ${ri}건`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 인명피해환산계수(EMI): ${emi}`}
                      </div>
                    </div>
                  `,
              style: tooltipStyle,
            };
          } else {
            return {
              html: `
                    <div>
                      <div style="color: #333333; font-weight: bold; font-size: 0.8rem; line-height: 2;">
                        ${`${depth2}사고 발생지점(${
                          op.n103_uid ? op.n103_uid : "N/A"
                        })`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 종류: ${op.acdnt_sev ? op.acdnt_sev : "N/A"}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 유형: ${op.acdnt_type ? op.acdnt_type : "N/A"}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 특성: ${op.road_type ? op.road_type : "N/A"}`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 시간: ${op.acdnt_date ? op.acdnt_date : "N/A"} ${
                          op.tmzon ? op.tmzon : "N/A"
                        }`}
                      </div>
                      <div style="color: #808080; font-size: 0.8rem; line-height: 2;">
                        ${`· 날씨: ${op.weather ? op.weather : "N/A"}`}
                      </div>
                    </div>
                  `,
              style: tooltipStyle,
            };
          }
        } else {
          return null;
        }

      default:
        return null;
    }
  };

  return { getTooltip };
};

export default useTooltip;
