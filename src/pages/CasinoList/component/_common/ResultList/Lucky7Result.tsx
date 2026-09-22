import React from "react";

interface Lucky7ResultProps {
  resultHtml: any;
}

const Lucky7Result = ({ resultHtml }: Lucky7ResultProps) => {
  const isinstantworliB = resultHtml.ename === "Instant Worli";
 const isCricketMatch = resultHtml.ename === "Cricket Match 20-20"
  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const total0 = cards.slice(0, 1);

  const total1 = cards.slice(0, 3);
  const total2 = cards.slice(2, 3);
  const total3 = cards.slice(3, 4);
  const winner = rdescParts[0]?.trim() || "";
  const suitData = rdescParts[3]?.trim() || "";

  const consecutiveData = rdescParts[2]?.trim() || "";
  const luckyData = rdescParts[4]?.trim() || "";

  const oddEvenData = rdescParts[1]?.trim() || "";

  
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
  const total0card = createCards(total0);
  const total1card = createCards(total1);
  const total2card = createCards(total2);
  const total3card = createCards(total3);

  return `
    <div style="text-align:center;">
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      ${isinstantworliB ? `${total1card}`:` ${total0card}`}
        
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
      ${!isCricketMatch ?`  <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
            ${isinstantworliB ? `Ocada` : `Winner`}
        </span>`:`  <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
            Run
        </span>`}
      

        <span style="width:60%">
          ${winner}
        </span>
      </div>
   ${!isCricketMatch ? `  <div style="
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
    ${isinstantworliB ? `Pana` : `Odd/Even`}
      
    </span>

    <span style="width:60%">
      ${oddEvenData}
    </span>
  </div>
    `:''}


  ${!total1card ?` <div style="
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
      Card
    </span>

    <span style="width:60%">
      ${suitData}
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
      Line
    </span>

    <span style="width:60%">
      ${luckyData}
    </span>
  </div>

    `:''}
 
 


    
    </div>
  `;
};

export default Lucky7Result;
