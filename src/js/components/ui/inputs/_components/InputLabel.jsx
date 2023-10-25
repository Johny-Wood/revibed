import parse from 'html-react-parser';
import PropTypes from 'prop-types';

function InputLabel({ text }) {
  return (
    <span className="input-label">
      <span className="label">{parse(text)}</span>
    </span>
  );
}

InputLabel.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InputLabel;
