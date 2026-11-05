import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router-dom";

const CasinoTimer = ({ lastOdds }: any) => {
  const [counter, setCounter] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastApiTimeRef = useRef<number | null>(null);
  const delayNextTickRef = useRef(false);
  const { gameCode } = useParams();
  const isRoulette = isMobile && (
        gameCode === 'roulette11' ||
        gameCode === 'roulette12' ||
        gameCode === 'roulette13'
    );
  /**
   * Local countdown
   */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 0) return 0;

        if (delayNextTickRef.current) {
          delayNextTickRef.current = false;
          return prev;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /**
   * API sync (NO JUMP)
   */
  useEffect(() => {
    const apiTime = Number(lastOdds?.autotime);
    if (!apiTime || apiTime <= 0) return;

    // First initialization
    if (lastApiTimeRef.current === null) {
      setCounter(apiTime);
      lastApiTimeRef.current = apiTime;
      return;
    }

    // ✅ NEW ROUND → only when counter is 0
    if (counter === 0 && apiTime > lastApiTimeRef.current) {
      setCounter(apiTime);
      delayNextTickRef.current = false;
      lastApiTimeRef.current = apiTime;
      return;
    }

    const diff = apiTime - counter;
    lastApiTimeRef.current = apiTime;

    // API ahead → slow down local timer
    if (diff > 0) {
      delayNextTickRef.current = true;
      return;
    }

    // API behind → speed up once
    if (diff < -1) {
      setCounter((prev) => Math.max(prev - 1, 0));
    }
  }, [lastOdds?.autotime]);

  /**
   * Digits
   */
  const tens = Math.floor(counter / 10);
  const ones = counter % 10;

  return (
    <div className={`clock clock2digit flip-clock-wrapper ${isRoulette ? 'roulette-mobile' : ''}`}>
      {[tens, ones].map((digit, i) => (
        <ul className="flip play" key={i}>
          <li className="flip-clock-active">
            <a href="#">
              <div className="up">
                <div className="shadow" />
                <div className="inn">{digit}</div>
              </div>
              <div className="down">
                <div className="shadow" />
                <div className="inn">{digit}</div>
              </div>
            </a>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default CasinoTimer;