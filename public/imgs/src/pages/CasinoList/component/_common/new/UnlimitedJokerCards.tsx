import React from "react";
import { isMobile } from "react-device-detect";

const cardImages = [
  { name: "A", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/A.png" },
  { name: "2", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/2.png" },
  { name: "3", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/3.png" },
  { name: "4", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/4.png" },
  { name: "5", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/5.png" },
  { name: "6", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/6.png" },
  { name: "7", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/7.png" },
  { name: "8", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/8.png" },
  { name: "9", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/9.png" },
  { name: "10", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/10.png" },
  { name: "J", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/J.png" },
  { name: "Q", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/Q.png" },
  { name: "K", url: "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/K.png" },
];

const fallbackImage = "/imgs/card/1.jpg";

const UnlimitedJokerCards = ({ selectedCard, setSelectedCard }: any) => {
  return (
    <div
      style={{
        background: "#2c3e50b3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "8px",
        marginBottom: "5px",
      }}
    >
      <div className="w-100" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h4 style={{ background: "#0088cce6", color: "white", padding: "8px", borderRadius: "4px", fontSize: "18px",fontWeight:"400" }}>
          Select Your Joker
        </h4>
      </div>

      <div className="w-100" style={{ display: "flex", gap: isMobile ? "2px" : "3px", flexWrap:isMobile?"wrap": "nowrap", justifyContent: "center" }}>
        {cardImages.map((card, i) => (
          <img
            key={i}
            src={card.url}
            className="wd-casino"
            style={{
              width: isMobile ? "39px" : "58px",
              height:isMobile?"46px": "60px",
              border: selectedCard === card.name ? "2px solid yellow" : "2px solid transparent",
              borderRadius: "0px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedCard(selectedCard === card.name ? null : card.name)} // ✅ toggle selection
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackImage;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UnlimitedJokerCards;