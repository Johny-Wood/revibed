import { Component } from 'react';

import PropTypes from 'prop-types';

import { getDateFormatUtil } from '@/utils/dateUtils';

class DateFormat extends Component {
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
      dateLocal: getDateFormatUtil(date, 'DD.MM.YY'),
    });
  }

  render() {
    const { dateTitle, dateLocal } = this.state;

    return <span title={dateTitle}>{dateLocal}</span>;
  }
}

DateFormat.defaultProps = {
  date: 0,
};

DateFormat.propTypes = {
  date: PropTypes.number,
};

export default DateFormat;
