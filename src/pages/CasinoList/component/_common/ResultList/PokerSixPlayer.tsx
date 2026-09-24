import React from "react";
import { isMobile } from "react-device-detect";

interface PokerSixResultProps {
  resultHtml: any;
}

const PokerSixResult = ({
  resultHtml,
}: PokerSixResultProps) => {


  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
const board = [
  
  cards[12],
  cards[13],
  cards[14],
  cards[15],
  cards[16],
];

const playerA = [
  cards[0],
  cards[6],
];

const playerB = [
 cards[5],
   cards[11],
];

const playerC = [
  cards[1],
  cards[7],
];

const playerD = [
  cards[4],
  cards[10],
];

const playerE = [
  cards[2],
  cards[8],
];

const playerF = [
  cards[3],
  cards[9],
];


  
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
  const playerCCards = createCards(playerC)
  const playerDCards = createCards(playerD);
  const playerECards = createCards(playerE)
  const playerFCards = createCards(playerF);
  const boardCard = createCards(board);

  return `
     <div style="text-align:center;display:${!isMobile?'grid':''};grid-template-columns:${!isMobile?'repeat(3,1fr)':''}">
 <div style="width:${!isMobile?'100%':''}">
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
        margin-bottom:3px;
      ">
   
        ${boardCard}    ${
        winner === "Board"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>
      </div>
      <div style="width:${!isMobile?'100%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        1
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerACards} ${
          winner === "Player 1"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'100%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        6
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerBCards} ${
          winner === "Player 6"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'100%':''}">
      <div style="
      font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        2
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerCCards} ${
          winner === "Player 2"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
      </div>
      <div style="width:${!isMobile?'100%':''}">
      <div style="
          font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        5
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerDCards} ${
          winner === "Player 5"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'100%':''}">

      <div style="
       font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        3
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerECards} ${
          winner === "Player 3"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'100%':''}">
      <div style="
  font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        4
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerFCards} ${
          winner === "Player 4"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
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
         Pattern
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>
   
    </div>
    </div>
  `;
};

export default PokerSixResult;