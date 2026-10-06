import React from "react";
import { isMobile } from "react-device-detect";

interface BaccaratResultProps {
  resultHtml: any;
}

const BaccaratResult = ({
  resultHtml,
}: BaccaratResultProps) => {
 const isbacc2 = resultHtml.ename === "Baccarat 2"

 const cards =
  resultHtml.card
    ?.split(",")
    .filter((card: string) => card.trim() !== "1") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
const player = [
  cards[4],
  cards[2],
  cards[0],
];

const banker = [
  cards[1],
  cards[3],
  cards[5],
]; const player2 = [
  cards[0],
  cards[2],
];

const banker2 = [
  cards[1],
  cards[3],
];

  
   const either = rdescParts[3]?.trim() || "";
          const winnerpair = rdescParts[1]?.trim() || "";
          const perfect = rdescParts[2]?.trim() || "";
          const bigsmall = rdescParts[4]?.trim() || "";


const createCards = (
  cards: (string | undefined | null)[],
  rotateFirst = false,
  rotateLast = false
) => {
  return cards
    .filter(
      (card): card is string =>
        !!card && card.trim() !== "" && card.trim() !== "1"
    )
    .map((card: string, index: number, filteredCards) => {
      const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

      const shouldRotate =
        (rotateFirst && index === 0) ||
        (rotateLast && index === filteredCards.length - 1);

      return `
        <img
          src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
          alt="${safeCard}"
          style="
            width:auto;
            height:${isMobile ? "35px" : "50px"};
            margin:3px;
            ${shouldRotate ? "transform:rotate(270deg);" : ""}
          "
        />
      `;
    })
    .join("");
};

const createCardsBacc2 = (playerCards: string[]) => {
    return playerCards
      .map((card: string) => {
        const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

        return `
          <img
            src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
            alt="${safeCard}"
            style="
              width:auto;
               height:${isMobile?'35px':'50px'};
              margin:3px;
            "
          />
        `;
      })
      .join("");
  };
const playerCard = createCards(
  player,
  player.length === 3,
  false
);

const bankerCard = createCards(
  banker,
  false,
  banker.length === 3
);
const player2Card = createCardsBacc2(player2);
const banker2Card = createCardsBacc2(banker2);

  return `
    <div style="text-align:center;">
 <div style="
      font-size:${!isMobile?'20px':'16px'};
            margin-bottom:${isMobile?'3px':'5px'};
      ">
        Player
      </div>
      ${isbacc2 ? `  <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
   
        ${player2Card}    ${
        winner === "Player"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>`:`  <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">   ${
        winner === "Player"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
   
        ${playerCard} 
      </div>`}
    
      <div style="
       font-size:${!isMobile?'20px':'16px'};
             margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Banker
      </div>
      ${isbacc2 ? `<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      ${
          winner === "Banker"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${banker2Card}
      </div>
        `:`<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      ${
          winner === "Banker"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${bankerCard}
      </div>`}
      
   
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

        <span style="width:60%">
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
         Winner Pair
        </span>

        <span style="width:60%">
          ${winnerpair}
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
        ${isbacc2 ?`Score`:`Perfect`} 
        </span>

        <span style="width:60%">
          ${perfect}
        </span>
      </div>
      ${!isbacc2 ?`<div style="
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
         Either
        </span>

        <span style="width:60%">
          ${either}
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
         Big/Small
        </span>

        <span style="width:60%">
          ${bigsmall}
        </span>
      </div>
   
        `:''}
      
    </div>
    </div>
  `;
};

export default BaccaratResult;