import React from "react";
import { isMobile } from "react-device-detect";

interface Teen2OResultProps {
  resultHtml: any;
}

const Teen2OResult = ({
  resultHtml,
}: Teen2OResultProps) => {
 const isbacc2 = resultHtml.ename === "Baccarat 2"

  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const player = cards.slice(0,3);
  const banker = cards.slice(3,6);
  const player2 = cards.slice(0,3);
  const banker2 = cards.slice(4,8);

  
   const either = rdescParts[3]?.trim() || "";
          const winnerpair = rdescParts[1]?.trim() || "";
          const perfect = rdescParts[2]?.trim() || "";
          const bigsmall = rdescParts[4]?.trim() || "";


//   const createCards = (
//   cards: string[],
//   rotateFirst = false,
//   rotateLast = false
// ) => {
//   return cards
//     .map((card: string, index: number) => {
//       const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

//       const shouldRotate =
//         (rotateFirst && index === 0) ||
//         (rotateLast && index === cards.length - 1);

//       return `
//         <img
//           src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
//           alt="${safeCard}"
//           style="
//             width:auto;
//             height:35px;
//             margin:3px;
//             ${shouldRotate ? "transform:rotate(270deg);" : ""}
//           "
//         />
//       `;
//     })
//     .join("");
// };


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
  
const player2Card = createCardsBacc2(player2);
const banker2Card = createCardsBacc2(banker2);

  return `
     <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
 <div style="width:${!isMobile?'50%':''}">
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
    ${
        winner === "Player A"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
        ${player2Card}   
      </div>
    </div>
    <div style="width:${!isMobile?'50%':''}">
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
     ${
          winner === "Player B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${banker2Card} 
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
         Suit
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
         Odd/Even
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
         Cards
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
         Under/Over
        </span>

        <span style="width:60%">
          ${bigsmall}
        </span>
      </div>
    
      
   </div>
       
      
    </div>
  `;
};

export default Teen2OResult;