import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Input from '@/components/ui/inputs/Input';
import { loadGenresRequestAction } from '@/redux-actions/projects/dataForProjectActions';

class GenresInput extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  componentDidMount() {
    this.onLoadRequest();
  }

  onLoadRequest = (name) => {
    const { loadGenresRequest } = this.props;

    loadGenresRequest(name);
  };

  clickItemCallback = ({ option: { id, label } = {} } = {}) => {
    const { changeItems, selected } = this.props;
    let selectedTmp = cloneDeep(selected);

    const selectedIdx = selectedTmp.findIndex((selectedItem) => selectedItem.id === id);

    if (selectedIdx > -1) {
      selectedTmp.splice(selectedIdx, 1);
    } else {
      selectedTmp = [
        ...selected,
        {
          id,
          name: label,
        },
      ];
    }

    changeItems(selectedTmp);
  };

  render() {
    const {
      genresList,
      selected,
      searchText,
      error,
      errorMsg,
      changeItems,
      changeInputHandler,
      loadGenresRequest,
      ...otherProps
    } = this.props;

    return (
      <Input
        autoComplete="off"
        classNameBlock="input-autocomplete"
        className="input-w-100pct"
        id="genres"
        label="Genres"
        value={searchText}
        searchValueIpt={searchText}
        invalid={error}
        invalidMessage={errorMsg}
        onChange={this.changeInputHandler}
        withAutoComplete
        withAutoCompleteLocal
        textInputAllowed
        options={genresList.map(({ id, name }) => ({
          id,
          value: name,
          label: name,
          name,
        }))}
        optionListPositionX="right"
        clickItemCallback={this.clickItemCallback}
        selectedList={selected}
        tags
        {...otherProps}
      />
    );
  }
}

export default connect(
  (state) => ({
    genresList: state.DataForProjectReducer.genresList,
  }),
  (dispatch) => ({
    loadGenresRequest: (name) => loadGenresRequestAction(name)(dispatch),
  })
)(GenresInput);
