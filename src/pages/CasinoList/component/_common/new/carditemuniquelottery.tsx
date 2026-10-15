import React from "react";
import CasinoPnl from "../../casinoPnl";
import { isMobile } from "react-device-detect";

const cardMap: Record<string, string> = {
  "1": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/A.png",
  "2": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/2.png",
  "3": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/3.png",
  "4": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/4.png",
  "5": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/5.png",
  "6": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/6.png",
  "7": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/7.png",
  "8": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/8.png",
  "9": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/9.png",
  "10": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/10.png",
};

const fallbackImage = cardMap["1"];

interface CardItemProps {
  title: string;
  onClick: () => void;
  isSelected: boolean;
  lastOdds?: any;
  liveMatchData?: any;
  gameCode?: string;
}

const CardItemuniqueLottery: React.FC<CardItemProps> = ({
  title,
  onClick,
  isSelected,
  lastOdds,
  liveMatchData,
  gameCode,
}) => {
const cardValue = liveMatchData?.cards?.[Number(title) - 1];

const cardImage =
  cardValue && cardValue !== "1"
    ? `https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardValue}.jpg`
    : cardMap[title] || fallbackImage;

  const ItemMarket = lastOdds || {};

  console.log("Lottery Card ItemMarket:", ItemMarket);
  console.log("Lottery Card SID:", ItemMarket?.sid);
  console.log("Lottery Card matchId:", liveMatchData?.event_data?.match_id);

  return (
    <div className={`${gameCode !=="teenunique"? "lucky7card" : ""}`}>
     <img
  onClick={onClick}
  src={
    gameCode === "teenunique" && lastOdds?.gstatus !== "OPEN"
      ? "/imgs/card/patti_back.jpg"
      : cardImage
  }
 className={`wd-casino ${
  gameCode !== "teenunique" ? "m-r-5 m-l-5" : ""
} ${isSelected ? "selected-card" : ""}`}
  style={{
  width: gameCode === "teenunique" ? (isMobile ? "40px" : "80px") : "100%",
  height: "auto",
  cursor: "pointer",
}}
  alt={`Card ${title}`}
  onError={(e) => {
    e.currentTarget.src = fallbackImage;
  }}
/>

      <CasinoPnl
        sectionId={ItemMarket?.sid}
        matchId={liveMatchData.match_id}
        classData={"text-center"}
      />
    </div>
  );
};

export default React.memo(CardItemuniqueLottery);
