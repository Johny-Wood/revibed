import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import Button from '@/components/ui/buttons/Button';
import ImageLiteBoxService from '@/services/ImageLiteBoxService';

import styles from './styles.module.scss';

function WantListImportInstructionStep({ id, title, text, videoLink }) {
  return (
    <div className={styles.wantListImportInstructionStep}>
      <div className={styles.wantListImportInstructionStep__circle}>
        <div className={styles.wantListImportInstructionStep__id}>{id}</div>
        <div className={styles.wantListImportInstructionStep__title}>{parse(title)}</div>
      </div>
      <div className={styles.wantListImportInstructionStep__info}>
        <p className={styles.wantListImportInstructionStep__text}>{parse(text)}</p>
        <div>
          {!!videoLink && (
            <Button
              text="View video"
              className={classNames(styles.buttonViewVideo, 'c-blue')}
              type="button_string"
              onClick={() => {
                ImageLiteBoxService.setIframe(videoLink);
                ImageLiteBoxService.open();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

WantListImportInstructionStep.defaultProps = {
  title: '',
  text: '',
  videoLink: '',
};

WantListImportInstructionStep.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  videoLink: PropTypes.string,
};

export default WantListImportInstructionStep;
