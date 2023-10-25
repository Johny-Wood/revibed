import { Fragment, useMemo } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import CheckBox from '@/components/ui/inputs/CheckBox';
import Select from '@/components/ui/selects/Select';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowPointerIcon from '@/icons/arrows/ArrowPointerIcon';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

import styles from './styles.module.scss';

const clickHandler = (column) => {
  const handler = column.onClick;

  if (handler) {
    handler(column);
  }
};

const renderCheckBox = ({ key, checked }, { onClick }) => (
  <CheckBox
    id={`${key}-select-all`}
    borderRadius
    checked={checked}
    dark
    onChange={() => {
      onClick(key);
    }}
  />
);

const renderText = ({ name, icon: Icon }) => (
  <span className="i-f_y-center">
    {name}
    {!!Icon && (
      <>
        ,
        <Icon />
      </>
    )}
  </span>
);

const renderSort = (column) => {
  const { name, order, icon } = column;

  return (
    <span className="f-y-center" onClick={() => clickHandler(column)}>
      <ArrowPointerIcon color={order ? '#1a1a1a' : 'var(--color__gray-1)'} />
      {renderText({ name, icon })}
    </span>
  );
};

const renderHeaderElement = (column) => {
  const { type, onClick = () => {} } = column;

  switch (type) {
    case 'CHECKBOX': {
      return renderCheckBox(column, { onClick });
    }
    case 'SORT': {
      return renderSort(column);
    }
    default: {
      return renderText(column);
    }
  }
};

const renderHeader = ({
  columns,
  tableName,
  isNotDesktop,
  elementClassName,
  textClassName,
  elementDESCClassName,
  elementASCClassName,
  elementSORTClassName,
}) =>
  columns.map((column) => {
    const {
      key,
      render,
      align,
      minWidth,
      maxWidth,
      grow,
      order: { value: orderValue = 'disabled' } = {},
      type,
      hideOnMobile,
    } = column;

    if (hideOnMobile && isNotDesktop) {
      return null;
    }

    let generateSortClass = '';

    if (orderValue.indexOf('DESC') !== -1) {
      generateSortClass = 'DESC';
    } else if (orderValue.indexOf('ASC') !== -1) {
      generateSortClass = 'ASC';
    }

    return (
      <Fragment key={`${tableName}-header-item-${key}`}>
        {render ? (
          column.render(column)
        ) : (
          <div
            className={classNames(
              elementClassName,
              align && `f-x-${align}`,
              type === 'SORT' && elementSORTClassName,
              generateSortClass === 'DESC' && elementDESCClassName,
              generateSortClass === 'ASC' && elementASCClassName
            )}
            style={{
              minWidth,
              maxWidth,
              flexBasis: maxWidth,
              flexGrow: grow,
            }}
          >
            <span className={textClassName}>{renderHeaderElement(column)}</span>
          </div>
        )}
      </Fragment>
    );
  });

function DefaultHeaderRender({
  tableName,
  columns = [],
  headerColumns,
  withFieldName,
  withHeaderOnly,
  withHeader = true,
  className,
  wrapperClassName,
  elementClassName,
  textClassName,
  elementDESCClassName,
  elementASCClassName,
  elementSORTClassName,
}) {
  const { isNotDesktop } = ViewportHook();

  const withoutSort = columns.findIndex(({ type: typeFiled }) => typeFiled === 'SORT') === -1;

  const shownHeader =
    (withHeader || withHeaderOnly) &&
    ((headerColumns.length !== headerColumns.filter(({ hideOnMobile }) => hideOnMobile).length &&
      isNotDesktop &&
      !withFieldName) ||
      !isNotDesktop);

  const headerColumnsWithParams = cloneDeep(columns).map((column) => {
    const { width, minWidth } = column;

    let finishMaxWidth = width || 'none';
    let finishMinWidth = minWidth || 'auto';

    if (width && typeof width !== 'string') {
      finishMaxWidth = covertPx2RemUtil(width);
    }

    if (minWidth && typeof minWidth !== 'string') {
      finishMinWidth = covertPx2RemUtil(minWidth);
    }

    return {
      ...column,
      minWidth: finishMinWidth,
      maxWidth: finishMaxWidth,
    };
  });

  const {
    name: selectedOrderName,
    items: selectedOrderItems = [],
    order: { value: selectedOrderValue } = {},
  } = useMemo(() => headerColumnsWithParams.find(({ order: { value } = {} }) => value) || {}, [headerColumnsWithParams]);

  const sortSelected = useMemo(
    () =>
      selectedOrderItems
        .filter(({ value: foundValue }) => foundValue === selectedOrderValue)
        .map((item) => ({
          ...item,
          sectionName: selectedOrderName,
        })),
    [selectedOrderItems, selectedOrderValue, selectedOrderName]
  );

  if (!shownHeader && withoutSort) {
    return null;
  }

  return (
    <>
      {!withoutSort && (
        <MobileLayout>
          <Select
            label="Sort"
            multiSelect={false}
            optionListPositionX="right"
            maxHeight={9000}
            isSort
            toggled
            onSelectItem={(item, sectionName) => {
              const { onClick, keyItem, items } = headerColumnsWithParams.find(({ name }) => name === sectionName) || {};

              onClick({
                keyItem,
                items,
                order: item,
                toggle: true,
              });
            }}
            selected={sortSelected}
            clear={isEmpty(sortSelected)}
            options={headerColumnsWithParams
              .filter(({ type }) => type === 'SORT')
              .map(({ name, property, items }) => ({
                sectionName: name,
                property,
                items,
              }))}
            className={styles.tableSelect}
          />
        </MobileLayout>
      )}
      {shownHeader && (
        <div className={classNames(className)}>
          <div className={classNames(wrapperClassName)}>
            {withHeaderOnly ? (
              renderHeader({
                columns: headerColumnsWithParams,
                tableName,
                isNotDesktop,
                elementClassName,
                textClassName,
                elementDESCClassName,
                elementASCClassName,
                elementSORTClassName,
              })
            ) : (
              <DesktopLayout>
                {renderHeader({
                  columns: headerColumnsWithParams,
                  tableName,
                  isNotDesktop,
                  elementClassName,
                  textClassName,
                  elementDESCClassName,
                  elementASCClassName,
                  elementSORTClassName,
                })}
              </DesktopLayout>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DefaultHeaderRender;
