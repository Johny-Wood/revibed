import cloneDeep from 'lodash/cloneDeep';

import Select from '@/components/ui/selects/Select';

const clickItemCallback = ({ option, selected, changeItems }) => {
  let selectedTmp = cloneDeep(selected);
  const { id } = option;

  const selectedIdx = selectedTmp.findIndex((selectedItem) => selectedItem.id === id);

  if (selectedIdx > -1) {
    selectedTmp.splice(selectedIdx, 1);
  } else {
    selectedTmp = [option, ...selected];
  }

  changeItems(selectedTmp);
};

function SupportTopicSelect({ topicId, items = [], selected, label, searchText, error, errorMsg, changeItems, ...otherProps }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Select
      id="supportTopic"
      options={items.map(({ id, name }) => ({
        id,
        value: id,
        label: name,
      }))}
      label="How can we help you?"
      toggled
      onSelectItem={(option) => clickItemCallback({ option, selected, changeItems })}
      invalid={error}
      invalidMsg={errorMsg}
      selected={selected}
      autofill
      clear={!selected}
      {...otherProps}
      className="m-top-5 m-bottom-5"
    />
  );
}

export default SupportTopicSelect;
