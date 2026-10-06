/* eslint-disable */
import React, { Component, useState } from "react";
import { Modal, Card } from "react-bootstrap";
import casinoService from "../../services/casino.service";
import { useParams } from "react-router-dom";
import TeenpattiPoisonResult from "./component/_common/ResultList/TeenpattiPoisonResult";
import TeenpattiTestResult from "./component/_common/ResultList/TeenpattiTestResult";
import PokerOneDayResult from "./component/_common/ResultList/PokerOneDayResult";
import PokerSixResult from "./component/_common/ResultList/PokerSixPlayer";
import BaccaratResult from "./component/_common/ResultList/BaccaratResult";
import CmeterResult from "./component/_common/ResultList/CmeterResult";
import DuskadumResult from "./component/_common/ResultList/DuskadumResult";
import RaceTwoResult from "./component/_common/ResultList/Race2Result";
import NoteNumResult from "./component/_common/ResultList/NotenumResult";
import RaceToSeventeenResult from "./component/_common/ResultList/RaceToSeventeen";
import CardBacarratResult from "./component/_common/ResultList/CardBaccarat29";
import TrapResult from "./component/_common/ResultList/TrapResult";
import Race20Result from "./component/_common/ResultList/Race20Result";
import QueenResult from "./component/_common/ResultList/QueenResult";
import MogamboResult from "./component/_common/ResultList/MogamboResult";
import SuperOverResult from "./component/_common/ResultList/SuperOverResult";
import TeenpattiOpneResult from "./component/_common/ResultList/TeenpattiOpneResult";
import Teen2OResult from "./component/_common/ResultList/Teen2OResult";
import CasinoMeterResult from "./component/_common/ResultList/CasinoMeterResult";
import dtResult from "./component/_common/ResultList/dtResult";
import { result } from "lodash";
import CardAResult from "./component/_common/ResultList/CardAResult";
import Lucky7Result from "./component/_common/ResultList/Lucky7Result";
import Card3JLayout from "./component/card3j";
import CardJudgeResult from "./component/_common/ResultList/CardJudgeResult";
import CasinoWarResult from "./component/_common/ResultList/CasinoWarResult";
import VvipteenpattiResult from "./component/_common/ResultList/VvipteenpattiResult";
import LuckySixResult from "./component/_common/ResultList/Lucky6Result";
import RouletteResult from "./component/_common/ResultList/RouletteResult";
import { isMobile } from "react-device-detect";
import AndarBaharResult from "./component/_common/ResultList/AndarbaharResult";
import UniqueTeenpattiResult from "./component/_common/ResultList/UniqueTeenpattiResult";
import CricketFiveResult from "./component/_common/ResultList/CricketfiveResult";
import SicboResult from "./component/_common/ResultList/SicboResult";

