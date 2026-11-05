import React from "react";
import { isMobile } from "react-device-detect";

interface RaceToSeventeenResultProps {
  resultHtml: any;
}

const RaceToSeventeenResult = ({
  resultHtml,
}: RaceToSeventeenResultProps) => {
 const isbacc2 = resultHtml.ename === "Baccarat 2"

  const cards = resultHtml.card?.split(",") || [];
//   const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

   const player = cards;


  const card =  rdescParts[0]?.trim() || "";
          const winnerpair = rdescParts[1]?.trim() || "";
          const perfect = rdescParts[2]?.trim() || "";
          const either = rdescParts[3]?.trim() || "";
          const bigsmall = rdescParts[4]?.trim() || "";


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

const player2Card = createCardsBacc2(player);
// const lastCardHtml = createCardsBacc(lastCard);

console.log("Total cards:", cards.length);
const sliderId = `duskadumCards_${Date.now()}`;
  
// const player2Card = createCardsBacc2(player2);
// const banker2Card = createCardsBacc2(banker2);

return `
<div style="text-align:center;">
     <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
        ${player2Card}   
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
          Race to 17
        </span>

        <span style="width:60%">
          ${card}
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
         Big Card
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
         Zero Card
        </span>

        <span style="width:60%">
          ${perfect}
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
         One Zero Card
        </span>

        <span style="width:60%">
          ${either}
        </span>
      </div>
    </div>
    </div>
`;
}
export default RaceToSeventeenResult;