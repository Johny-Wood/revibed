import { useEffect } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { TabletLayout } from '@/components/layouts/ViewportLayouts';
import Button from '@/components/ui/buttons/Button';
import { loadPopularGenresAndStylesRequestAction } from '@/redux-actions/projects/dataForProjectActions';

import styles from './styles.module.scss';

function PopularGenresAndStyles({
  popularGenresAndStyles = [],
  selectedStyles = [],
  changeStyles,
  loadPopularGenresAndStylesRequest,
}) {
  useEffect(() => {
    loadPopularGenresAndStylesRequest();
  }, [loadPopularGenresAndStylesRequest]);

  const disablePopularItem = ({ id, type }) =>
    selectedStyles.findIndex(({ id: foundId, type: foundType }) => foundId === id && foundType === type) > -1;

  const selectStyle = ({ id, name, type }) => {
    const selectedIdx = selectedStyles.findIndex(({ id: foundId, type: foundType }) => foundId === id && foundType === type);

    if (selectedIdx > -1 || disablePopularItem({ id, type })) {
      return;
    }

    changeStyles([...selectedStyles, { id, name, type }]);
  };

  return (
    <div className={classNames(styles.stylesPopular, 'm-bottom-5')}>
      <TransitionSwitchLayout isShown={popularGenresAndStyles.length > 0}>
        <div className={styles.stylesPopular__content}>
          <TabletLayout>
            <div className={styles.stylesPopular__label}>Popular:</div>
          </TabletLayout>
          <div className={styles.stylesPopular__list}>
            {popularGenresAndStyles.map(({ id, name, type }) => (
              <Button
                key={`styles-popular-${id}`}
                type="button_string"
                className={classNames(
                  styles.stylesPopular__item,
                  disablePopularItem({
                    id,
                    type,
                  }) && styles.stylesPopular__item_disabled,
                  globalStyles.underlineDashed
                )}
                text={name}
                onClick={() => selectStyle({ id, name, type })}
                disabled={disablePopularItem({ id, type })}
              />
            ))}
          </div>
        </div>
      </TransitionSwitchLayout>
    </div>
  );
}

export default connect(
  (state) => ({
    popularGenresAndStyles: state.DataForProjectReducer.popularGenresAndStyles,
  }),
  (dispatch) => ({
    loadPopularGenresAndStylesRequest: () => loadPopularGenresAndStylesRequestAction()(dispatch),
  })
)(PopularGenresAndStyles);
