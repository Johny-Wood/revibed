import { useState } from 'react';

import copy from 'copy-to-clipboard';

import Button from '@/components/ui/buttons/Button';

function CopyButton({
  value,

  copyText = 'Copy',
  copiedText = 'Copied',

  onClick = () => {},

  renderComponent: Renderer = Button,
  renderComponentProps = {},

  ...othersProps
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Renderer
      text={copied ? copiedText : copyText}
      onClick={() => {
        copy(value);
        setCopied(true);

        onClick();
      }}
      className="button_copy"
      {...othersProps}
      {...renderComponentProps}
    />
  );
}

export default CopyButton;
