import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import HelpBlock from '@/components/common/HelpBlock';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import LinkDefault from '@/components/ui/links/LinkDefault';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonHeadConstants } from '@/constants/common/head';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';
import type { RootState } from '@/js/redux/reducers';
import RightsholdersWrapperDashedBlock from '@/pages/rightsholders/RightsholdersWrapper/_components/RightsholdersWrapperDashedBlock';
import RightsholdersWrapperDisclaimer from '@/pages/rightsholders/RightsholdersWrapper/_components/RightsholdersWrapperDisclaimer';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.RIGHTSHOLDERS;

type PropsFromRedux = ConnectedProps<typeof connector>;

function RightsholdersWrapper({ variablesList: { emails: { CONTACT = '' } = {} } = {} }: PropsFromRedux) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <SiteWrapperLayout>
        <div className={classNames(styles.RightsholdersWrapper)}>
          <RightsholdersWrapperDisclaimer />
          <p>
            Welcome to&nbsp;{CommonHeadConstants.SITE_NAME}, the platform dedicated to&nbsp;the preservation of&nbsp;rare and
            vintage recordings!
          </p>
          <p>
            Our project involves the disclosure of&nbsp;rare CDs, vinyls or&nbsp;cassettes, by&nbsp;crowdfunding their
            digitization, thus ensuring that these musical creations are not lost in&nbsp;time.
          </p>
          <p>
            As&nbsp;part of&nbsp;our commitment to&nbsp;this endeavor, we&nbsp;have made every effort within our reasonable means
            to&nbsp;locate and identify the rights holders of&nbsp;these works, performances, and recordings. Our mission
            is&nbsp;rooted in&nbsp;respect for both the authors and artists who created and interpreted these musical
            masterpieces, and the publishers and master owners who invested in&nbsp;the divulgation of&nbsp;these creations.
          </p>
          <p>
            Regarding the rights of&nbsp;authors, composers, and music publishers, we&nbsp;are proud to&nbsp;have entered into
            an&nbsp;agreement with the Belgian collective management organization SABAM for maximum safeguarding thereof.
          </p>
          <RightsholdersWrapperDashedBlock>
            If&nbsp;you are the author, composer or&nbsp;publisher of&nbsp;any of&nbsp;the works embodied by&nbsp;the recordings,
            and you have any questions about this, please send an&nbsp;e-mail to&nbsp;
            <b>
              <LinkDefault href={`mailto:${CONTACT}`} text={CONTACT} className="c-blue t-semi-bold" />
            </b>
            .
          </RightsholdersWrapperDashedBlock>
          <p>
            Due to&nbsp;the rarity (and/or age) of&nbsp;the materials involved, identifying the master owners has proven extremely
            challenging. We&nbsp;have undertaken extensive research to&nbsp;locate the master owners, yet despite our best
            efforts, we&nbsp;may have been unable to&nbsp;establish contact with all parties concerned. We&nbsp;had to&nbsp;accept
            that by&nbsp;disclosing orphan and out-of-commerce works, we&nbsp;did not tread the easiest path.
          </p>
          <RightsholdersWrapperDashedBlock>
            If&nbsp;you are the master owner of&nbsp;any of&nbsp;the recordings or&nbsp;believe you may exercise rights
            in&nbsp;that capacity with respect to&nbsp;the recordings featured on&nbsp;our platform, we&nbsp;strongly encourage
            and invite you to&nbsp;
            <LinkRoute href={RoutePathsConstants.CONTACT_US} text="contact&nbsp;us" className="c-blue t-semi-bold" />.
            We&nbsp;have provided a&nbsp;designated&nbsp;
            <LinkRoute href={RoutePathsConstants.RIGHTSHOLDERS_FORM} text="form" className="c-blue t-semi-bold" />
            &nbsp;for you to&nbsp;assert your master ownership.
          </RightsholdersWrapperDashedBlock>
          <p>
            By&nbsp;submitting the form, you confirm your status as&nbsp;the rightful master owner or&nbsp;an&nbsp;authorized
            representative acting on&nbsp;their behalf. You grant&nbsp;us permission to&nbsp;carefully review the information
            provided and take appropriate actions, which may involve offering proper attribution, removing the recording(s),
            or&nbsp;pursuing a&nbsp;mutually agreeable arrangement.
          </p>
          <p>
            We&nbsp;understand the value of&nbsp;preserving musical heritage and respecting intellectual property rights. This
            disclaimer is&nbsp;a&nbsp;sincere expression of&nbsp;our firm intentions.
          </p>
          <p>
            If, alternatively, you are not a&nbsp;rights holder, but simply have interest or&nbsp;questions regarding our
            endeavors, please do&nbsp;not hesitate to&nbsp;send&nbsp;us an&nbsp;email at&nbsp;
            <b>
              <LinkDefault href={`mailto:${CONTACT}`} text={CONTACT} className="c-blue t-semi-bold" />
            </b>
            .
          </p>
        </div>
      </SiteWrapperLayout>
      <HelpBlock />
    </BaseWebsiteLayout>
  );
}

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(RightsholdersWrapper);
