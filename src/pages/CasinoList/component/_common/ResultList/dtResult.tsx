import React from "react";
import { isMobile } from "react-device-detect";

interface dtResultProps {
  resultHtml: any;
}

const dtResult = ({
  resultHtml,
}: dtResultProps) => {
  const isdtone = resultHtml.ename === "1 Day Dragon Tiger";
  const isdtl20 = resultHtml.ename === "20-20 D T L";

  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const poison = cards.slice(0,1);
  
  const playerAP = cards.slice(1, 2);
  const playerBP = cards.slice(2, 3);
   const suitData = rdescParts[3]?.trim() || "";
          const oddEvenData = rdescParts[1]?.trim() || "";
          const consecutiveData = rdescParts[2]?.trim() || "";
          const cardData = rdescParts[4]?.trim() || "";


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
  const poisonCards = createCards(poison)
  const playerACardsp = createCards(playerAP);
  const playerBCardsP = createCards(playerBP);

  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
 <div style="width:${!isMobile?'50%':''}">
    <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
       Dragon
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
   
        ${poisonCards}    ${
        winner === "Dragon"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>
      </div>
      <div style="width:${!isMobile?'50%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Tiger
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerACardsp} ${
          winner === "Tiger"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
      </div>
      ${isdtl20 ?`<div style="width:${!isMobile?'50%':''}"><div style="
          font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Lion
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerBCardsP} ${
          winner === "Lion"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div> </div>`:''}
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
          ${isdtl20?`Red/Black`:`Pair`}
        </span>

        <span style="width:60%">
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

        <span style="width:60%">
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
          ${isdtl20?`Card`:`Color`}
        </span>

        <span style="width:60%">
          ${suitData}
        </span>
      </div>
      ${!isdtl20?` <div style="
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
        ${isdtone ? `Suit`:`Card`}
          
        </span>

        <span style="width:60%">
          ${cardData}
        </span>
      </div>
        `:''}
 
</div>
    </div>
  `;
};

export default dtResult;