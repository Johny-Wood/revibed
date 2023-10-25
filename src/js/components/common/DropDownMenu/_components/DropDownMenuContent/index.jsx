import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

function DropDownMenuContent({ dropDownMenuListClass, dropDownMenuItemClass, list }) {
  return (
    <div className={classNames([styles.dropDownMenu__list, dropDownMenuListClass])}>
      {list.map(({ text, id, icon: Icon, link, link: { href } = {}, onClick, disabled, inProcess, tKey }) => {
        const key = `drop-down-menu-item-${id}`;

        const renderIcon = () => (
          <span className="option-icon">
            <Icon />
          </span>
        );

        if (link) {
          return (
            <LinkRoute key={key} href={href} text={text} translateKey={tKey} className={dropDownMenuItemClass}>
              {!!Icon && renderIcon()}
            </LinkRoute>
          );
        }

        return (
          <Button
            key={key}
            text={text}
            translateKey={tKey}
            onClick={onClick}
            isInProcess={inProcess}
            disabled={disabled}
            type="button_string"
            className={dropDownMenuItemClass}
          >
            {!!Icon && renderIcon()}
          </Button>
        );
      })}
    </div>
  );
}

export default DropDownMenuContent;
