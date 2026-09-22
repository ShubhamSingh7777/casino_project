import React from "react";

interface CasinoWarResultProps {
  resultHtml: any;
}

const CasinoWarResult = ({
  resultHtml,
}: CasinoWarResultProps) => {
//   const iscardB = resultHtml.ename === "32 Cards B"


  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const total0 = cards.slice(0,1);
  
  const total1 = cards.slice(1, 2);
  const total2 = cards.slice(2,3);
  const total3 = cards.slice(3,4);
  const total4 = cards.slice(4,5);
  const total5 = cards.slice(5,6);
  const total6 = cards.slice(6,7);

  const winner = rdescParts[0]?.trim() || "";
   const suitData = rdescParts[3]?.trim() || "";
       
          const consecutiveData = rdescParts[2]?.trim() || "";
          const luckyData = rdescParts[4]?.trim() || "";

const oddEvenData = rdescParts[1]?.trim() || "";

const oddEvenParts = oddEvenData
  .split("~")
  .map((item: string) => item.trim())
  .filter(Boolean);

const mid = Math.ceil(oddEvenParts.length / 2);

const firstRow = oddEvenParts.slice(0, mid);
const secondRow = oddEvenParts.slice(mid);

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
  const total4card = createCards(total4);
  const total5card = createCards(total5);
  const total6card = createCards(total6);



  return `
    <div style="text-align:center;">
 <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
       Dealer
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      
        ${total0card}   
      </div>

      
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        1
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${total1card}
      </div>
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
       2
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      
        ${total2card} 
      </div>

      
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        3
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${total3card}
      </div>

        <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        4
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${total4card}
      </div>
        <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        5
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${total5card}
      </div>

      
  <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        6
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${total6card}
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
      Color
    </span>

    <span style="width:60%">
      ${firstRow
        .map((item: string, index: number) => `
          <span>
            ${item}${index < firstRow.length - 1 ? " | " : ""}
          </span>
        `)
        .join("")}
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
      &nbsp;
    </span>

    <span style="width:60%">
      ${secondRow
        .map((item: string, index: number) => `
          <span>
            ${item}${index < secondRow.length - 1 ? " | " : ""}
          </span>
        `)
        .join("")}
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
      Odd/Even
    </span>

    <span style="width:60%">
      ${consecutiveData}
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
     Suit
    </span>

    <span style="width:60%">
      ${suitData}
    </span>
  </div>

    
    
    </div>
  `;
};

export default CasinoWarResult;