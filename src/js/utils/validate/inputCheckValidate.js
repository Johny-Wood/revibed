import isPlainObject from 'lodash/isPlainObject';

import { CommonErrorMessages } from '@/constants/common/errorsMessage';

import { setInputError } from '../inputHandlersUtil';

export const ValidateRegularTestUtil = (value, regular) => regular.test(value);

export const ValidateMaxLengthUtil = (value, maxLength) => value.length <= maxLength;

export const ValidateMinLengthUtil = (value, minLength) => value.length >= minLength;

export const ValidateMinValueUtil = (value, minValue) => value >= minValue;

export const ValidateMaxValueUtil = (value, maxValue) => value <= maxValue;

export function ValidateBadRequestUtil(errorField) {
  if (errorField) {
    const setInputErrorWithCtx = setInputError.bind(this);

    errorField.forEach((badRequestError) => {
      const keysError = Object.keys(badRequestError);

      if (`${keysError}` === 'password') {
        setInputErrorWithCtx('passwordConfirm', CommonErrorMessages.REQUIRED);
      }

      if (isPlainObject(Object.values(badRequestError))) {
        let errorMessageKeyStr = '';

        Object.keys(Object.values(badRequestError)).forEach((errorMessageKey) => {
          Object.keys(Object.values(badRequestError)[errorMessageKey]).forEach((errorMessage) => {
            errorMessageKeyStr = `${errorMessageKeyStr} ${CommonErrorMessages[errorMessage]}${
              Object.values(badRequestError)[errorMessageKey][errorMessage]
            }.`;
          });
        });

        setInputErrorWithCtx(`${keysError}`, errorMessageKeyStr);
      } else {
        setInputErrorWithCtx(`${keysError}`, CommonErrorMessages[Object.values(badRequestError)]);
      }
    });
  }
}
