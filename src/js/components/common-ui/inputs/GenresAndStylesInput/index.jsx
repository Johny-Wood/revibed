import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Input from '@/components/ui/inputs/Input';
import { loadGenresAndStylesRequestAction } from '@/redux-actions/projects/dataForProjectActions';

class GenresAndStylesInput extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  componentDidMount() {
    this.onLoadRequest();
  }

  componentDidUpdate(prevProps) {
    const { selected } = this.props;
    const { selected: selectedPrev } = prevProps;

    if (selected.length > selectedPrev.length) {
      this.onLoadRequest();
    }
  }

  onLoadRequest = (name) => {
    const { loadGenresAndStylesRequest } = this.props;

    loadGenresAndStylesRequest(name);
  };

  clickItemCallback = ({ option: { id, label, type } = {} } = {}, removeFlag) => {
    const { changeItems, selected } = this.props;
    let selectedTmp = cloneDeep(selected);

    const selectedIdx = selectedTmp.findIndex(({ id: foundId, type: foundType }) => foundId === id && foundType === type);

    if (selectedIdx > -1) {
      selectedTmp.splice(selectedIdx, 1);
    } else {
      selectedTmp = [
        ...selected,
        {
          id,
          name: label,
          type,
        },
      ];
    }

    changeItems(selectedTmp, removeFlag);
  };

  render() {
    const {
      selected,
      searchText,
      error,
      errorMsg,
      changeItems,
      changeInputHandler,
      label = 'Styles',
      placeholder = '',
      genresAndStyles,
      loadGenresAndStylesInProcess,
      loadGenresAndStylesRequest,
      ...otherProps
    } = this.props;

    return (
      <Input
        autoComplete="off"
        classNameBlock="input-autocomplete"
        className="input-w-100pct"
        id="styles"
        label={label}
        placeholder={placeholder}
        value={searchText}
        searchValueIpt={searchText}
        invalid={error}
        invalidMessage={errorMsg}
        onChange={(e) => this.changeInputHandler(e, { onChangeCallback: this.onLoadRequest })}
        withAutoComplete
        withAutoCompleteLocal
        options={genresAndStyles}
        optionListPositionX="right"
        clickItemCallback={this.clickItemCallback}
        selectedList={selected}
        tags
        inProcess={loadGenresAndStylesInProcess}
        {...otherProps}
      />
    );
  }
}

export default connect(
  (state) => ({
    genresAndStyles: state.DataForProjectReducer.genresAndStyles,
    loadGenresAndStylesInProcess: state.DataForProjectReducer.loadGenresAndStylesInProcess,
  }),
  (dispatch) => ({
    loadGenresAndStylesRequest: (name) => loadGenresAndStylesRequestAction(name)(dispatch),
  })
)(GenresAndStylesInput);
