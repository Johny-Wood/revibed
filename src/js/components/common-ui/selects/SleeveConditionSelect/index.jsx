import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Select from '@/components/ui/selects/Select';

const clickItemCallback = (option, { changeItems, selected }) => {
  const { id } = option;
  let selectedTmp = cloneDeep(selected);

  const selectedIdx = selectedTmp.findIndex((selectedItem) => selectedItem.id === id);

  if (selectedIdx > -1) {
    selectedTmp.splice(selectedIdx, 1);
  } else {
    selectedTmp = [option];
  }

  changeItems(selectedTmp);
};

function SleeveConditionSelect({
  sleeveCondition,
  selected,
  label,
  searchText,
  error,
  errorMsg,
  conditionId,
  targetPredicate = ({ common = true }) => common,
  changeItems,
  ...otherProps
}) {
  return (
    <Select
      id="sleeveCondition"
      options={sleeveCondition.filter(targetPredicate)}
      label={label}
      key={label}
      toggled
      onSelectItem={(option) => clickItemCallback(option, { changeItems, selected })}
      invalid={error}
      invalidMsg={errorMsg}
      selected={selected}
      autofill
      clear={!conditionId}
      {...otherProps}
    />
  );
}

export default connect((state) => ({
  sleeveCondition: state.DataForProjectReducer.sleeveCondition,
}))(SleeveConditionSelect);
