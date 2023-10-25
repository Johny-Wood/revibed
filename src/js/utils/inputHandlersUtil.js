import set from 'lodash/set';

import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';

function changeInputHandler(
  { target, max, typeValue, fractionDigits },
  { checkValueBeforeSet = (value) => value, onChangeCallback = () => {}, applyChange = () => true } = {}
) {
  const { id, value = '' } = target;

  if (!applyChange(value)) {
    return;
  }

  const newValue = checkValueBeforeSet(value);

  if (typeValue === 'float') {
    if (
      (newValue[0] === '0' &&
        !['.', ','].includes(newValue[1]) &&
        newValue.length > 1 &&
        ['0'].includes(newValue[newValue.length - 1])) ||
      ['.', ','].includes(newValue[0]) ||
      (newValue[0] === '0' && newValue.length === 2 && !['.', ','].includes(newValue[newValue.length - 1]))
    ) {
      return;
    }

    if (newValue.split('').filter((s) => ['.', ','].includes(s)).length > 1) {
      return;
    }

    const split = newValue.split(/[.,]/);

    if (split.length === fractionDigits) {
      if (split[1].length > fractionDigits) {
        return;
      }
    }

    if (CommonRegExpConstants.FLOAT_DIGIT.test(newValue)) {
      this.setState(
        (prevState) => {
          const newState = { ...prevState };

          set(newState, id, newValue.replace(',', '.'));
          set(newState, `${id}Error`, false);
          set(newState, `${id}ErrorMsg`, '');

          return newState;
        },
        () => {
          onChangeCallback(newValue.replace(',', '.'));
        }
      );
    }
  } else if (newValue === '' || (newValue && (typeValue !== 'number' || max >= +newValue))) {
    this.setState(
      (prevState) => {
        const newState = { ...prevState };

        set(newState, id, newValue);
        set(newState, `${id}Error`, false);
        set(newState, `${id}ErrorMsg`, '');

        return newState;
      },
      () => {
        onChangeCallback(newValue);
      }
    );
  }
}

function changeInputHandlerNew(
  { target, min, typeValue, fractionDigits },
  { checkValueBeforeSet = (value) => value, onChangeCallback = () => {}, applyChange = () => true } = {}
) {
  const { id, value = '' } = target;

  if (!applyChange(value)) {
    return;
  }

  const newValue = checkValueBeforeSet(value);

  if (typeValue === 'float') {
    if (newValue.length > 0 && ['.', ',', '0'].includes(newValue[0])) {
      return;
    }

    if (newValue.split('').filter((s) => ['.', ','].includes(s)).length > 1) {
      return;
    }

    const split = newValue.split(/[.,]/);

    if (split.length === fractionDigits) {
      if (split[1].length > fractionDigits) {
        return;
      }
    }

    if (CommonRegExpConstants.FLOAT_DIGIT.test(newValue)) {
      this.setState(
        (prevState) => {
          const newState = { ...prevState };

          set(newState, id, newValue);
          set(newState, `${id}Error`, false);
          set(newState, `${id}ErrorMsg`, '');

          return newState;
        },
        () => {
          onChangeCallback(newValue.replace(',', '.'));
        }
      );
    }
  } else if (newValue === '' || newValue || newValue > min) {
    this.setState(
      (prevState) => {
        const newState = { ...prevState };

        set(newState, `${id}.value`, newValue);
        set(newState, `${id}.error`, false);
        set(newState, `${id}.message`, '');

        return newState;
      },
      () => {
        onChangeCallback(newValue);
      }
    );
  }
}

function changeCheckBoxHandler({ target }, { payloadState = {}, onChangeCallback = () => {} } = {}) {
  const { id, checked } = target;

  const newValue = checked;

  this.setState(
    {
      [id]: newValue,
      [`${id}Error`]: false,
      [`${id}ErrorMsg`]: '',
      ...payloadState,
    },
    () => {
      onChangeCallback(newValue);
    }
  );
}

function setInputError(id = '', errorMessage = '') {
  this.setState({
    [`${id}Error`]: true,
    [`${id}ErrorMsg`]: errorMessage,
  });
}

function clearInputState({ id, defaultValue, callback = () => {} }) {
  this.setState(
    {
      [id]: defaultValue,
      [`${id}Error`]: false,
      [`${id}ErrorMsg`]: '',
    },
    callback
  );
}

function focusInputHandler({ target }, payloadState = {}, checkValueBeforeSet = (value) => value) {
  const { id, value } = target;
  const newValue = checkValueBeforeSet(value);

  if (newValue === '' || newValue) {
    this.setState({
      [`${id}Error`]: false,
      [`${id}ErrorMsg`]: '',
      ...payloadState,
    });
  }
}

function pressEnterKeyInputHandler(event, handler = () => {}, payload = {}) {
  const {
    target: { id, value },
    key,
  } = event;

  if (key === 'Enter') {
    handler({
      id,
      value,
      payload,
    });
  }
}

function pressSpaceKeyInputHandler(event, handler = () => {}, payload = {}) {
  const {
    target: { id, value },
    key,
  } = event;

  if (key === ' ' || key === 'Spacebar') {
    handler({
      id,
      value,
      payload,
    });
  }
}

function pressShiftEnterKeyInputHandler(event, handler = () => {}, payload = {}) {
  const {
    target: { id },
    key,
  } = event;

  if (key === 'Enter' && event.shiftKey) {
    event.preventDefault();

    handler(id, payload);
  }
}

function validateField(
  { target: { id = '', value = '' } = {} } = {},
  {
    fieldIsValid = () => true,
    invalidMessage = '',
    validateEmptyField = false,
    emptyFieldErrorMessage = CommonErrorMessages.REQUIRED,
    callback = () => {},
  }
) {
  if (!validateEmptyField && !value) {
    return;
  }

  if (!fieldIsValid(value) || (validateEmptyField && !value)) {
    this.setState({
      [`${id}Error`]: true,
      [`${id}ErrorMsg`]: validateEmptyField && !value ? emptyFieldErrorMessage : invalidMessage,
    });
  } else {
    callback();
  }
}

export {
  changeCheckBoxHandler,
  changeInputHandler,
  changeInputHandlerNew,
  clearInputState,
  focusInputHandler,
  pressEnterKeyInputHandler,
  pressShiftEnterKeyInputHandler,
  pressSpaceKeyInputHandler,
  setInputError,
  validateField,
};
