import React from "react";

interface BaccaratResultProps {
  resultHtml: any;
}

const BaccaratResult = ({
  resultHtml,
}: BaccaratResultProps) => {
 const isbacc2 = resultHtml.ename === "Baccarat 2"

  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const player = cards.slice(0,3);
  const banker = cards.slice(3,6);
  const player2 = cards.slice(0,2);
  const banker2 = cards.slice(2,4);

  
   const either = rdescParts[3]?.trim() || "";
          const winnerpair = rdescParts[1]?.trim() || "";
          const perfect = rdescParts[2]?.trim() || "";
          const bigsmall = rdescParts[4]?.trim() || "";


  const createCards = (
  cards: string[],
  rotateFirst = false,
  rotateLast = false
) => {
  return cards
    .map((card: string, index: number) => {
      const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

      const shouldRotate =
        (rotateFirst && index === 0) ||
        (rotateLast && index === cards.length - 1);

      return `
        <img
          src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
          alt="${safeCard}"
          style="
            width:auto;
            height:35px;
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
              height:35px;
              margin:3px;
            "
          />
        `;
      })
      .join("");
  };
  const playerCard = createCards(player, true, false);
const bankerCard = createCards(banker, false, true);
const player2Card = createCardsBacc2(player2);
const banker2Card = createCardsBacc2(banker2);

  return `
    <div style="text-align:center;">
 <div style="
        font-size:16px;
        margin-bottom:3px;
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
      ">
   
        ${playerCard}    ${
        winner === "Player"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>`}
    
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        Banker
      </div>
      ${isbacc2 ? `<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${banker2Card} ${
          winner === "Banker"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
        `:`<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${bankerCard} ${
          winner === "Banker"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>`}
      
   
    </div>
 <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
    ">

      <div style="
        display:flex;
        justify-content:center;
        font-size:12px;
        margin-bottom:2px;
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
        font-size:12px;
        margin-bottom:2px;
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
        font-size:12px;
        margin-bottom:2px;
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
        font-size:12px;
        margin-bottom:2px;
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
        font-size:12px;
        margin-bottom:2px;
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
  `;
};

export default BaccaratResult;