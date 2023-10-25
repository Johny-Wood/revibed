import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';

import Input from '@/components/ui/inputs/Input';
import { pressEnterKeyInputHandler, pressSpaceKeyInputHandler } from '@/utils/inputHandlersUtil';
import { ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

class InputWithTag extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  clickItemCallback = ({ id, name = '', label = name, value = '' }, removeFlag) => {
    const {
      changeItems,
      selected,
      validator,
      validator: { regularTest: { regexp, invalidMessage } = {} } = {},
      validateField,
    } = this.props;

    let selectedTmp = cloneDeep(selected);
    const findDoubleItem = selectedTmp.findIndex(
      ({ name: nameSelected = '' }) => nameSelected.toLowerCase() === (value || label).toLowerCase()
    );

    if (findDoubleItem > -1 && !removeFlag) {
      changeItems(selectedTmp, removeFlag);
      return;
    }

    if (validator && !removeFlag) {
      if (regexp && !ValidateRegularTestUtil(value, regexp)) {
        validateField(
          {
            target: {
              id,
              value,
            },
          },
          {
            fieldIsValid: (valueCur) => ValidateRegularTestUtil(valueCur, regexp),
            invalidMessage,
          }
        );
        return;
      }
    }

    const selectedIdx = selectedTmp.findIndex((selectedItem) => selectedItem.id === id);

    if (selectedIdx > -1) {
      selectedTmp.splice(selectedIdx, 1);
    } else {
      selectedTmp = [
        ...selected,
        {
          id: value || id,
          name: label || value,
        },
      ];
    }

    changeItems(selectedTmp, removeFlag);
  };

  render() {
    const { id, label, className, genresList, selected, searchText, error, errorMsg } = this.props;

    return (
      <Input
        autoComplete="off"
        classNameBlock="input-autocomplete"
        className={className}
        id={id}
        label={label}
        value={searchText}
        searchValueIpt={searchText}
        invalid={error}
        invalidMessage={errorMsg}
        onChange={(e) => this.changeInputHandler(e, { applyChange: (value) => !value.includes(' ') })}
        options={genresList}
        optionListPositionX="right"
        onKeyDown={(e) => {
          pressEnterKeyInputHandler(e, this.clickItemCallback);
          pressSpaceKeyInputHandler(e, this.clickItemCallback);
        }}
        onBlur={(e) => {
          this.clickItemCallback(e.target);
        }}
        clickItemCallback={({ option } = {}, removeFlag) => this.clickItemCallback(option, removeFlag)}
        selectedList={selected}
        tags
      />
    );
  }
}

export default InputWithTag;
