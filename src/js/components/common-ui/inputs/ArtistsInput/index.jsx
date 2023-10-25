import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Input from '@/components/ui/inputs/Input';
import { loadArtistsRequestAction } from '@/redux-actions/projects/dataForProjectActions';

class ArtistsInput extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  onLoadRequest = (name) => {
    const { loadArtistsRequest } = this.props;

    if (name) {
      loadArtistsRequest(name);
    }
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
      artistsList,
      loadArtistsInProcess,
      selected,
      searchText,
      error,
      errorMsg,
      changeItems,
      changeInputHandler,
      loadArtistsRequest,
      ...otherProps
    } = this.props;

    return (
      <Input
        classNameBlock="input-autocomplete"
        id="artists"
        label="Artist*"
        value={searchText}
        searchValueIpt={searchText}
        invalid={error}
        invalidMessage={errorMsg}
        onChange={(e) => this.changeInputHandler(e, { onChangeCallback: this.onLoadRequest })}
        withAutoComplete
        options={artistsList}
        optionListPositionX="right"
        clickItemCallback={this.clickItemCallback}
        selectedList={selected}
        tags
        inProcess={loadArtistsInProcess}
        {...otherProps}
      />
    );
  }
}

export default connect(
  (state) => ({
    artistsList: state.DataForProjectReducer.artistsList,
    loadArtistsInProcess: state.DataForProjectReducer.loadArtistsInProcess,
  }),
  (dispatch) => ({
    loadArtistsRequest: (name) => loadArtistsRequestAction(name)(dispatch),
  })
)(ArtistsInput);
