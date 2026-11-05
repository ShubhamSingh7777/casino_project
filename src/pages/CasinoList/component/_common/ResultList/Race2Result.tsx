import React from "react";
import { isMobile } from "react-device-detect";

interface RaceTwoResultProps {
  resultHtml: any;
}

const RaceTwoResult = ({
  resultHtml,
}: RaceTwoResultProps) => {
 const isonecard = resultHtml.ename === "1 CARD ONE-DAY" ;
 const isonecard2 = resultHtml.ename ==="1 CARD 20-20";
 const isRaceTo2nd = resultHtml.ename = "Race to 2nd";

  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  
  
  const playerAP = cards.slice(0, 1);
  const playerBP = cards.slice(1, 2);
  const playerCP = cards.slice(2, 3);
  const playerDP = cards.slice(3, 4);
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
  
  const playerACards = createCards(playerAP);
  const playerBCards = createCards(playerBP);
  const playerCCards = createCards(playerCP);
  const playerDCards = createCards(playerDP);



  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''};margin-top:${!isMobile?'.5rem':''}">
     <div style="
  width:${
    isonecard || isonecard2
      ? (!isMobile ? '50%' : '100%')
      : (!isMobile ? '25%' : '')
  };
">
 <div style="
        font-size:${!isMobile?'20px':'16px'};
               margin-bottom:${isMobile?'3px':'5px'};
      ">
      ${isonecard || isonecard2 ?`Player`:`Player A`}
      </div>
   
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
       
      ${
  winner === "Player A"
    ? '<i class="fas fa-trophy tropyAnimation"></i>'
    : winner === "Player"
      ? '<i class="fas fa-trophy tropyAnimation"></i>'
      : ''
}
        ${playerACards}
      </div>
      </div>
      <div style="
  width:${
    isonecard || isonecard2
      ? (!isMobile ? '50%' : '100%')
      : (!isMobile ? '25%' : '')
  };
">
      <div style="
    font-size:${!isMobile?'20px':'16px'};
           margin-bottom:${isMobile?'3px':'5px'};
      ">
            ${isonecard || isonecard2 ?`Dealer`:`Player B`}
      
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${
  winner === "Player B"
    ? '<i class="fas fa-trophy tropyAnimation"></i>'
    : winner === "Dealer"
      ? '<i class="fas fa-trophy tropyAnimation"></i>'
      : ''
}
        ${playerBCards}
      </div>
      </div>
      ${!isonecard && !isonecard2 ? `<div style="width:${!isMobile?'25%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
                margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Player C
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
      ${
          winner === "Player C"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${playerCCards}
      </div>
      </div>
      <div style="width:${!isMobile?'25%':''}">
      <div style="
       font-size:${!isMobile?'20px':'16px'};
              margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Player D
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
      ${
          winner === "Player D"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${playerDCards}
      </div>
      </div>
      `:''}
      
      

    </div>
    <div style="display:flex;justify-content:center;align-items:center">
  <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:8px 35px;
            width:${!isMobile?'50%':'100%'}
  
    ">

      <div style="
        display:flex;
        justify-content:center;
        font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'5px'};
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
          font-size:${!isMobile?'16px':''}
        ">
          Winner
        </span>

        <span style="width:60%">
          ${winner}
        </span>
      </div>
  ${
  isonecard
    ? `
      <div style="
        display:flex;
        justify-content:center;
        font-size:${!isMobile?'16px':'12px'};
        margin-bottom:${isMobile ? "3px" : "5px"};
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
          7 Up - 7 Down
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>
    `
    : isonecard2
      ? `
        <div style="
          display:flex;
          justify-content:center;
          font-size:${!isMobile?'16px':'12px'};
          margin-bottom:${isMobile ? "3px" : "5px"};
        ">
          <span style="
            opacity:0.6;
            margin-right:8px;
            width:30%;
            text-align:end;
          ">
            Pair
          </span>

          <span style="width:60%">
            ${oddEvenData}
          </span>
        </div>
      `
      : ""
}
     

   </div>
  


    </div>
  `;
};

export default RaceTwoResult;