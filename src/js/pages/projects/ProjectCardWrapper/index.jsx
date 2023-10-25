import { useEffect, useMemo, useRef, useState } from 'react';

import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import ProjectCard from '@/components/project/ProjectCard';
import Preloader from '@/components/ui/Preloader';
import { CommonHeadConstants } from '@/constants/common/head';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import NextRouter from '@/services/NextRouter';
import { setCookieUtil } from '@/utils/cookiesUtil';
import { createMetaImageUtil } from '@/utils/coverUtils';
import { releaseFormatsUtil, releaseGenresUtil } from '@/utils/project/projectDetailsUtil';
import { createMetaTitleUtil } from '@/utils/titleUtils';

import styles from './styles.module.scss';

function ProjectCardWrapper({
  projectCardId,
  tab,
  event,
  projectCards,
  getProjectCardInProcess,
  referralInfo: { isActive: referralInfoIsActive } = {},
}) {
  const updateComponentTimeOut = useRef(null);

  const { isNotDesktop } = ViewportHook();

  const [activeProjectCardId, setActiveProjectCardId] = useState(projectCardId);

  useEffect(() => {
    const { router: { router: { query } = {} } = {} } = NextRouter.getInstance();
    const referralCode = query['referral-code'];

    if (referralCode && referralInfoIsActive) {
      setCookieUtil(CommonVariablesConstants.REFERRAL_CODE, referralCode, {
        expires: new Date(2222, 0),
      });
    }

    return () => {
      clearTimeout(updateComponentTimeOut.current);
    };
  }, [referralInfoIsActive]);

  useEffect(
    () => () => {
      clearTimeout(updateComponentTimeOut.current);
    },
    []
  );

  useEffect(() => {
    if (projectCardId !== activeProjectCardId) {
      clearTimeout(updateComponentTimeOut.current);

      updateComponentTimeOut.current = setTimeout(() => {
        setActiveProjectCardId(projectCardId);
      }, 200);
    }
  }, [activeProjectCardId, projectCardId]);

  const projectCard = useMemo(() => (projectCards[0] || {})[projectCardId] || {}, [projectCards, projectCardId]);
  const {
    title,
    covers = [],
    releaseDetails: { year, formats = [], genres = [], country: { title_en: countryName } = {} } = {},
  } = projectCard;

  const metaTitle = useMemo(
    () =>
      `${title || CommonMessagesConstants.PREORDER}${year ? createMetaTitleUtil({ year }) : ''} - ${
        CommonHeadConstants.SITE_NAME
      }`,
    [title, year]
  );
  const metaDescription = useMemo(
    () =>
      `${title}. ${formats.length > 0 ? `${releaseFormatsUtil({ formats })}. ` : ''}${
        genres.length > 0 ? `${releaseGenresUtil({ genres })}. ` : ''
      }${countryName ? `${countryName}. ` : ''}Discover artists and albums similar to this one in ${
        CommonHeadConstants.SITE_NAME
      }.`,
    [title, formats, genres, countryName]
  );

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
        description: metaDescription,
        withSiteName: false,
        social: {
          url: `${CommonMessagesConstants.PREORDER} - ${CommonHeadConstants.SITE_NAME}`,
          title: metaTitle,
          description: metaDescription,
          image: createMetaImageUtil({ covers }),
        },
      }}
      pageName={styles.projectCardPage}
      shownBanners
    >
      <SiteWrapperLayout withYPadding={false}>
        <Preloader
          id="page-project"
          className="page-project-preloader"
          isShown={getProjectCardInProcess}
          opacity={1}
          duration={400}
        />
        <WrapperContainerLayout direction="column">
          {!isEmpty(projectCard) && !getProjectCardInProcess && activeProjectCardId === projectCardId && (
            <ProjectCard
              tab={tab}
              event={event}
              isNotDesktop={isNotDesktop}
              projectCardId={+projectCardId}
              projectCard={projectCard}
            />
          )}
        </WrapperContainerLayout>
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  projectCards: state.ProjectCardReducer.projectCards,
  getProjectCardInProcess: state.ProjectCardReducer.getProjectCardInProcess,
  referralInfo: state.PromoReducer.promoActions.REFERRAL_PROGRAM,
}))(ProjectCardWrapper);