const CasinoResultDetail = (props: any) => {
  const { popupdata, setPopStatus, popupstatus } = props;
  const [casinoResult, setCasinoResult] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const { gameCode } = useParams<{ gameCode: string }>();

  React.useEffect(() => {
    setCasinoResult({});
    setLoader(true);
    if (popupdata.slug && popupdata.slug) {
      console.log(gameCode, popupdata.mid, "popup data");
      casinoService.getResultByMid(popupdata.slug, popupdata.mid).then((res) => {
        setLoader(false);
        const resultHtml = res?.data?.data?.html || {};
        const ename = String(resultHtml.ename || "")
  .trim()
  .toLowerCase();
        // setCasinoResult(res?.data?.data?.html)
console.log("ENAME:", JSON.stringify(resultHtml.ename));
console.log("NORMALIZED ENAME:", ename);
        if (
          resultHtml.ename === "Goal 2" ||
          resultHtml.ename === "Goal" ||
          resultHtml.ename === "Lucky 15" || resultHtml.ename === "Ball By Ball"
        ) {
          setCasinoResult(resultHtml);
          const islucky15 = resultHtml.ename === "Lucky 15";
          const winner = resultHtml.winnat || "";
          const ballbyball = resultHtml.ename === "Ball By Ball"
          let htmlContent = "";

          htmlContent += `
          <div style="
            margin-top:0px;
            padding:${islucky15 ? "0px" : "6px"};
            padding-bottom:0px
          ">
            <div style="display:flex;justify-content:center">
              <div style="position:relative">
              ${
                islucky15 || ballbyball
                  ? ` <img src='/ball-blank.png' alt='' style="width:${isMobile?'50px':'150px'};height:250pxauto"/>
                 <span style="position:absolute;bottom:${isMobile?'14px':'63px'};
    left:${isMobile?'6px':'26px'};color:#fff;font-size:${isMobile?'11px':'26px'};font-weight:bold;text-transform:uppercase;text-align:center;line-height:22px">${winner}</span>`
                  : ` <img src='/soccer-ball.png' alt='' style="width:auto;height:250px"/>
                 <span style="position:absolute;bottom: 9px;
    left: 76px;;color:#000;font-size:15px;font-weight:bold;text-transform:uppercase;text-align:center;line-height:22px">Header Goal By </br> ${winner}</span>`
              }
                
              </div>
             
            </div>
          </div>
        `;

          setData(htmlContent);
          return;
        }
        if (
          resultHtml.ename === "Teenpatti Poison One Day" ||
          resultHtml.ename === "Teenpatti Poison 20-20" ||
          resultHtml.ename === "Unlimited Joker 20-20" ||
          resultHtml.ename === "Teenpatti Joker 20-20" ||
          resultHtml.ename === "Unlimited Joker Oneday"
        ) {
          setCasinoResult(resultHtml);

          const poisonHtml = TeenpattiPoisonResult({
            resultHtml,
          });

          setData(poisonHtml);

          return;
        }
        if (resultHtml.ename === "Teenpatti Test") {
          setCasinoResult(resultHtml);

          const testHtml = TeenpattiTestResult({
            resultHtml,
          });

          setData(testHtml);

          return;
        }
          if (resultHtml.ename === "Beach Roulette" || resultHtml.ename === "Roulette" || resultHtml.ename === "VIP Roulette"  || resultHtml.ename === "Unique Roulette") {
          setCasinoResult(resultHtml);

          const rouletteHtml = RouletteResult({
            resultHtml,
          });

          setData(rouletteHtml);

          return;
        }
         if (resultHtml.ename === "20-20 Dragon Tiger" || resultHtml.ename === "1 Day Dragon Tiger" || resultHtml.ename === "20-20 D T L" || resultHtml.ename === "20-20 Dragon Tiger 2") {
          setCasinoResult(resultHtml);

          const dtHtml = dtResult({
            resultHtml,
          });

          setData(dtHtml);

          return;
        }
        if (resultHtml.ename === "Race 20") {
          setCasinoResult(resultHtml);

          const race20Html = Race20Result({
            resultHtml,
          });

          setData(race20Html);

          return;
        }
        if (resultHtml.ename === "Queen") {
          setCasinoResult(resultHtml);

          const queenHtml = QueenResult({
            resultHtml,
          });

          setData(queenHtml);

          return;
        }
        if (resultHtml.ename === "Teenpatti Open") {
          setCasinoResult(resultHtml);

          const teenOpenHtml = TeenpattiOpneResult({
            resultHtml,
          });

          setData(teenOpenHtml);

          return;
        }
        if (resultHtml.ename === "Mogambo") {
          setCasinoResult(resultHtml);

          const mogamboHtml = MogamboResult({
            resultHtml,
          });

          setData(mogamboHtml);

          return;
        }
           if (resultHtml.ename === "32 Cards A" || resultHtml.ename === "32 Cards B") {
          setCasinoResult(resultHtml);

          const cardAHtml = CardAResult({
            resultHtml,
          });

          setData(cardAHtml);
          return;
        }
           if (resultHtml.ename === "Lucky 7 - A" || resultHtml.ename === "Lucky 7 - B" || resultHtml.ename === "Instant Worli" || resultHtml.ename === "Cricket Match 20-20"
) {
          setCasinoResult(resultHtml);

          const luckyHtml = Lucky7Result({
            resultHtml,
          });

          setData(luckyHtml);
          return;
        }
         if (resultHtml.ename === "3 Cards Judgement" || resultHtml.ename === "Lottery"
) {
          setCasinoResult(resultHtml);

          const cardjudgeHtml = CardJudgeResult({
            resultHtml,
          });

          setData(cardjudgeHtml);
          return;
        }
          if (resultHtml.ename === "Unique Teenpatti") {
          setCasinoResult(resultHtml);

          const uniqueteenResultHtml = UniqueTeenpattiResult({
            resultHtml,
          });

          setData(uniqueteenResultHtml);
          return;
        }
          if (resultHtml.ename === "Casino War"
) {
          setCasinoResult(resultHtml);

          const casinoWarHtml = CasinoWarResult({
            resultHtml,
          });

          setData(casinoWarHtml);
          return;
        }

        if (resultHtml.ename === "Poker 6 Players") {
          setCasinoResult(resultHtml);

          const poker6Html = PokerSixResult({
            resultHtml,
          });

          setData(poker6Html);

          return;
        }
        if (resultHtml.ename === "Race to 17") {
          setCasinoResult(resultHtml);

          const raceseventeenHtml = RaceToSeventeenResult({
            resultHtml,
          });

          setData(raceseventeenHtml);

          return;
        }
        if (resultHtml.ename === "Note Number" || resultHtml.ename === "Trio") {
          setCasinoResult(resultHtml);

          const noteNumHtml = NoteNumResult({
            resultHtml,
          });

          setData(noteNumHtml);

          return;
        }
        //superover2
        if (popupdata.slug === "superover2" || popupdata.slug === "superover") {
          setCasinoResult(resultHtml);

          const superOverHtml = SuperOverResult({
            resultHtml,
          });

          setData(superOverHtml);

          return;
        }
        console.log("SLUG VALUE:", popupdata?.slug);
console.log("SLUG TYPE:", typeof popupdata?.slug);
console.log("SLUG JSON:", JSON.stringify(popupdata?.slug));
console.log(
  "SLUG MATCH:",
  popupdata?.slug?.trim().toLowerCase() === "cricketv3"
);
         if (popupdata.slug === "cricketv3") {
          console.log("🔥🔥 ENTERED CRICKET FIVE CONDITION");
          setCasinoResult(resultHtml);

          const cricketfiveHtml = CricketFiveResult({
            resultHtml,
          });
            console.log("🔥 Cricket Five HTML:", cricketfiveHtml);

          setData(cricketfiveHtml);

          return;
        }
        //cmeter
        if (resultHtml.ename === "Casino Meter") {
          setCasinoResult(resultHtml);

          const casinometerHtml = CasinoMeterResult({
            resultHtml,
          });

          setData(casinometerHtml);

          return;
        }
  if (resultHtml.ename === "Lucky 6") {
          setCasinoResult(resultHtml);

          const lucky6Html = LuckySixResult({
            resultHtml,
          });

          setData(lucky6Html);

          return;
        }

        if (
          resultHtml.ename === "Race to 2nd" ||
          resultHtml.ename === "1 CARD ONE-DAY" ||
          resultHtml.ename === "1 CARD 20-20"
        ) {
          setCasinoResult(resultHtml);

          const racetwoHtml = RaceTwoResult({
            resultHtml,
          });

          setData(racetwoHtml);

          return;
        }

        if (resultHtml.ename === "Dus ka Dum") {
          setCasinoResult(resultHtml);

          const dusHtml = DuskadumResult({
            resultHtml,
          });

          setData(dusHtml);

          return;
        }
        if (resultHtml.ename === "1 Card Meter") {
          setCasinoResult(resultHtml);

          const cmeterHtml = CmeterResult({
            resultHtml,
          });

          setData(cmeterHtml);

          return;
        }

        if (
          resultHtml.ename === "Baccarat" ||
          resultHtml.ename === "Baccarat 2"
        ) {
          setCasinoResult(resultHtml);

          const baccaratHtml = BaccaratResult({
            resultHtml,
          });

          setData(baccaratHtml);

          return;
        }
        if (
          resultHtml.ename === "29Card Baccarat" ||
          resultHtml.ename === "2 Cards Teenpatti"
        ) {
          setCasinoResult(resultHtml);

          const cardbaccaratHtml = CardBacarratResult({
            resultHtml,
          });

          setData(cardbaccaratHtml);

          return;
        }
         if (
          resultHtml.ename === "Andar Bahar 2" || resultHtml.ename === "Andar Bahar"
        ) {
          setCasinoResult(resultHtml);

          const andarBaharHtml = AndarBaharResult({
            resultHtml,
          });

          setData(andarBaharHtml);

          return;
        }
        if (resultHtml.ename === "Teenpatti - 2.0") {
          setCasinoResult(resultHtml);

          const teen2OHtml = Teen2OResult({
            resultHtml,
          });

          setData(teen2OHtml);

          return;
        }
        if (resultHtml.ename === "The Trap") {
          setCasinoResult(resultHtml);

          const trapHtml = TrapResult({
            resultHtml,
          });

          setData(trapHtml);

          return;
        }
        //poker one day
        if (
          resultHtml.ename === "Poker 1-Day" ||
          resultHtml.ename === "20-20 Poker"
        ) {
          setCasinoResult(resultHtml);

          const pokerHtml = PokerOneDayResult({
            resultHtml,
          });

          setData(pokerHtml);

          return;
        }
           if (
          resultHtml.ename === "Sic Bo"
        ) {
          setCasinoResult(resultHtml);

          const sicboHtml = SicboResult({
            resultHtml,
          });

          setData(sicboHtml);

          return;
        }
          if (
          resultHtml.ename === "V VIP Teenpatti 1-day"
        ) {
          setCasinoResult(resultHtml);

          const vvipteenHtml = VvipteenpattiResult({
            resultHtml,
          });

          setData(vvipteenHtml);

          return;
        }
        if (
          resultHtml.ename === "Teenpatti 1-day" ||
          resultHtml.ename === "Doli Dana" ||
          resultHtml.ename === "20-20 Teenpatti C" ||
          resultHtml.ename === "20-20 Teenpatti B" ||
          resultHtml.ename === "Queen Top Open Teenpatti" ||
          resultHtml.ename === "Jack Top Open Teenpatti" ||
          resultHtml.ename === "Instant Teenpatti 3.0" ||
          resultHtml.ename === "Instant Teenpatti 2.0" ||
          resultHtml.ename === "20-20 Teenpatti" ||
          resultHtml.ename === "Instant Teenpatti" ||
          resultHtml.ename === "Muflis Teenpatti"
        ) {
          setCasinoResult(resultHtml);
          const isDoliDana = resultHtml.ename === "Doli Dana";
          const teenpattioneday = resultHtml.ename === "Teenpatti 1-day";
          const isteenpattiC =
            resultHtml.ename === "20-20 Teenpatti C" ||
            "20-20 Teenpatti" ||
            "20-20 Teenpatti B";
          const isqueenteenpatti =
            resultHtml.ename === "Queen Top Open Teenpatti";
          const isjacktopteenpatti =
            resultHtml.ename === "Jack Top Open Teenpatti";
          const isInstantteenpatti =
            resultHtml.ename === "Instant Teenpatti 3.0" ||
            resultHtml.ename === "Instant Teenpatti 2.0" ||
            resultHtml.ename === "Instant Teenpatti";
          const isMuflisteenpatti = resultHtml.ename === "Muflis Teenpatti";

          const cards = resultHtml.card?.split(",") || [];
          const rdescParts = resultHtml.rdesc?.split("#") || [];

          // const playerA = cards.slice(0, 3);
          // const playerB = cards.slice(3, 6);
          const playerA = cards.filter(
  (_: string, index: number) => index % 2 === 0
);

const playerB = cards.filter(
  (_: string, index: number) => index % 2 === 1
);

          const winner = resultHtml.winnat || "";
          const rdesc = resultHtml.rdesc || "";

          const rdescPartsd = rdesc.split("#");

          const playerd = rdescPartsd[0] || "";
          const nod = rdescPartsd[1] || "";
          const dashD = rdescPartsd[2] || "";
          const numberD = rdescPartsd[3] || "";
          const oddEvenDoli = rdescPartsd[4] || "";
          const comparisond = rdescPartsd[5] || "";

          const suitData = rdescParts[1]?.trim() || "";
          const oddEvenData = rdescParts[2]?.trim() || "";
          const consecutiveData = rdescParts[3]?.trim() || "";

          const oddEven = oddEvenData.split(/\s+/);

          const createCards = (playerCards: string[]) => {
            return playerCards
              .map((card: string) => {
                const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

                return `
                ${
                  isDoliDana
                    ? `  <img
            src="/imgs/diceNew/dice${safeCard}.png"
            alt="${safeCard}"
            style="
              width:auto;
             height:${isMobile?'35px':'50px'}; 
              margin:3px;
            "
          />`
                    : ` <img
            src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
            alt="${safeCard}"
            style="
              width:auto;
              height:${isMobile?'35px':'50px'};
              margin:3px;
            "
          />`
                }
        
        `;
              })
              .join("");
          };

          const playerACards = createCards(playerA);
          const playerBCards = createCards(playerB);

          const playerAOddEven = oddEven.slice(0, 3).join(" ");
          const playerBOddEven = oddEven.slice(3, 6).join(" ");

          const htmlContent = `
         
    <div style="text-align:center;display:${!isMobile?'flex':''};justify-content:${!isMobile?'space-between':''}">
     
      ${  
        !isDoliDana
          ? ` <div style="width:${!isMobile?'50%':''}">
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
        (isteenpattiC || isInstantteenpatti) &&
  !isqueenteenpatti &&
  !isjacktopteenpatti

        ? `
        ${
          winner === "Player A"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      `
        : ""
    }

     ${playerACards}
        ${
          !isteenpattiC ||
          isqueenteenpatti ||
          isjacktopteenpatti ||
          teenpattioneday
            ? `
        ${
          winner === "Player A"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      `
            : ""
        }
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
      ">
      ${
        !isteenpattiC &&
        !isqueenteenpatti &&
        isInstantteenpatti &&
        !isjacktopteenpatti
          ? `
          ${
            winner === "Player B"
              ? '<i class="fas fa-trophy tropyAnimation"></i>'
              : ""
          }
        `
          : ""
      }
    
        ${playerBCards}
            ${
              isteenpattiC || isqueenteenpatti || isjacktopteenpatti
                ? `
          ${
            winner === "Player B"
              ? '<i class="fas fa-trophy tropyAnimation"></i>'
              : ""
          }
        `
                : ""
            }
      </div>
      </div>
      `
          : `
      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-top:${isDoliDana ? "5px" : ""}
      ">
        ${playerACards}
      </div>`
      }
     </div>


    </div>
    <div style="display:flex;justify-content:center;align-items:center">
    <div style="
      box-shadow: ${
        !isqueenteenpatti && !isjacktopteenpatti ? "0 0 4px -1px" : ""
      };
      border-top:${
        !isqueenteenpatti && !isjacktopteenpatti ? "1px solid #ddd" : ""
      };
      margin-top:${isDoliDana ? "6px" : "15px"};
      padding:${isqueenteenpatti || isjacktopteenpatti ? "0px" : "6px 35px"};
      width:${!isMobile?'50%':'100%'}
    ">
    ${
      isDoliDana
        ? `
    
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
      Turn
    </span>

    <span style="width:60%">
      ${playerd}
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
      Any Pair
    </span>

    <span style="width:60%">
      ${nod}
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
      Particular Pair
    </span>

    <span style="width:60%">
      ${dashD}
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
      Sum Total
    </span>

    <span style="width:60%">
      ${numberD}
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
      ${oddEvenDoli}
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
      Lucky 7
    </span>

    <span style="width:60%">
      ${comparisond}
    </span>
  </div>
`
        : `  <div style="
        display:flex;
        justify-content:center;
        font-size:12px;
        margin-bottom:2px;
        padding:${isqueenteenpatti || isjacktopteenpatti ? `6px 35px` : ""};
        box-shadow:${
          isqueenteenpatti || isjacktopteenpatti ? `0 0 4px -1px` : ""
        };
      ">
        <span style="opacity:0.6; margin-right:8px;width:30%;text-align:end;font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};">
          Winner:
        </span>

        <span style="width:60%;font-size:${!isMobile?'16px':''}">
          ${winner}
        </span>
      </div>
      ${
        isqueenteenpatti || isjacktopteenpatti
          ? `  <div style="
      box-shadow:0 0 4px -1px;
      margin-top:10px;
      padding:6px 35px;
    ">
  
    <div style="
        display:flex;
        justify-content:center;
          font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="opacity:0.6; margin-right:8px;width:30%,text-align:end">
          Under/Over:
        </span>

        <span style="width:60%">
          ${suitData}
        </span>
      </div>  </div>
        `
          : ""
      }
      ${
        isteenpattiC && !isInstantteenpatti && !isqueenteenpatti && !isjacktopteenpatti
          ? `
         <div style="
        display:flex;
        justify-content:center;
         font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="opacity:0.6; margin-right:8px;width:30%,text-align:end">
          ${isMuflisteenpatti ? `Top 9` : `3 Baccarat:`}
        </span>

        <span style="width:60%">
          ${suitData}
        </span>
      </div> 
         <div style="
        display:flex;
        justify-content:center;
         font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        <span style="opacity:0.6; margin-right:8px;width:30%,text-align:end">
        ${isMuflisteenpatti ? `M Baccarat:` : `Total:`}
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>`
          : ""
      }
      ${
        !isqueenteenpatti &&
        !isjacktopteenpatti &&
        !isInstantteenpatti &&
        !isMuflisteenpatti
          ? `<div style="
        display:flex;
        justify-content:center;
          font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        
        <span style="opacity:0.6; margin-right:8px;width:30%,text-align:end">
         ${isteenpattiC ? `Pair Plus:` : `Odd/Even:`} 
        </span>

        <span style="width:60%">
           ${
             !isteenpattiC
               ? `${playerAOddEven} ${playerBOddEven}`
               : `${numberD}`
           }  
        </span>
      </div>
      <div style="
        display:flex;
        justify-content:center;
         font-size:${!isMobile?'16px':'12px'};
         margin-bottom:${isMobile?'3px':'7px'};
      ">
        
        <span style="opacity:0.6; margin-right:8px;width:30%,text-align:end">
          ${isteenpattiC ? `Red Black:` : `Consecutive`}
        </span>

        <span style="width:60%">
         ${isteenpattiC ? `${oddEvenDoli}` : `${consecutiveData}`} 
        </span>
      </div>
        `
          : ""
      }
       
      
`
    }
    </div>
</div>
  `;

          setData(htmlContent);

          return; // ⭐ IMPORTANT
        }
        setCasinoResult(resultHtml);
        const islucky6 = resultHtml.ename === "Lucky 6";
        const islucky7 = resultHtml.ename === "Lucky 7 - C";
        const isbtable2 = resultHtml.ename === "Bollywood Casino 2" || resultHtml.ename === "Bollywood Casino";
        const cards = resultHtml.card?.split(",") || [];
        const winner = resultHtml.winnat || "";
        const rdesc = resultHtml.rdesc || "";
        const rdescPartsLuck = rdesc.split("#");
        const isAmarAkbar = resultHtml.ename === "Amar Akbar Anthony 2" || "Amar Akbar Anthony";

        // const winner = rdescPartsLuck[0] || "";
        const nod = rdescPartsLuck[1] || "";
        const oddevenl = rdescPartsLuck[2] || "";
        const colorl = rdescPartsLuck[3] || "";
        const cardl = rdescPartsLuck[4] || "";

        let htmlContent = "";

        // Loop through each card and create image tags
        for (const card of cards) {
          // sanitize card to avoid injection (very important)
          const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");
          htmlContent += `<div style="display:flex;justify-content:center;align-items:center"><img 
    src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg" 
    alt="${safeCard}" 
    style="width:auto;margin:4px;height:${isMobile?'35px':'50px'};"
  /></div>`;
        }

        // Add winner text
        htmlContent += ` <div style="display:flex;justify-content:center;align-items:center"><div style="box-shadow:0 0 4px -1px;margin-top:8px;padding: 6px;display:flex;flex-direction:column;justify-content:center;align-items:center; padding-left:20px; width:${!isMobile?'50%':'100%'}">
        <div style="display:flex;width:100%;font-size:${!isMobile?'16px':'12px'};margin-bottom:2px;">
<div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6;font-size:${!isMobile?'16px':'12px'}">Winner </div> <div style="word-break: break-all;
    width: 60%;"> ${winner}</div>
    </div>
    ${
      islucky7
        ? `<div style="display:flex;width:100%;font-size:${!isMobile?'16px':'12px'};margin-bottom:2px;padding:${!isMobile?'5px 0px':''}">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6"> ${isbtable2 ? `Odd` : `Odd/Even`}  </div>
     <div style="word-break: break-all;
    width: 60%;"> ${nod}</div>
    </div>
    <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Color </div> 
    <div style="word-break: break-all;
    width: 60%;"> ${oddevenl}</div>
    </div>
     <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">${isAmarAkbar ? `Under/Over` : `Card`}</div>
     <div style="word-break: break-all;
    width: 60%;"> ${colorl}</div></div>
        <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Line</div>
     <div style="word-break: break-all;
    width: 60%;"> ${cardl}</div></div>
      `
        : ``
    }
    ${
      (islucky6 || isAmarAkbar) && !isbtable2 && !islucky7
        ? ` <div style="display:flex;width:100%;font-size:${!isMobile?'16px':'12px'};margin-bottom:2px;padding:${!isMobile?'5px 0px':''}">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6"> ${isbtable2 ? `Odd` : `Odd/Even`}  </div>
     <div style="word-break: break-all;
    width: 60%;"> ${nod}</div>
    </div>
    <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Color </div> 
    <div style="word-break: break-all;
    width: 60%;"> ${oddevenl}</div>
    </div>
     <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;padding:${!isMobile?'5px 0px':''}">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">${isAmarAkbar ? `Under/Over` : `Card`}</div>
     <div style="word-break: break-all;
    width: 60%;"> ${colorl}</div></div>
    ${
      isAmarAkbar
        ? `
        <div style="display:flex;width:100%;font-size:${!isMobile?'16px':'12px'};margin-bottom:2px;padding:${!isMobile?'5px 0px':''}">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Card</div>
     <div style="word-break: break-all;
    width: 60%;"> ${cardl}</div></div>`
        : ``
    }
      `
        : ``
    }
${isbtable2
    ? ` <div style="display:flex;width:100%;font-size:${!isMobile?'16px':'12px'};margin-bottom:2px;padding:${!isMobile?'5px 0px':''}">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6"> Odd </div>
     <div style="word-break: break-all;
    width: 60%;"> ${nod}</div>
    </div>
    <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Dulha Dulhan/Barati </div> 
    <div style="word-break: break-all;
    width: 60%;"> ${oddevenl}</div>
    </div>
     <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Color</div>
     <div style="word-break: break-all;
    width: 60%;"> ${colorl}</div></div>
    <div style="display:flex;width:100%;font-size:${isMobile?'12px':'16px'};margin-bottom:2px;">
    <div style="margin-right: 2%;
    opacity: 0.6;
    width: 30%;
    text-align: right;opacity:0.6">Card</div>
     <div style="word-break: break-all;
    width: 60%;"> ${cardl}</div></div>
      `
    : ""
}

    
  </div> </div></div>`;

        // Set the HTML (preferably after sanitizing)
        setData(htmlContent);

        if (
          popupdata.slug === "Andarbahar" ||
          popupdata.slug === "Andarbahar2"
        ) {
          // @ts-ignore
          globalThis.$(".owl-carousel").owlCarousel({
            rtl: true,
            loop: true,
            margin: 10,
            dots: false,
            responsiveClass: true,
            responsive: {
              0: {
                items: popupdata.slug === "Andarbahar2" ? 3 : 8,
                nav: true,
              },
              1000: {
                items: 10,
                nav: true,
                loop: false,
              },
            },
          });
        }
      });
    }
  }, [props.popupdata]);

  const formatMatchTime = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
  return (
    <Modal
      show={popupstatus}
      onHide={() => setPopStatus(false)}
      size="lg"
      className="casino-result-modal"
    >
      <Modal.Header className="text-white bg">
        <div className="bg w-100 d-flex flex-row justify-content-between">
          <h4
            className="text-white mb-0"
            style={{ width: "100%", fontSize: isMobile?"16px":"20px" }}
          >
            {" "}
            {popupdata?.event_data?.title || ""} Result
            {/* <span style={{ float: 'right' }}>
              <i
                className='far fa-times text-white'
                aria-hidden='true'
                onClick={() => setPopStatus(false)}
                style={{ cursor: 'pointer', fontSize: '24px',fontWeight:'normal' }}
              />
            </span> */}
            <button
              className="btnCloseResult"
              aria-hidden="true"
              onClick={() => setPopStatus(false)}
              style={{ background: "none", border: "none", float: "right" }}
            >
              <img
                src="/imgs/closeIcon.svg"
                alt=""
                style={{ width: "12px", height: "12px" }}
              />
            </button>
          </h4>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h6 className="text-left" style={{fontWeight:'bold'}}>
            Round Id:{" "}
            <span style={{ fontWeight: "400" }}> {popupdata?.mid || ""}</span>
          </h6>
          <h6 className="text-left" style={{fontWeight:'bold'}}>
            Match Time:{" "}
            <span style={{ fontWeight: "400", color: "#000000" }}>
              {formatMatchTime(casinoResult?.mtime)}
            </span>
          </h6>
        </div>
        {loader ? (
          <div className="text-center">
            <i className="mx-5 fas fa-spinner fa-spin"></i>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: data || "" }}
            className={popupdata.slug}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(CasinoResultDetail);
