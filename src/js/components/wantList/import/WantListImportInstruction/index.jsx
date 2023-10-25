import { Fragment } from 'react';

import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import LinkRoute from '@/components/ui/links/LinkRoute';
import WantListImportInstructionStep from '@/components/wantList/import/WantListImportInstruction/_components/WantListImportInstructionStep';
import { CommonHeadConstants } from '@/constants/common/head';
import { RoutePathsConstants } from '@/constants/routes/routes';
import InstructionArrowIcon from '@/icons/InstructionArrowIcon';

import styles from './styles.module.scss';

const STEPS = [
  {
    id: 1,
    title: 'import<br/>a wantlist',
    text: 'Add an&nbsp;existing wantlist with the records that you really need in&nbsp;your collection.',
    videoLink: 'https://www.youtube.com/embed/0G9mVUqz9U8',
  },
  {
    id: 2,
    title: 'connect your<br/>telegram bot',
    text: 'Connect our Telegram bot and get notified about your most wanted records the moment',
    videoLink: 'https://www.youtube.com/embed/8FwcUjESzeE',
  },
  {
    id: 3,
    title: 'GROW<br/>YOUR COLLECTION',
    text: '<b>Start a&nbsp;project</b> and get a&nbsp;digital archive copy of&nbsp;those treasured tunes while others are still sleeping.',
    videoLink: '',
  },
];

function WantListImportInstruction() {
  return (
    <div className={styles.wantListImportInstruction}>
      <h1 className={styles.wantListImportInstruction__title}>My Wantlist</h1>
      <div className={styles.wantListImportInstruction__intro}>
        The {CommonHeadConstants.SITE_NAME} Wantlist is&nbsp;a&nbsp;tool* that continuously tracks the Discogs database and
        marketplace for releases to&nbsp;add to&nbsp;your collection.
      </div>
      <LinkRoute
        className={styles.wantListImportInstruction__button}
        href={RoutePathsConstants.WANTLIST_TOOL}
        text="Learn more about our Wantlist Tool"
        type="button"
        transparent
        rounded
      />
      <div className={styles.wantListImportInstruction__steps}>
        {STEPS.map(({ id, title, text, videoLink }, idx) => (
          <Fragment key={`want-list-import-instruction-steps-${id}`}>
            <WantListImportInstructionStep id={id} title={title} text={text} videoLink={videoLink} />
            <DesktopLayout>{idx !== STEPS.length - 1 && <InstructionArrowIcon />}</DesktopLayout>
          </Fragment>
        ))}
      </div>
      <LinkRoute
        className={styles.wantListImportInstruction__button}
        href={RoutePathsConstants.PROJECTS}
        text="Discover our music projects"
        type="button"
        transparent
        rounded
      />
    </div>
  );
}

export default WantListImportInstruction;
