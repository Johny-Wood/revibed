import { Component } from 'react';

import Input from '@/components/ui/inputs/Input';
import { changeInputHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class RipperCabinetConditions extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);

    const {
      conditions: {
        mediaCondition: { title: mediaConditionTitle = '', shortTitle: mediaConditionShortTitle = '' } = {},
        sleeveCondition: { title: sleeveConditionTitle = '', shortTitle: sleeveConditionShortTitle = '' } = {},
      } = {},
    } = props;

    this.state = {
      mediaCondition: `${mediaConditionTitle} (${mediaConditionShortTitle})` || '',
      sleeveCondition: `${sleeveConditionTitle} (${sleeveConditionShortTitle})` || '',
    };
  }

  render() {
    const { mediaCondition, sleeveCondition } = this.state;

    return (
      <div className={styles.ripperConditions}>
        <div className="inputs-column-2">
          <div className="inputs-column__item">
            <div className="m-bottom-10">
              <b>Media condition</b>
            </div>
            <Input id="mediaCondition" value={mediaCondition} onChange={this.changeInputHandler} disabled />
          </div>
          <div className="inputs-column__item">
            <div className="m-bottom-10">
              <b>Sleeve condition</b>
            </div>
            <Input id="sleeveCondition" value={sleeveCondition} onChange={this.changeInputHandler} disabled />
          </div>
        </div>
      </div>
    );
  }
}

export default RipperCabinetConditions;
