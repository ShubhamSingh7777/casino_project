import React from "react";
import { isMobile } from "react-device-detect";
import { parseCard } from "../../uniqueTeenpatti";

interface UniqueTeenpattiResultProps {
  resultHtml: any;
}

const UniqueTeenpattiResult = ({ resultHtml }: UniqueTeenpattiResultProps) => {
  const cards = resultHtml.card?.split(",") || [];
  const total0 = cards.slice(0, 6);

  const createCards = (playerCards: string[]) => {
    return playerCards
      .map((card: string, index: number) => {
        const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");
        const num = index + 1;
        const cardInfo = parseCard(safeCard);

        const isClosed = cardInfo.isClosed;
        const imgSrc = isClosed
          ? "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/1.jpg"
          : `https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg`;

        const cardContent = `<img
            src="${imgSrc}"
            alt="Card ${num}"
            style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="if (!${isClosed} && this.src.endsWith('.png')) { this.src = 'https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg'; } else { this.onerror = null; this.src = '/imgs/card/patti_back.jpg'; }"
          />`;

        return `
          <div style="
            display:flex;
            flex-direction:column;
            align-items:center;
            margin:4px;
          ">
            <div class="unique-teenpatti-number">
              ${num}
            </div>
            <div class="unique-teenpatti-card" style="
              width:${isMobile ? "40px" : "72px"};
              height:${isMobile ? "auto" : "96px"};
              border:none;
              border-radius:0px;
              background:#fff;
              display:flex;
              align-items:center;
              justify-content:center;
              overflow:hidden;
            ">
              ${cardContent}
            </div>
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
        flex-wrap:nowrap;
      ">
        ${total0card} 
      </div>
    </div>
  `;
};

export default UniqueTeenpattiResult;