import classNames from 'classnames';

import BackButton from '@/components/common-ui/buttons/BackButton';
import RightsholdersForm from '@/components/forms/RightsholdersForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.RIGHTSHOLDERS_FORM;

function RightsholdersFormWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <SiteWrapperLayout>
        <div className={classNames(styles.RightsholdersFormWrapper)}>
          <BackButton hrefDefault={RoutePathsConstants.RIGHTSHOLDERS} />
          <h1 className={classNames(styles.RightsholdersFormWrapper__title)}>{metaTitle}</h1>
          <RightsholdersForm />
        </div>
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default RightsholdersFormWrapper;
