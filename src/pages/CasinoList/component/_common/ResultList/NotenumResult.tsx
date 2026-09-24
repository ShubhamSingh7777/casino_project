import React from "react";
import { isMobile } from "react-device-detect";

interface NoteNumResultProps{
  resultHtml: any;
}

const NoteNumResult = ({
  resultHtml,
}: NoteNumResultProps) => {

  const istrio = resultHtml.ename === "Trio";

  const cards = resultHtml.card?.split(",") || [];
//   const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  
  
  const playerAP = cards.slice(0, 6);
 
   const OddEven = rdescParts[0]?.trim() || "";
          const RedBlack = rdescParts[1]?.trim() || "";
          const LowHigh = rdescParts[2]?.trim() || "";
          const Cards = rdescParts[3]?.trim() || "";
          const Baccarat = rdescParts[4]?.trim() || "";

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
  
  const playerACards = createCards(playerAP);




  return `
    <div style="text-align:center;">


      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
        margin-top:3px
      ">
        ${playerACards}
      </div>
    </div>
    <div style="display:flex;justify-content:center;align-items:center">
  <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:8px 35px;
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
           ${istrio ? `Session (21)`:`Odd/Even` }
        </span>

        <span style="width:60%">
          ${OddEven}
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
          ${istrio?`1 2 4 / J Q K`:`Red/Black`} 
        </span>

        <span style="width:60%">
          ${RedBlack}
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
        ${istrio ?`Red/Black`:` Low/High`}
         
        </span>

        <span style="width:60%">
          ${LowHigh}
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
        ${istrio ?`Odd/Even`:`Cards`}
          
        </span>

        <span style="width:60%">
          ${Cards}
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
        ${istrio ?`Pattern`:`Baccarat`}
          
        </span>

        <span style="width:60%">
          ${Baccarat}
        </span>
      </div>

   
  
</div>

    </div>
  `;
};

export default NoteNumResult;