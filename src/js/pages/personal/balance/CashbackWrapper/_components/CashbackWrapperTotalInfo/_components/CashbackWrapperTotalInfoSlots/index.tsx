import classNames from 'classnames';

import Cover from '@/js/components/common/Cover';
import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type CashbackWrapperTotalInfoSlotsProps = {
  total: number;
  value: number;
  type: 'founder' | 'contributor';
  targets?: { id: number; image: string }[];
};

const CashbackWrapperTotalInfoSlots = ({ total, value, type, targets }: CashbackWrapperTotalInfoSlotsProps) => {
  const remain = total - value;
  const covers = targets?.map(({ image, ...target }) => ({
    ...target,
    path: image,
  }));

  return (
    <div className={classNames(styles.CashbackWrapperTotalInfoSlots)}>
      <div className={classNames(styles.CashbackWrapperTotalInfoSlots__covers)}>
        {Array.from({ length: total }).map((_, idx) => {
          const hasSlot: boolean = !!covers && !!covers[idx];
          const hasCover: boolean = !!covers && !!covers[idx] && !!covers[idx]?.path;

          const key = `CashbackWrapperTotalInfoSlots-${type}-${idx}`;

          if (hasSlot) {
            return (
              // @ts-ignore
              <Cover
                key={key}
                isDefault
                covers={!!covers && hasCover ? [covers[idx]] : []}
                size={30}
                className={styles.CashbackWrapperTotalInfoSlots__cover}
                containerClassName={styles.CashbackWrapperTotalInfoSlots__coverContainer}
              />
            );
          }

          return (
            <div
              key={key}
              className={classNames(
                styles.CashbackWrapperTotalInfoSlots__coverContainer,
                styles.CashbackWrapperTotalInfoSlots__coverContainer_empty
              )}
            >
              <div className={classNames(styles.CashbackWrapperTotalInfoSlots__cover)} />
            </div>
          );
        })}
      </div>
      {remain > 0 && (
        <span
          className={classNames(
            styles.CashbackWrapperTotalInfoSlots__remains,
            remain === 1 && styles.CashbackWrapperTotalInfoSlots__remains_last
          )}
        >
          {remain} {textForLotsOfUtil(remain, ['remain', 'remains'])}
        </span>
      )}
    </div>
  );
};

export default CashbackWrapperTotalInfoSlots;
