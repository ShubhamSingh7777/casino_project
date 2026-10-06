import React from "react";
import { isMobile } from "react-device-detect";

interface UniqueTeenpattiResultProps {
  resultHtml: any;
}

const UniqueTeenpattiResult = ({ resultHtml }: UniqueTeenpattiResultProps) => {
//   const iscardB = resultHtml.ename === "32 Cards B";

  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const total0 = cards.slice(0, 6);
  const winner = rdescParts[0]?.trim() || "";
  const suitData = rdescParts[3]?.trim() || "";

  const consecutiveData = rdescParts[2]?.trim() || "";
  const luckyData = rdescParts[4]?.trim() || "";

  const oddEvenData = rdescParts[1]?.trim() || "";

  
  const createCards = (playerCards: string[]) => {
  return playerCards
    .map((card: string, index: number) => {
      const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

      const num = index + 1;

      return `
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          margin:3px;
        ">
        
          <div class="unique-teenpatti-number">
            ${num}
          </div>
          <img
            src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
            alt="${safeCard}"
            style="
              width:${isMobile ? "40px" : "80px"};
              height:${isMobile ? "auto" : "auto"};
            "
          />

        </div>
      `;
    })
    .join("");
};
  const total0card = createCards(total0);

  return `
    <div style="text-align:center;">
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      
        ${total0card} 
      </div>
      
    </div>
  `;
};

export default UniqueTeenpattiResult;