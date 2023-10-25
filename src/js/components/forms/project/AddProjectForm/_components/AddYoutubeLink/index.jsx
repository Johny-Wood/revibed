import { forwardRef } from 'react';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import Input from '@/components/ui/inputs/Input';
import LinkDefault from '@/components/ui/links/LinkDefault';
import CloseIcon from '@/icons/control/close/CloseIcon';

const AddYoutubeLink = forwardRef(({ id, value, error, message, onChange, onRemove, withRemove }, ref) => (
  <div className="input-with-button" ref={ref}>
    <Input
      className="input-w-100pct youtube-link-input"
      id={id}
      label="Paste youtube link here"
      value={value}
      invalid={error}
      invalidMessage={message}
      onChange={onChange}
    />
    {withRemove && (
      <ButtonIcon type="button_string" className="add-project__remove__link" icon={CloseIcon} onClick={() => onRemove(id)} />
    )}
    <LinkDefault href={value} type="button" text="Open link" transparent borderColor="gray-4" disabled={error || !value} />
  </div>
));

AddYoutubeLink.displayName = 'AddYoutubeLink';

export default AddYoutubeLink;
