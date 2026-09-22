import React from 'react'
import { CustomLink } from './custom-link'
import ISport from '../../../models/ISport'

const GameTabs = (props: any) => {

const SPORT_SEQUENCE: number[] = [4, 1, 2, 8, 10, 65, 15,68, 18,22,59,57,6,3,58,11,19,9,40,52,66];

const orderedSports: ISport[] = React.useMemo(() => {
  const sports = props?.sportListState?.sports ?? [];

  return [...sports].sort((a: ISport, b: ISport) => {
    const aIndex = SPORT_SEQUENCE.indexOf(Number(a.sportId));
    const bIndex = SPORT_SEQUENCE.indexOf(Number(b.sportId));

    return (
      (aIndex === -1 ? 999 : aIndex) -
      (bIndex === -1 ? 999 : bIndex)
    );
  });
}, [props?.sportListState?.sports]);


  return (
    <div className='horizontal-scorller game-tab-container mb-1'>
      <ul role='tablist' id='home-events' className='nav nav-tabs'>
        {orderedSports.map((sport: ISport, index: number) => {
          const isActive = props.sportId
            ? props.sportId == sport.sportId
            : index === 0;

          return (
            <li key={sport._id} className="nav-item">
              <CustomLink
                to={`/match/${sport.sportId}`}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {sport.name}
              </CustomLink>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default React.memo(GameTabs)