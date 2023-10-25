import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import CollapseSection from '@/components/primary/CollapseSection';
import ActiveYoutubeTitleAfterContent from '@/components/project/_components/ProjectCardVideos/_components/ProjectCardVideosList/_components/ActiveYoutubeTitleAfterContent';
import { changeOrderProjectVideosRequestAction } from '@/redux-actions/project/projectCardActions';
import { appendFormUtil } from '@/utils/form/formUtils';
import { getYouTubeLinkIdUtil } from '@/utils/linkUtils';

import styles from './styles.module.scss';

function ProjectCardVideosList({
  youtubeLinks = [],
  activeYoutubeVideo: { id: activeYoutubeId, title: activeYoutubeTitle, link: activeYoutubeLink } = {},
  onClick,
  updateYoutubeLinks,
  changeOrderProjectVideos,
  projectCardId,
  withUpdateOrder,
}) {
  const foundActiveIndex = youtubeLinks.findIndex(({ id }) => id === activeYoutubeId) + 1;

  const onSortEnd = (updatedYoutubeLinks) => {
    if (isEqual(youtubeLinks, updatedYoutubeLinks) || (!withUpdateOrder && updatedYoutubeLinks.length === 0)) {
      return;
    }

    const form = appendFormUtil({
      fieldsForm: [
        {
          name: 'youtubeLinksOrder',
          value: updatedYoutubeLinks.map(({ id }) => id),
        },
      ],
    });

    updateYoutubeLinks(updatedYoutubeLinks);

    changeOrderProjectVideos({ form, projectCardId });
  };

  return (
    <div className={styles.projectCardVideoList}>
      <CollapseSection
        className={styles.collapseSection}
        categoryClassName={styles.category}
        titleClassName={classNames(styles.category__name, 't-ellipsis')}
        title={activeYoutubeTitle}
        afterContent={ActiveYoutubeTitleAfterContent}
        afterContentProps={{
          foundActiveIndex,
          youtubeLinks,
        }}
      >
        <div className={styles.projectCardVideoList__scroll}>
          <ScrollbarLayout maxHeight={180}>
            <ReactSortable
              className={styles.projectCardVideoList__content}
              animation={200}
              list={youtubeLinks}
              setList={onSortEnd}
              disabled={!withUpdateOrder}
            >
              {youtubeLinks.map((value, index) => {
                const { id } = value;
                const { title, link } = value;
                const isActive = activeYoutubeLink === link;

                return (
                  <div
                    key={`project-video-${id}`}
                    className={classNames(
                      styles.projectCardVideoList__item,
                      !isActive && styles.projectCardVideoList__item_no_active
                    )}
                    onClick={() => {
                      onClick({ newIdx: index });
                    }}
                  >
                    {withUpdateOrder && <div className={styles.projectCardVideoList__handle} />}
                    <div
                      className={styles.projectCardVideoList__cover}
                      style={{
                        backgroundImage: `url(https://i.ytimg.com/vi/${getYouTubeLinkIdUtil(link)}/mqdefault.jpg)`,
                      }}
                    />
                    {!!title && (
                      <div className={classNames(styles.projectCardVideoList__name, 't-size_12')}>
                        <b>{title}</b>
                      </div>
                    )}
                  </div>
                );
              })}
            </ReactSortable>
          </ScrollbarLayout>
        </div>
      </CollapseSection>
    </div>
  );
}

ProjectCardVideosList.defaultProps = {
  youtubeLinks: [],
  activeYoutubeVideo: {},
  onClick: () => {},
  updateYoutubeLinks: () => {},
  withUpdateOrder: false,
};

ProjectCardVideosList.propTypes = {
  youtubeLinks: PropTypes.array,
  activeYoutubeVideo: PropTypes.object,
  onClick: PropTypes.func,
  updateYoutubeLinks: PropTypes.func,
  withUpdateOrder: PropTypes.bool,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    changeOrderProjectVideos: ({ form, projectCardId }) =>
      changeOrderProjectVideosRequestAction({
        form,
        projectCardId,
        dispatch,
      }),
  })
)(ProjectCardVideosList);
