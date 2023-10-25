import { useMemo, useRef, useState } from 'react';

import { getTrackBackground, Range } from 'react-range';

import Coin from '@/components/ui/currency/Coin';
import Input from '@/components/ui/inputs/Input';
import { clearSymbolsUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const renderRangeInput = (
  id,
  { disabled, realMin, realMax, value, placeholder, onChange, customInputRangeRef, setSaveFilterTop, withUnit = true }
) => (
  <Input
    id={id}
    typeValue="number"
    value={value}
    placeholder={placeholder}
    unit={withUnit ? <Coin color="gray-1" /> : undefined}
    size="small"
    disabled={disabled}
    onChange={(e) => {
      onChange(e);
      setSaveFilterTop(customInputRangeRef);
    }}
    min={realMin}
    max={realMax}
    fractionDigits={1}
    className="gray-1"
  />
);

function CustomInputRange({
  onChange,
  setSaveFilterTop,
  categoryId,
  disabled,
  valueInitRange: { min: minInit, max: maxInit } = {},
  value: { min = minInit, max = maxInit } = {},
}) {
  const realMin = min || minInit;
  const realMax = max || maxInit;
  const customInputRangeRef = useRef(null);

  const [localMin, setLocalMin] = useState(null);
  const [localMax, setLocalMax] = useState(null);

  const step = 1;

  const value = useMemo(() => [min, max], [min, max]);

  return (
    <div className={styles.inputRange__block} ref={customInputRangeRef}>
      <div className={styles.inputMulti}>
        {renderRangeInput('rangeMin', {
          withUnit: categoryId !== 'YEAR_RANGE',
          value: localMin == null ? min || '' : localMin,
          placeholder: minInit,
          realMin,
          realMax,
          disabled: minInit === maxInit,
          onChange: ({ target: { value: valueInput } }) => {
            const sanitizedValue = clearSymbolsUtil(valueInput);

            if (sanitizedValue.split('').length < 4) {
              setLocalMin(sanitizedValue ? +sanitizedValue : '');
              return;
            }

            setLocalMin(null);

            const numberValue = +sanitizedValue || realMin;

            let nV = numberValue;

            if (numberValue < minInit) {
              nV = realMin;
            } else if (numberValue > realMax) {
              nV = realMax - step;
            }

            onChange(
              {
                min: nV,
                max: realMax,
                categoryId,
              },
              categoryId
            );
          },
          setSaveFilterTop,
          customInputRangeRef,
        })}
        <span className={styles.rangeSeparator} />
        {renderRangeInput('rangeMax', {
          withUnit: categoryId !== 'YEAR_RANGE',
          value: localMax === null ? max || '' : localMax,
          placeholder: maxInit,
          realMin,
          realMax,
          disabled: minInit === maxInit,
          onChange: ({ target: { value: valueInput } }) => {
            const sanitizedValue = clearSymbolsUtil(valueInput);

            if (sanitizedValue.split('').length < 4) {
              setLocalMax(sanitizedValue ? +sanitizedValue : '');
              return;
            }

            setLocalMax(null);

            const numberValue = +sanitizedValue || realMax;

            let nV = numberValue;

            if (numberValue > maxInit) {
              nV = realMax;
            } else if (numberValue < realMin) {
              nV = realMin + step;
            }

            onChange(
              {
                min: realMin,
                max: nV,
                categoryId,
              },
              categoryId
            );
          },
          setSaveFilterTop,
          customInputRangeRef,
        })}
      </div>
      {maxInit !== minInit && (
        <Range
          disabled={disabled}
          values={value}
          max={maxInit}
          min={minInit}
          step={step}
          allowOverlap
          onFinalChange={() => {
            setSaveFilterTop(customInputRangeRef);
          }}
          onChange={(values) => {
            onChange({ min: values[0], max: values[1] }, categoryId);
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className={styles.rangeTrack}
              style={{
                ...props.style,
              }}
            >
              <div
                ref={props.ref}
                className={styles.rangeTrack__line}
                style={{
                  background: getTrackBackground({
                    values: value,
                    colors: ['var(--color__gray-4)', 'var(--color__black)', 'var(--color__gray-4)'],
                    min: minInit,
                    max: maxInit,
                  }),
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
              }}
            />
          )}
        />
      )}
    </div>
  );
}

export default CustomInputRange;
