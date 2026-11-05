import React from "react";
import { isMobile } from "react-device-detect";

interface CardBacarratResultProps {
  resultHtml: any;
}

const CardBacarratResult = ({
  resultHtml,
}: CardBacarratResultProps) => {
  const istwocard = resultHtml.ename === "2 Cards Teenpatti"

  const cards = resultHtml.card?.split(",") || [];
//   const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
 const poison = cards.filter(
  (_: string, index: number) => index % 2 === 0
);

const playerAP = cards.filter(
  (_: string, index: number) => index % 2 === 1
);
 const playerAtwo = cards.filter(
  (_: string, index: number) => index % 2 === 0
);

const playerBtwo = cards.filter(
  (_: string, index: number) => index % 2 === 1
);
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
  const playerACardsP = createCards(playerAtwo);
  const playerBCardsP = createCards(playerBtwo);


  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
    <div style="width:${!isMobile?'50%':''}">
 <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
       Player A
      </div>

      ${istwocard?`<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
         ${
        winner === "Player A"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
        ${playerACardsP} 
      </div>`:`<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      
        ${poisonCards}    ${
        winner === "Player A"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>`

      }
      </div>
      <div style="width:${!isMobile?'50%':''}">
      <div style="
          font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        
        Player B
      </div>
${istwocard?`<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     ${
          winner === "Player B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${playerBCardsP} 
      </div>
    `:`<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerACardsp} ${
          winner === "Player B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>`}
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
         ${istwocard?`Mini Baccarat`:`High Card`}
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
        ${istwocard ?`Total`:`Pair`}
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
         Color Plus
        </span>

        <span style="width:60%">
          ${suitData}
        </span>
      </div>
      ${!istwocard ? `<div style="
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
         Lucky 9
        </span>

        <span style="width:60%">
          ${luckyData}
        </span>
      </div>`:'' }
       

    </div>
    </div>
  `;
};

export default CardBacarratResult;