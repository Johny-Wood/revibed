import { createElement } from 'react';

import parse, { attributesToProps, domToReact } from 'html-react-parser';
import PropTypes from 'prop-types';

function ParseComponent({ text, permittedTags }) {
  const options = {
    // eslint-disable-next-line react/no-unstable-nested-components
    replace: (DOMNode) => {
      const { type, data, name, children, attribs } = DOMNode;

      if (type === 'tag' && permittedTags.includes(name)) {
        return createElement(
          name,
          attributesToProps({
            ...attribs,
            style: null,
            className: null,
            color: null,
            face: null,
            target: name === 'a' ? '_blank' : null,
          }),
          name !== 'br' ? domToReact(children, options) : null
        );
      }

      return data || `<${name}>`;
    },
  };

  return <>{parse(text, options)}</>;
}

ParseComponent.defaultProps = {
  text: '',
  permittedTags: ['div', 'span', 'br', 'a', 'u', 'b', 'i', 'font', 'p', 'div'],
};

ParseComponent.propTypes = {
  text: PropTypes.string,
  permittedTags: PropTypes.array,
};

export default ParseComponent;
