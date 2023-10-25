import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';

import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowPointerIcon from '@/icons/arrows/ArrowPointerIcon';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

import styles from './styles.module.scss';

const renderItems = ({
  bodyTextClassName,
  elementClassName,
  columnClassName,
  itemComponentsInfo,
  columnsInfo,
  tableName,
  isNotDesktop,
  headerColumns,
  withFieldName,
}) =>
  itemComponentsInfo.map(({ key, component, fieldType, withDirectionArrow, withColor }, idx) => {
    const { hideOnMobile, align, minWidth, width, grow } = columnsInfo[idx];

    if (isNotDesktop && hideOnMobile) {
      return null;
    }

    const { name: columnName = '' } = headerColumns[idx];

    let textAlign = 'left';

    if (align === 'end') {
      textAlign = 'right';
    }
    if (align === 'center') {
      textAlign = 'center';
    }

    let finishMaxWidth = width || 'none';
    let finishMinWidth = minWidth || 'auto';

    if (width && typeof width !== 'string') {
      finishMaxWidth = covertPx2RemUtil(width);
    }

    if (minWidth && typeof minWidth !== 'string') {
      finishMinWidth = covertPx2RemUtil(minWidth);
    }

    return (
      <div
        className={classNames(
          elementClassName,
          fieldType === 'UP' && styles.itemElement_UP,
          fieldType === 'DOWN' && styles.itemElement_DOWN,
          fieldType === 'UP' && withColor && styles.itemElement_UP_text,
          fieldType === 'DOWN' && withColor && styles.itemElement_DOWN_text
        )}
        key={`${tableName}-body-item-${key}`}
        style={{
          minWidth: finishMinWidth,
          maxWidth: finishMaxWidth,
          flexBasis: finishMaxWidth,
          flexGrow: grow,
        }}
      >
        {withFieldName && <div className={classNames(columnClassName)}>{columnName}</div>}
        <div
          className={classNames('f-y-center', bodyTextClassName)}
          style={{
            justifyContent: `flex-${align}`,
            textAlign,
          }}
        >
          {withDirectionArrow && (
            <ArrowPointerIcon
              className={withFieldName ? 'm-left-10' : 'm-right-10'}
              style={{ order: withFieldName ? '1' : '0' }}
              color={fieldType === 'DOWN' ? '#FF0000' : '#009444'}
            />
          )}
          {component}
        </div>
      </div>
    );
  });

const renderItemClass = (rowSettings, idx) =>
  Object.keys(rowSettings).map((key) => {
    const { enable, className } = rowSettings[key] || {};

    if (enable[idx]) {
      return className;
    }

    return '';
  });

function DefaultItemRenderer({
  tableName,
  columnsInfo = {},
  itemComponentsInfo = [],
  itemClickCallback,
  rowSettings = {},
  id,
  idx,
  headerColumns = [],
  withFieldName,
  className,
  elementClassName,
  columnClassName,
  bodyTextClassName,
}) {
  const { isNotDesktop } = ViewportHook();

  const columns = cloneDeep(headerColumns).map((column) => {
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

  return (
    <div
      className={classNames(className, renderItemClass(rowSettings, idx))}
      onClick={() => {
        itemClickCallback(id);
      }}
    >
      {renderItems({
        isNotDesktop,
        itemComponentsInfo,
        columnsInfo,
        tableName,
        headerColumns: columns,
        withFieldName,
        elementClassName,
        columnClassName,
        bodyTextClassName,
      })}
    </div>
  );
}

export default DefaultItemRenderer;
