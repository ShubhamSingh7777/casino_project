import React from "react";
import { isMobile } from "react-device-detect";

interface PokerOnedayResultProps {
  resultHtml: any;
}

const PokerOneDayResult = ({
  resultHtml,
}: PokerOnedayResultProps) => {
 const ispoker20 = resultHtml.ename === "20-20 Poker"

  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const playerA = cards.slice(0,2);
  
  const playerB = cards.slice(2, 4);
  const board = cards.slice(4, 9);
   const suitData = rdescParts[3]?.trim() || "";
          const oddEvenData = rdescParts[1]?.trim() || "";
          const consecutiveData = rdescParts[2]?.trim() || "";

  const createCards = (playerCards: string[]) => {
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
  const playerACards = createCards(playerA)
  const playerBCards = createCards(playerB);
  const boardCard = createCards(board);

  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
   <div style="width:${!isMobile?'33%':''}">
    <div style="
        font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
       Player A
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
   
        ${playerACards}    ${
        winner === "Player A"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>
      </div>
      <div style="width:${!isMobile?'33%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Player B
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerBCards} ${
          winner === "Player B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
      </div>
<div style="width:${!isMobile?'33%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Board
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${boardCard} ${
          winner === "Board"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
      </div>
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
         margin-bottom:${isMobile?'3px':'7px'};      ">
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
          ${ispoker20?'Other':'2 Card'} 
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>
      ${!ispoker20?`  <div style="
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
          7 Card
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div> `:''}
    </div>
    </div>
  `;
};

export default PokerOneDayResult;