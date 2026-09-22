import React from "react";

interface MogamboResultProps {
  resultHtml: any;
}

const MogamboResult = ({
  resultHtml,
}: MogamboResultProps) => {
  const istwocard = resultHtml.ename === "2 Cards Teenpatti"

  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const total0 = cards.slice(0,2);
  
  const total1 = cards.slice(2, 4);
  const total2 = cards.slice(4,6);
  const total3 = cards.slice(6,8);
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
              height:35px;
              margin:3px;
            "
          />
        `;
      })
      .join("");
  };
  const total0card = createCards(total0)
  const total1card = createCards(total1);
  const total2card = createCards(total2);
  const total3card = createCards(total3);


  return `
    <div style="text-align:center;">
 <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
       Daga / Teja
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
    ${
        winner === "Daga / Teja"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
        ${total0card}
      </div>

      
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        Mogambo
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      ${
          winner === "Mogambo"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${total1card}
      </div>

      

    </div>
 <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
    ">

      <div style="
        display:flex;
        justify-content:center;
        font-size:12px;
        margin-bottom:2px;
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
        font-size:12px;
        margin-bottom:2px;
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
          ${oddEvenData}
        </span>
      </div>
    

    </div>
  `;
};

export default MogamboResult;