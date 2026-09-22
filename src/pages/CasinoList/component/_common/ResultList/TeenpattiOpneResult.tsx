import React from "react";

interface TeenpattiOpneResultProps {
  resultHtml: any;
}

const TeenpattiOpneResult = ({
  resultHtml,
}: TeenpattiOpneResultProps) => {
  const istwocard = resultHtml.ename === "2 Cards Teenpatti"

  const cards = resultHtml.card?.split(",") || [];
  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const total0 = cards.slice(0,3);
  
  const total1 = cards.slice(3, 6);
  const total2 = cards.slice(6,9);
  const total3 = cards.slice(9,12);
  const total4 = cards.slice(12,15);
  
  const total5 = cards.slice(15, 18);
  const total6 = cards.slice(18,21);
  const total7 = cards.slice(21,24);
  const total8 = cards.slice(24,27);

  const winner = rdescParts[0]?.trim() || "";
   const suitData = rdescParts[3]?.trim() || "";
          const oddEvenData = rdescParts[1]?.trim() || "";
          const consecutiveData = rdescParts[2]?.trim() || "";
          const luckyData = rdescParts[4]?.trim() || "";

const getTrophy = (player: string) =>
  winner.trim() === player
    ? '<i class="fas fa-trophy tropyAnimation"></i>'
    : "";
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
   const total4card = createCards(total4)
  const total5card = createCards(total5);
  const total6card = createCards(total6);
  const total7card = createCards(total7);
  const total8card = createCards(total8);

  



  return `
    <div style="text-align:center;">
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
    
        ${total0card}${getTrophy("1")}
      </div>

      
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
   
        ${total1card} ${getTrophy("Dealer")}
      </div>
        <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        8
      </div>
<div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
   
        ${total2card}  ${getTrophy("8")}
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
   
        ${total3card}  ${getTrophy("2")}
      </div>



      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
      7
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
    
        ${total4card}${getTrophy("7")}
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
   
        ${total5card}  ${getTrophy("3")}
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
   
        ${total6card}   ${getTrophy("4")}
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
   
        ${total7card}   ${getTrophy("5")}
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
   
        ${total8card}   ${getTrophy("6")}
      </div>




      

    </div>
 <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
      margin-bottom: 30px
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
          Pair Plus
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>
    

    </div>
  `;
};

export default TeenpattiOpneResult;