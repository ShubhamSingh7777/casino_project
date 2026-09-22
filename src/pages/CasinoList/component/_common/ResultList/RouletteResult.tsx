import React from "react";

interface RouletteResultProps {
  resultHtml: any;
}

const RouletteResult = ({
  resultHtml,
}: RouletteResultProps) => {
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
            src="/imgs/roulette12/${safeCard}.png"
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
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
      
        ${total0card}   
      </div>
    </div>
  
  `;
};

export default RouletteResult;