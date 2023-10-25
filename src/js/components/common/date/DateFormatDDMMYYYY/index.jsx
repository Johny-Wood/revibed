import { Component } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getDateFormatDDMMYYYYUtil, getDateFormatUtil } from '@/utils/dateUtils';

class DateFormatDDMMYYYY extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateTitle: '',
      dateLocal: '',
    };
  }

  componentDidMount() {
    const { date } = this.props;

    this.setState({
      dateTitle: getDateFormatUtil(date),
      dateLocal: getDateFormatDDMMYYYYUtil(date),
    });
  }

  render() {
    const { dateTitle, dateLocal } = this.state;
    const { className } = this.props;

    return (
      <span className={classNames(className)} title={dateTitle}>
        {dateLocal}
      </span>
    );
  }
}

DateFormatDDMMYYYY.defaultProps = {
  date: 0,
  className: '',
};

DateFormatDDMMYYYY.propTypes = {
  date: PropTypes.number,
  className: PropTypes.string,
};

export default DateFormatDDMMYYYY;
