import React from "react";
import CasinoPnl from "../../casinoPnl";

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
}

const CardItemLotteryNew: React.FC<CardItemProps> = ({
  title,
  onClick,
  isSelected,
  lastOdds,
  liveMatchData,
}) => {
  const cardImage = cardMap[title] || fallbackImage;

  const ItemMarket = lastOdds || {};

  console.log("Lottery Card ItemMarket:", ItemMarket);
  console.log("Lottery Card SID:", ItemMarket?.sid);
  console.log(
    "Lottery Card matchId:",
    liveMatchData?.event_data?.match_id
  );

  return (
    <div className="lucky7card">

      <img
        onClick={onClick}
        src={cardImage}
        className={`m-r-5 m-l-5 wd-casino ${
          isSelected ? "selected-card" : ""
        }`}
        style={{
          width: "100%",
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

export default React.memo(CardItemLotteryNew);