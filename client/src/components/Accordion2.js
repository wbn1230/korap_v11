import { useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import "./Accordion2.css";
import useInfo from "../hooks/use-info";
import useFetch from "../hooks/use-fetch";

function Accordion2({ items }) {
  const {
    rdata,
    idata,
    setAcclayer1,
    setAcclayer2,
    setRcbx,
    setIcbx,
    setUserHasInteractedR,
    setUserHasInteractedI,
  } = useInfo();
  const { fetchRoadacc, fetchIntacc } = useFetch();
  const [expandedIndex, setExpandedIndex] = useState([]);

  const updateInfoState = (nextIndex) => {
    switch (items[nextIndex].id) {
      case "도로사고":
        setAcclayer1(false);
        setRcbx([true, true, true, true, true]);
        break;
      case "교차사고":
        setAcclayer2(false);
        setIcbx([true, true, true, true, true]);
        break;
      case "위험도R":
        setRcbx([true, true, true, true, true]);
        break;
      case "위험도I":
        setIcbx([true, true, true, true, true]);
        break;

      default:
        break;
    }
  };

  const handleClick = (nextIndex) => {
    setUserHasInteractedR(false);
    setUserHasInteractedI(false);
    setExpandedIndex((currentExpandedIndex) => {
      if (currentExpandedIndex.includes(nextIndex)) {
        updateInfoState(nextIndex);
        return currentExpandedIndex.filter((item) => item !== nextIndex);
      } else {
        switch (items[nextIndex].id) {
          case "도로사고":
            setRcbx([true, true, true, true, true]);
            setAcclayer1(true);
            if (!rdata) {
              fetchRoadacc();
            }
            return [...currentExpandedIndex, nextIndex];
          case "교차사고":
            setIcbx([true, true, true, true, true]);
            setAcclayer2(true);
            if (!idata) {
              fetchIntacc();
            }
            return [...currentExpandedIndex, nextIndex];
          case "위험도R":
            setRcbx([true, true, true, true, true]);
            return [...currentExpandedIndex, nextIndex];
          case "위험도I":
            setIcbx([true, true, true, true, true]);
            return [...currentExpandedIndex, nextIndex];
          case "별점평가":
            return [...currentExpandedIndex, nextIndex];
          default:
            break;
        }
        return [...currentExpandedIndex, nextIndex];
      }
    });
  };

  const renderedItems = items.map((item, index) => {
    const isExpanded = expandedIndex.includes(index);

    const icon = (
      <span className="icon">
        {isExpanded ? <GoTriangleUp /> : <GoTriangleDown />}
      </span>
    );

    return (
      <div key={item.id} className={`${item.id + "_accitem2"}`}>
        <div
          className={`d2 ${item.id + "_d2"}`}
          onClick={() => handleClick(index)}
        >
          {item.label}
          {icon}
        </div>
        {isExpanded && (
          <div className={`expanded2 ${item.id + "_exp"}`}>{item.content}</div>
        )}
      </div>
    );
  });

  return <div className={`accordion2`}>{renderedItems}</div>;
}

export default Accordion2;
