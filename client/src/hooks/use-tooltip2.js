const useTooltip2 = () => {
  const getTooltip = (
    { object, layer },
    slopeMode,
    distance,
    bottomHeight,
    zdiff
  ) => {
    const op = object && object.properties;

    if (!slopeMode) return;
    // 정밀도로지도 tooltip
    if (op) {
      return (
        op && {
          html: `
                <div>
                  <div style="color: #333333; font-weight: bold; font-size: 1rem; line-height: 2;">
                    ${`측정 거리: ${
                      distance === 0 ? "0" : distance.toFixed(2)
                    } m`}
                  </div>
                  <div style="color: #333333; font-weight: bold; font-size: 1rem; line-height: 2;">
                    ${`측정 고도 차이: ${
                      zdiff === 0 || !zdiff ? "0" : zdiff.toFixed(2)
                    } m`}
                  </div>
                </div>
              `,
          style: {
            position: "fixed",
            backgroundColor: "rgba(233, 233, 255, 1)",
            padding: "3px 15px",
            borderRadius: "0",
            border: "solid 2px #cccccc",
            boxShadow: "0px 0px 2px 2px rgba(0, 0, 0, 0.1)",
            top: `${100 - bottomHeight}vh`, // manually adjust to second deck.gl instance
          },
        }
      );
    }
  };

  return { getTooltip };
};

export default useTooltip2;
