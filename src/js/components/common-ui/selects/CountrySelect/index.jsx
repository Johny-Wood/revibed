import { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CountrySelectFlag from '@/components/common-ui/selects/CountrySelect/_components/CountrySelectFlag';
import Select from '@/components/ui/selects/Select';

class CountrySelect extends Component {
  renderCountriesSelect = () => {
    const {
      label,
      isFilter,
      placeholder,
      placeholderSearch,
      size,
      openOnly,

      multiSelect,

      onClose = () => {},

      countryId,
      countryIdError,
      countryIdErrorMsg,

      key,
      onSelectItem,

      changeInputHandler,

      countriesList,
      languageSelected,

      targetPredicate = ({ forRegistration }) => forRegistration,
      labelGenerator = (country) => country[`title_${languageSelected.language}`],

      ...otherProps
    } = this.props;

    return (
      <Select
        id="countryId"
        className="country-select"
        options={countriesList.filter(targetPredicate).map((country = {}) => {
          const { id, forRegistration, alias } = country;

          return {
            id,
            value: id,
            label: labelGenerator(country),
            labelRender: CountrySelectFlag,
            labelRenderProps: {
              country,
              forRegistration,
              alias,
              labelGenerator,
            },
            queryParam: id,
          };
        })}
        selected={(countryId ? [countriesList.find(({ id }) => id === countryId)] : []).map((country = {}) => {
          const { id } = country;

          return {
            id,
            value: id,
            label: labelGenerator(country),
            queryParam: id,
          };
        })}
        searchStart
        label={label}
        key={key}
        toggled
        size={size}
        isFilter={isFilter}
        openOnly={openOnly}
        multiSelect={multiSelect}
        textInputAllowed
        onSelectItem={onSelectItem}
        invalid={countryIdError}
        invalidMsg={countryIdErrorMsg}
        placeholder={placeholder}
        placeholderSearch={placeholderSearch}
        clear={!countryId}
        onChange={this.focusInputHandler}
        onClose={onClose}
        floatLabel
        {...otherProps}
      />
    );
  };

  render() {
    return this.renderCountriesSelect();
  }
}

CountrySelect.defaultProps = {
  label: 'Country',
  countryId: undefined,
  isFilter: false,
  placeholder: '',
  placeholderSearch: '',
  size: '',
  openOnly: false,
};

CountrySelect.propTypes = {
  label: PropTypes.string,
  countryId: PropTypes.number,
  isFilter: PropTypes.bool,
  placeholder: PropTypes.string,
  placeholderSearch: PropTypes.string,
  size: PropTypes.string,
  openOnly: PropTypes.bool,
};

export default connect((state) => ({
  languageSelected: state.GlobalReducer.languageSelected,
  countriesList: state.GlobalReducer.countriesList,
}))(CountrySelect);
