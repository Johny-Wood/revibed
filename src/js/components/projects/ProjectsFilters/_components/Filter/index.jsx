import { forwardRef, useMemo, useState } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { Collapse } from 'react-collapse';
import FlipMove from 'react-flip-move';

import TranslateText from '@/components/common/TranslateText';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import CustomInputRange from '@/components/ui/inputs/CustomInputRange';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import CloseIcon from '@/icons/control/close/CloseIcon';

import styles from './styles.module.scss';

const SHOW_ITEMS_COUNT = 5;

const Filter = ({
  defaultOpened,
  innerRef,
  categoryName,
  items = [],
  type,
  withoutShowMore,
  categoryId,
  range: { valueRange, valueInitRange, onChangeRange, onSave } = {},
  changeFilter: changeFilterCallback,
  multi = true,
  filtersRef,
  setSaveFilterTop,
  removeCategoryFilter,
  activeFilterId,
  filterProperty: { pathName } = {},
  disabled: mainDisabled,
}) => {
  const [isOpened, setIsOpened] = useState(defaultOpened);
  const [showedMore, setShowedMore] = useState(false);

  const withItems = useMemo(() => items.length > 0 || type === 'range', [items, type]);

  const toggleFilter = () => {
    setIsOpened(!isOpened);
  };

  const toggleShowed = () => {
    setShowedMore(!showedMore);
  };

  const changeFilter = (newCategoryId, newItems) => {
    changeFilterCallback({
      categoryId: newCategoryId,
      items: newItems,
      multi,
    });
  };

  const getFilterTop = (e) => {
    const element = e.currentTarget || e.current;

    const filtersBlockTop = filtersRef.current.getBoundingClientRect().top;
    const filterElementTop = element.getBoundingClientRect().top;

    const top = filterElementTop - filtersBlockTop - 20 + element.clientHeight / 2;

    setSaveFilterTop(top);
  };

  const renderFilterList = (newCategoryId) =>
    items
      .slice(0, !showedMore && !withoutShowMore && items.length > SHOW_ITEMS_COUNT ? SHOW_ITEMS_COUNT : items.length)
      .map((item) => {
        const { id, name, count, disabled: itemDisabled } = item;
        const disabled = mainDisabled || itemDisabled;

        return (
          <div
            key={`filter=${name}-${id}`}
            className={classNames([
              styles.filter__listItem,
              disabled && styles.filter__listItem_disabled,
              (activeFilterId || {})[id] && styles.filter__listItem_active,
            ])}
            onClick={(e) => {
              if (disabled) {
                return;
              }

              getFilterTop(e);
              changeFilter(newCategoryId, [
                {
                  ...item,
                  pathName,
                },
              ]);
            }}
          >
            <span className={styles.filter__name}>{name}</span>
            <span className={styles.filter__value}>{count}</span>
          </div>
        );
      });

  const renderRemoveCategoryFilter = () => (
    <TransitionLayout isShown={!isEmpty(activeFilterId)} duration={300}>
      <ButtonIcon
        type="button_string"
        className={styles.filter__buttonResetCategoryFilter}
        onClick={() => {
          removeCategoryFilter(categoryId);
        }}
      >
        <span className="text">Reset</span>
        <CloseIcon />
      </ButtonIcon>
    </TransitionLayout>
  );

  const renderTypeFilter = () => {
    switch (type) {
      case 'range':
        return (
          <div className={styles.filter__list}>
            <CustomInputRange
              value={valueRange}
              valueInitRange={valueInitRange}
              onChange={onChangeRange}
              categoryId={categoryId}
              onSave={onSave}
              disabled={mainDisabled}
              setSaveFilterTop={getFilterTop}
            />
            <div className={styles.filter__filterCategoryButtons}>{renderRemoveCategoryFilter()}</div>
          </div>
        );
      case 'list':
      default: {
        return (
          <>
            <ScrollbarLayout
              height={items.length < SHOW_ITEMS_COUNT ? undefined : showedMore ? 200 : 125}
              contentLength={items.length}
            >
              <FlipMove className={styles.filter__list} enterAnimation="fade" leaveAnimation="fade">
                {renderFilterList(categoryId)}
              </FlipMove>
            </ScrollbarLayout>
            <div className={styles.filter__filterCategoryButtons}>
              {!withoutShowMore && items.length > SHOW_ITEMS_COUNT && (
                <Button
                  type="button_string"
                  text={`Show ${showedMore ? 'less' : 'more'}...`}
                  className={styles.filter__buttonFilterShowMore}
                  disabled={mainDisabled}
                  onClick={toggleShowed}
                />
              )}
              {renderRemoveCategoryFilter()}
            </div>
          </>
        );
      }
    }
  };

  return (
    <div ref={innerRef} className={classNames([styles.filter, (mainDisabled || !withItems) && styles.filter_disabled])}>
      <div className={styles.filter__header} onClick={() => withItems && toggleFilter()}>
        <span className={styles.filter__category}>
          <TranslateText translateKey={categoryName} />
        </span>
        {withItems && <ArrowIcon isOpened={isOpened} />}
      </div>
      <div className={styles.filter__collapse}>
        {withItems && (
          <Collapse
            isOpened={isOpened}
            initialStyle={{
              height: isOpened ? 'auto' : 0,
              overflow: isOpened ? 'initial' : 'hidden',
            }}
          >
            {renderTypeFilter()}
          </Collapse>
        )}
      </div>
    </div>
  );
};

export default forwardRef((props, ref) => <Filter innerRef={ref} {...props} />);
