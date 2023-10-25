import { useEffect, useMemo, useRef, useState } from 'react';

import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import zoomAnimationStyles from '@/assets/styles/animations/zoom-in-from-left.module.scss';
import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import HorizontalScrollLayout from '@/components/layouts/HorizontalScrollLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import AudioPlayer from '@/components/player/audio/AudioPlayer';
import Preloader from '@/components/ui/Preloader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import MarketplaceAudioPlayerHook from '@/hooks/marketplace/MarketplaceAudioPlayerHook';
import LightningIcon from '@/icons/project/state/LightningIcon';
import FundingNowCard from '@/pages/main-projects/MainProjectsPageWrapper/_components/FundingNow/_components/FundingNowCard';
import ScrollService from '@/services/scroll/ScrollService';
import { marketplaceGetPlayListFundingNowUtil } from '@/utils/marketplace/marketplacePlayerUtil';

import styles from './styles.module.scss';

function FundingNow({ events, getEventsInProcessFromApi }) {
  const fundingNowRef = useRef(null);
  const timer = useRef(null);

  const [isReady, setIsReady] = useState(getEventsInProcessFromApi);

  const [audioPlaylist, setAudioPlaylist] = useState([]);

  const audioEvents = useMemo(() => events.filter(({ target: { tracks = [] } }) => tracks.length > 0), [events]);

  const audioPlaylistFunction = (itemId) => {
    const foundActivePlayingGoods = audioEvents.find(({ id }) => id === itemId);

    if (!foundActivePlayingGoods) {
      return [];
    }

    const { target: { tracks = [] } = {} } = foundActivePlayingGoods;

    const updatedPlaylist = marketplaceGetPlayListFundingNowUtil({ tracks });

    setAudioPlaylist(updatedPlaylist);

    return updatedPlaylist;
  };

  const { isPlaying, playingTime, activePlayingItemId, activePlayingTrack, onPause, onPlay, onNextTrack, onChangePlayingTime } =
    MarketplaceAudioPlayerHook({ playlist: audioPlaylist });

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.FUNDING_NOW,
      RoutePathsConstants.MAIN,
      fundingNowRef
    );

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!getEventsInProcessFromApi) {
      return;
    }

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setIsReady(true);
      clearTimeout(timer.current);
    }, 200);
  }, [getEventsInProcessFromApi]);

  return (
    <SiteWrapperLayout name={styles.fundingNow} direction="column">
      <div className={styles.fundingNow__title} ref={fundingNowRef}>
        <SecondaryTitle title={TitlesConstants.LIVE_NOW} icon={<LightningIcon color="REJECTED" />} />
      </div>
      <div className={styles.fundingNow__wrapper}>
        <Preloader isShown={events.length === 0 && !isReady} id="funding-now" withOffsets={false} opacity={1} withBgColor />
        <AudioPlayer
          isPlaying={isPlaying}
          playList={audioPlaylist}
          activePlayingTrack={activePlayingTrack}
          activePlayingItemId={activePlayingItemId}
          nextTrack={onNextTrack}
          timeUpdate={onChangePlayingTime}
          onPlay={onPlay}
          onPause={onPause}
        />
        <div className={styles.fundingNow__container}>
          <HorizontalScrollLayout className={styles.fundingNow__horizontalScrollLayout}>
            <TransitionGroup className={styles.fundingNow__list} enter={isReady}>
              {events.map((event) => {
                const { id } = event;

                return (
                  <CSSTransition
                    key={`zoom-in-from-left-animation-${id}`}
                    timeout={200}
                    classNames={{
                      enter: zoomAnimationStyles.zoomInFromLeftAnimationEnter,
                      enterActive: zoomAnimationStyles.zoomInFromLeftAnimationEnter_active,
                    }}
                  >
                    <FundingNowCard
                      {...event}
                      itemRestProps={{
                        playList: audioPlaylistFunction,
                      }}
                      itemInnerProps={{
                        playButton: {
                          isPlaying,
                          activePlayingItemId,
                          playingTime,
                          playList: audioPlaylist,
                          onClickPlay: onPlay,
                          onClickPause: onPause,
                        },
                      }}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </HorizontalScrollLayout>
        </div>
      </div>
    </SiteWrapperLayout>
  );
}

export default connect((state) => ({
  events: state.FundingNowEventsReducer.events,
  getEventsInProcessFromApi: state.FundingNowEventsReducer.getEventsInProcessFromApi,
}))(FundingNow);
