import React from "react";
import { isMobile } from "react-device-detect";

interface QueenResultProps {
  resultHtml: any;
}

const QueenResult = ({
  resultHtml,
}: QueenResultProps) => {
  const istwocard = resultHtml.ename === "2 Cards Teenpatti";

  // Cards directly from API
  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  // const total0 = cards.slice(0, 2);
  // const total1 = cards.slice(2, 4);
  // const total2 = cards.slice(4, 6);
  // const total3 = cards.slice(6, 8);
 const total0 = cards.filter((_: string, index: number) => index % 4 === 0);
const total1 = cards.filter((_: string, index: number) => index % 4 === 1);
const total2 = cards.filter((_: string, index: number) => index % 4 === 2);
const total3 = cards.filter((_: string, index: number) => index % 4 === 3);

  const winner = rdescParts[0]?.trim() || "";

  /*
   * Same calculation as:
   *
   * calculateTotalNumbersFromString(cards[index].join(",")) + index
   *
   * But calculated directly from API card data.
   */

  const getCardValue = (card: string): number => {
    const value = card
      .replace(/[^0-9AKQJ]/gi, "")
      .toUpperCase();

    if (value === "A") return 1;
    if (value === "J") return 11;
    if (value === "Q") return 12;
    if (value === "K") return 13;

    const number = parseInt(value, 10);

    return isNaN(number) ? 0 : number;
  };

  const calculateTotal = (
    playerCards: string[],
    index: number,
  ): number => {
    const cardTotal = playerCards
      .filter((card: string) => card !== "1")
      .reduce((total: number, card: string) => {
        return total + getCardValue(card);
      }, 0);

    // Same + index as queenVideoOverLay()
    return cardTotal + index;
  };

  const total0Value = calculateTotal(total0, 0);
  const total1Value = calculateTotal(total1, 1);
  const total2Value = calculateTotal(total2, 2);
  const total3Value = calculateTotal(total3, 3);

  const createCards = (playerCards: string[]) => {
    return playerCards
      .filter((card: string) => card !== "1")
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

  return `
     <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
<div style="width:${!isMobile?'25%':''}">
      <div style="
         font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Total 0 - <span style="background-color:#086f3f;padding:.35em .65em;font-size:${isMobile?'12px':'15px'};font-weight: 700;color:white;border-radius:5px">${total0Value}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
        margin-top:${!isMobile?'5px':''}
      ">
        ${total0card}

        ${
          winnat === "Total 0"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'25%':''}">
      <div style="
        font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Total 1 - <span style="background-color:#086f3f;padding:.35em .65em;font-size:${isMobile?'12px':'15px'};font-weight: 700;color:white;border-radius:5px">${total1Value}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
         margin-top:${!isMobile?'5px':''}
      ">
        ${total1card}

        ${
          winnat === "Total 1"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'25%':''}">
      <div style="
          font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Total 2 - <span style="background-color:#086f3f;padding:.35em .65em;font-size:${isMobile?'12px':'15px'};font-weight: 700;color:white;border-radius:5px">${total2Value}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
         margin-top:${!isMobile?'5px':''}
      ">
        ${total2card}

        ${
          winnat === "Total 2"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
</div>
<div style="width:${!isMobile?'25%':''}">
      <div style="
  font-size:${!isMobile?'20px':'16px'};
        margin-bottom:${isMobile?'3px':'5px'};
      ">
        Total 3 - <span style="background-color:#086f3f;padding:.35em .65em;font-size:${isMobile?'12px':'15px'};font-weight: 700;color:white;border-radius:5px">${total3Value}</span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
         margin-top:${!isMobile?'5px':''}
      ">
        ${total3card}

        ${
          winnat === "Total 3"
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
</div>
    </div>
  `;
};

export default QueenResult;
