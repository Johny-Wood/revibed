import { Component } from 'react';

import { Collapse } from 'react-collapse';

import MobilePage from '@/components/common/MobilePage';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import Contributor from '@/components/project/_components/Contributor';
import Button from '@/components/ui/buttons/Button';

import styles from './styles.module.scss';

const SHOW_ITEMS_COUNT = 10;
const ITEM_HEIGHT = 71;

const renderContributorItem = (contributor) => {
  const { name, id, avatarProps, ...restContributor } = contributor;

  return (
    <div className={styles.projectCardContributors__item} key={`contributors-list-contributor-${name}-${id}`}>
      <Contributor
        classNameNickName={styles.nickname__name}
        contributor={{ id, name, ...restContributor }}
        avatar={avatarProps}
        isRoute
        withFollow
        withFollowers
      />
    </div>
  );
};

const renderContributorsFirst = (contributors) =>
  contributors.slice(0, SHOW_ITEMS_COUNT).map((contributor) => renderContributorItem(contributor));

const renderContributors = (contributors, showedMore) =>
  contributors
    .slice(0, !showedMore ? SHOW_ITEMS_COUNT : contributors.length)
    .map((contributor) => renderContributorItem(contributor));

class ProjectCardContributors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showedMore: false,
    };
  }

  render() {
    const { contributors, title, showMoreText = 'contributors', isNotDesktop } = this.props;
    const { showedMore } = this.state;

    const contributorsCount = contributors.length;
    const hasShowMore = contributorsCount > SHOW_ITEMS_COUNT;

    let systemContributors = 0;
    let systemContributorsShowMore = 0;
    let userContributors = 0;
    let userContributorsShowMore = 0;

    contributors.forEach(({ type }, idx) => {
      if (type === 'system') {
        if (idx < SHOW_ITEMS_COUNT) {
          systemContributors += 1;
        }
        if (idx < SHOW_ITEMS_COUNT + 2) {
          systemContributorsShowMore += 1;
        }
      } else {
        if (idx < SHOW_ITEMS_COUNT) {
          userContributors += 1;
        }

        if (idx < SHOW_ITEMS_COUNT + 2) {
          userContributorsShowMore += 1;
        }
      }
    });

    const scrollHeight =
      hasShowMore && showedMore
        ? userContributorsShowMore * ITEM_HEIGHT + systemContributorsShowMore * 70
        : userContributors * ITEM_HEIGHT + systemContributors * 70;

    if (contributorsCount === 0) {
      return null;
    }

    return (
      <div className={styles.projectCardContributors}>
        {title && (
          <h3 className={styles.projectCardContributors__title}>
            <b>{title}</b>
          </h3>
        )}
        <div className={styles.projectCardContributors__list}>
          <MobilePage
            closeMobilePage={() => {
              this.setState({
                showedMore: false,
              });
            }}
            isShown={showedMore}
          >
            {renderContributors(contributors, showedMore)}
          </MobilePage>
          <DesktopLayout>
            <Collapse isOpened>
              <ScrollbarLayout
                className={styles.projectCardContributors__content}
                height={scrollHeight}
                contentLength={contributorsCount}
              >
                {renderContributors(contributors, showedMore)}
              </ScrollbarLayout>
            </Collapse>
          </DesktopLayout>
          <MobileLayout>{renderContributorsFirst(contributors)}</MobileLayout>
        </div>
        {hasShowMore && (
          <Button
            type="button_string"
            className={styles.projectCardContributors__showMore}
            text={`Show ${!showedMore || isNotDesktop ? 'all' : 'less'} ${showMoreText.toLowerCase()}`}
            onClick={() => {
              this.setState({
                showedMore: !showedMore,
              });
            }}
          />
        )}
      </div>
    );
  }
}

export default ProjectCardContributors;
