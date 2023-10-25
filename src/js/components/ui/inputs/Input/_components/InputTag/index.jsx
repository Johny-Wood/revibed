import classNames from 'classnames';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import CloseIcon from '@/icons/control/close/CloseIcon';

function InputTag({ className, style, disabledRemove, clickItemHandler, tag, tag: { name, shortTitle } = {} }) {
  return (
    <div
      style={style}
      className={classNames(['input-tag', className])}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="input-tag-content">
        {name || shortTitle}
        <ButtonIcon
          className="input-tag__remove"
          type="button_string"
          icon={CloseIcon}
          onClick={(e) => {
            e.stopPropagation();

            if (disabledRemove || !clickItemHandler) {
              return;
            }

            clickItemHandler({ option: tag }, true);
          }}
        />
      </div>
    </div>
  );
}

export default InputTag;
