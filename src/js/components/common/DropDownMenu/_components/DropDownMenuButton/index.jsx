import Button from '@/components/ui/buttons/Button';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import HorizontalDotsMenuIcon from '@/icons/Dots/HorizontalDotsMenuIcon';

import styles from './styles.module.scss';

function DropDownMenuButton({
  shownContent,
  onClick,
  withToggleArrow,
  dropDownButton: DropDownButton,
  dropDownButtonProps = {},
}) {
  return (
    <div className={styles.dropDownMenu__button} onClick={onClick}>
      {DropDownButton ? (
        <DropDownButton shownDropDownMenu={shownContent} {...dropDownButtonProps} />
      ) : (
        <Button type="button_string">
          <HorizontalDotsMenuIcon />
        </Button>
      )}
      {withToggleArrow && <ArrowIcon isOpened={shownContent} />}
    </div>
  );
}

export default DropDownMenuButton;
