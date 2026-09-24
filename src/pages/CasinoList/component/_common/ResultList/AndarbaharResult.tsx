import React from "react";
import { isMobile } from "react-device-detect";

interface AndarBaharResultProps {
  resultHtml: any;
}

const AndarBaharResult = ({
  resultHtml,
}: AndarBaharResultProps) => {
  const istwocard = resultHtml.ename === "2 Cards Teenpatti"

  const cards = resultHtml.card?.split(",") || [];
//   const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
const mainCard = cards.slice(0, 1);

// const andarCards = cards.filter(
//   (_: string, index: number) => index >= 1 && index % 2 === 1
// );
const andarCards = cards.slice(1,3);
const baharCards = cards
  .slice(3)
  .filter((card: string) => card.trim() !== "1");

// const baharCards = cards.filter(
//   (_: string, index: number) => index >= 2 && index % 2 === 0
// );
  const winner = rdescParts[0]?.trim() || "";
   const suitData = rdescParts[3]?.trim() || "";
          const oddEvenData = rdescParts[1]?.trim() || "";
          const consecutiveData = rdescParts[2]?.trim() || "";
          const luckyData = rdescParts[4]?.trim() || "";


const createCards = (playerCards: string[]) => {
  return playerCards
    .map((card: string) => {
      const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

      return `
        <img
          src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
          alt="${safeCard}"
          style="
            width:40px;
            height:${isMobile ?'50px' : '50px'};
            margin:3px;
            border-radius:0px;
          "
        />
      `;
    })
    .join("");
};

const createSingleCard = (card: string) => {
  const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

  return `
    <img
      src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
      alt="${safeCard}"
      style="
        width:40px;
        height:${isMobile ? '50px' : '50px'};
        margin:3px;
        border-radius:0px;
      "
    />
  `;
};
const mainCardHtml = createSingleCard(mainCard[0]);

const andar1 = createSingleCard(andarCards[0] || "");
const andar2 = createSingleCard(andarCards[1] || "");

const bahar1 = createSingleCard(baharCards[0] || "");

const baharRemainingCards = baharCards
  .slice(1)
  .map((card: string) => createSingleCard(card))
  .join("");
// const mainCardHtml = createCards(mainCard);
// const andarCardsHtml = createCards(andarCards);
// const baharCardsHtml = createCards(baharCards);


  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
<div style="
  display:flex;
  justify-content:start;
  align-items:center;
  width:100%;
  min-height:${isMobile ? '120px' : '250px'};
">
  <!-- ANDAR -->
  <div style="
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    margin-right:${isMobile ? '20px' : '70px'};
  ">
    <div>
      A
    </div>

    <div>
      B
    </div>
  </div>
  <!-- Main 7H -->
  <div style="
    display:flex;
    align-items:center;
    justify-content:center;
    margin-right:${isMobile ? '10px' : '35px'};
  ">
    ${mainCardHtml}
  </div>

  <!-- ANDAR -->
  <div style="
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    margin-right:${isMobile ? '20px' : '70px'};
  ">
    <div>
     
       ${andar2}
    </div>

    <div>
      ${andar1}
    </div>
  </div>

<!-- BAHAR -->
<!--<div style="
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
">
  <div>
    ${bahar1}
  </div>

  <div style="
    display:flex;
    justify-content:center;
  ">
    ${baharRemainingCards}
  </div>
</div>-->
<div style="
  display:grid;
  grid-template-columns:repeat(6, 1fr);
  align-items:center;
  justify-items:center;
  gap:3px;
">
  ${baharCards
    .map((card: string) => createSingleCard(card))
    .join("")}
</div>

</div>
     <div style="display:flex;justify-content:center;align-items:center">
 <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
       width:${!isMobile?'50%':'100%'}
    ">

      <div style="
        display:flex;
        justify-content:center;
       font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
          Winner
        </span>

        <span style="width:60%;text-align: start">
          ${winner}
        </span>
      </div>
      <div style="
        display:flex;
        justify-content:center;
         font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
          Suit
        </span>

        <span style="width:60%;text-align: start">
          ${oddEvenData}
        </span>
      </div>
       <div style="
        display:flex;
        justify-content:center;
          font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
       Odd/Even
        </span>

        <span style="width:60%;text-align: start">
          ${consecutiveData}
        </span>
      </div>
 <div style="
        display:flex;
        justify-content:center;
          font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
        Joker
        </span>

        <span style="width:60%;text-align: start">
          ${suitData}
        </span>
      </div>
     
       

    </div>
    </div>
  `;
};

export default AndarBaharResult;