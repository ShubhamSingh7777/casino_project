import React from "react";
import { isMobile } from "react-device-detect";

interface CardAResultProps {
  resultHtml: any;
}

const CardAResult = ({
  resultHtml,
}: CardAResultProps) => {
  const iscardB = resultHtml.ename === "32 Cards B";

  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  // --------------------------------------------------
  // Cards for Player 8, 9, 10 and 11
  // --------------------------------------------------

  const total0 = cards.slice(0, 1); // Player 8
  const total1 = cards.slice(1, 2); // Player 9
  const total2 = cards.slice(2, 3); // Player 10
  const total3 = cards.slice(3, 4); // Player 11

  // --------------------------------------------------
  // Result data
  // --------------------------------------------------

  const winner = rdescParts[0]?.trim() || "";
  const suitData = rdescParts[3]?.trim() || "";
  const consecutiveData = rdescParts[2]?.trim() || "";
  const luckyData = rdescParts[4]?.trim() || "";
  const oddEvenData = rdescParts[1]?.trim() || "";

  // --------------------------------------------------
  // Odd / Even
  // --------------------------------------------------

  const oddEvenParts = oddEvenData
    .split("~")
    .map((item: string) => item.trim())
    .filter(Boolean);

  const mid = Math.ceil(oddEvenParts.length / 2);

  const firstRow = oddEvenParts.slice(0, mid);
  const secondRow = oddEvenParts.slice(mid);

  // --------------------------------------------------
  // Create card images
  // --------------------------------------------------

  const createCards = (playerCards: string[]) => {
    return playerCards
      .filter((card: string) => card && card !== "1")
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

  const total0card = createCards(total0);
  const total1card = createCards(total1);
  const total2card = createCards(total2);
  const total3card = createCards(total3);

  // --------------------------------------------------
  // Calculate card value
  // --------------------------------------------------

  const getCardValue = (card: string): number => {
    if (!card || card === "1") {
      return 0;
    }

    // Remove spaces
    const cleanCard = card.trim().toUpperCase();

    // Get rank from card string
    // Example:
    // KDD  -> K
    // 9SS  -> 9
    // 10HH -> 10
    // 8CC  -> 8

    const rank = cleanCard.replace(/[SHDC]/g, "");

    switch (rank) {
      case "A":
        return 1;

      case "J":
        return 11;

      case "Q":
        return 12;

      case "K":
        return 13;

      default: {
        const number = parseInt(rank, 10);

        return isNaN(number) ? 0 : number;
      }
    }
  };

  // --------------------------------------------------
  // Same logic as:
  //
  // calculateTotalNumbersFromString(card) + playerNumber
  // --------------------------------------------------

  const calculatePlayerTotal = (
    playerCards: string[],
    playerNumber: number
  ) => {
    const validCards = playerCards.filter(
      (card: string) => card !== "1"
    );

    const cardTotal = validCards.reduce(
      (total: number, card: string) => {
        return total + getCardValue(card);
      },
      0
    );

    return cardTotal + playerNumber;
  };

  // --------------------------------------------------
  // Player totals
  // --------------------------------------------------

  const player8Total = calculatePlayerTotal(total0, 8);
  const player9Total = calculatePlayerTotal(total1, 9);
  const player10Total = calculatePlayerTotal(total2, 10);
  const player11Total = calculatePlayerTotal(total3, 11);

  // --------------------------------------------------
  // Return HTML
  // --------------------------------------------------

  return `
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">

      <!-- ================= PLAYER 8 ================= -->
<div style="width:${!isMobile?'25%':''}">
      <div style="
       font-size:${!isMobile?'20px':'16px'}; 
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Player 8 - <span style="
          margin-left:3px;
        font-size:${!isMobile?'20px':'16px'};
          color:rgb(255 193 7);
        "> ${player8Total}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:8px;
      ">

        ${total0card}

        
        ${
          winnat === "Player 8"
            ? '<i class="fas fa-trophy tropyAnimation" style="margin-left:5px;"></i>'
            : ""
        }

      </div>
</div>

      <!-- ================= PLAYER 9 ================= -->
<div style="width:${!isMobile?'25%':''}">
      <div style="
        font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Player 9 - <span style="
          margin-left:3px;
          font-size:${!isMobile?'20px':'16px'};
          color:rgb(255 193 7);
        ">${player9Total}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:8px;
      ">

        ${total1card}

        <span style="
          margin-left:5px;
          font-size:14px;
          color:#f0ad4e;
          font-weight:bold;
        ">
         
        </span>

        ${
          winnat === "Player 9"
            ? '<i class="fas fa-trophy tropyAnimation" style="margin-left:5px;"></i>'
            : ""
        }

      </div>
</div>

      <!-- ================= PLAYER 10 ================= -->
<div style="width:${!isMobile?'25%':''}">
      <div style="
          font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Player  10 - <span style="
          margin-left:3px;
         font-size:${!isMobile?'20px':'16px'};
          color:rgb(255 193 7);
        "> ${player10Total}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:8px;
      ">

        ${total2card}

        ${
          winnat === "Player 10"
            ? '<i class="fas fa-trophy tropyAnimation" style="margin-left:5px;"></i>'
            : ""
        }

      </div>
</div>
      <!-- ================= PLAYER 11 ================= -->
<div style="width:${!isMobile?'25%':''}">
      <div style="
        font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Player 11 - <span style="
          margin-left:3px;
         font-size:${!isMobile?'20px':'16px'};
          color:rgb(255 193 7);
        "> ${player11Total}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">

        ${total3card}

        

        ${
          winnat === "Player 11"
            ? '<i class="fas fa-trophy tropyAnimation" style="margin-left:5px;"></i>'
            : ""
        }

      </div>
</div>
    </div>


    <!-- ================= RESULT DETAILS ================= -->
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


      ${
        iscardB
          ? `

      <!-- ================= ODD / EVEN ================= -->

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
          ${firstRow
            .map(
              (item: string, index: number) => `
                <span>
                  ${item}${
                    index < firstRow.length - 1
                      ? " | "
                      : ""
                  }
                </span>
              `
            )
            .join("")}
        </span>

      </div>


      <!-- ================= ODD / EVEN SECOND ROW ================= -->

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
          &nbsp;
        </span>

        <span style="width:60%">
          ${secondRow
            .map(
              (item: string, index: number) => `
                <span>
                  ${item}${
                    index < secondRow.length - 1
                      ? " | "
                      : ""
                  }
                </span>
              `
            )
            .join("")}
        </span>

      </div>


      <!-- ================= BLACK / RED ================= -->

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
          Black/Red
        </span>

        <span style="width:60%">
          ${consecutiveData}
        </span>

      </div>


      <!-- ================= TOTAL ================= -->

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
          Total
        </span>

        <span style="width:60%">
          ${suitData}
        </span>

      </div>


      <!-- ================= SINGLE ================= -->

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
          Single
        </span>

        <span style="width:60%">
          ${luckyData}
        </span>

      </div>

      `
          : ``
      }

    </div>
  `;
};

export default CardAResult;
