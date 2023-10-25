import { ReactSortable } from 'react-sortablejs';

import InputTag from '@/components/ui/inputs/Input/_components/InputTag';

function InputTags({ draggable, tags = [], disabled, clickItemHandler, onDraggableSort = () => {} }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ReactSortable className="input-tags" animation={200} list={tags} setList={onDraggableSort} disabled={!draggable}>
      {tags.map((selected) => {
        const { id, name, type, shortTitle } = selected;

        const key = `input-tag-${id}-${type}-${name}-${shortTitle}`;

        return <InputTag key={key} tag={selected} clickItemHandler={clickItemHandler} disabledRemove={disabled} />;
      })}
    </ReactSortable>
  );
}

export default InputTags;
