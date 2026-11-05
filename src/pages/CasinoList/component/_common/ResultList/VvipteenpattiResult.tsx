
import React from "react";
import { isMobile } from "react-device-detect";

interface VvipteenpattiResultProps {
  resultHtml: any;
}

const VvipteenpattiResult = ({
  resultHtml,
}: VvipteenpattiResultProps) => {
  const cards = resultHtml.card?.split(",") || [];

  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  const winner = rdescParts[0]?.trim() || "";
  const oddEvenData = rdescParts[2]?.trim() || "";
  const suitData = rdescParts[1]?.trim() || "";
  const luckyData = rdescParts[3]?.trim() || "";

  // Alternate cards:
  // Card 1 -> Player A
  // Card 2 -> Player B
  // Card 3 -> Player A
  // Card 4 -> Player B
  // Card 5 -> Player A
  // Card 6 -> Player B

  const playerACards = cards.filter(
    (_: string, index: number) => index % 2 === 0
  );

  const playerBCards = cards.filter(
    (_: string, index: number) => index % 2 !== 0
  );

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

  const playerACardHtml = createCards(playerACards);
  const playerBCardHtml = createCards(playerBCards);

  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
<div style="width:${!isMobile?'50%':''}">
      <!-- Player A -->
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
        margin-bottom:8px;
      ">
        ${playerACardHtml}

        ${
          winner === "Player A"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'50%':''}">

      <!-- Player B -->
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
        ${playerBCardHtml}

        ${
          winner === "Player B" || winner === "B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

    </div>

</div>
    <!-- Result Details -->
     <div style="display:flex;justify-content:center;align-items:center">
    <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
        width:${!isMobile?'50%':'100%'}
    ">

      <!-- Winner -->
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


      <!-- Odd / Even -->
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
          ${oddEvenData}
        </span>
      </div>


      <!-- Suit -->
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
          Consecutive:
        </span>

        <span style="width:60%">
          ${luckyData}
        </span>
      </div>

    </div>
    </div>
  `;
};

export default VvipteenpattiResult;
