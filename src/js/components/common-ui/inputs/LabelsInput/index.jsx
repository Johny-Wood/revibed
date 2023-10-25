import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Input from '@/components/ui/inputs/Input';
import { loadLabelsRequestAction } from '@/redux-actions/projects/dataForProjectActions';

class LabelsInput extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  onLoadRequest = (name) => {
    const { loadLabelsRequest } = this.props;

    if (name) {
      loadLabelsRequest(name);
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
      labelsList,
      loadLabelsInProcess,
      selected,
      searchText,
      error,
      errorMsg,
      changeItems,
      changeInputHandler,
      loadLabelsRequest,
      ...otherProps
    } = this.props;

    return (
      <Input
        autoComplete="off"
        classNameBlock="input-autocomplete"
        id="labels"
        label="Label"
        value={searchText}
        searchValueIpt={searchText}
        invalid={error}
        invalidMessage={errorMsg}
        onChange={(e) => this.changeInputHandler(e, { onChangeCallback: this.onLoadRequest })}
        withAutoComplete
        options={labelsList}
        optionListPositionX="right"
        clickItemCallback={this.clickItemCallback}
        selectedList={selected}
        tags
        inProcess={loadLabelsInProcess}
        {...otherProps}
      />
    );
  }
}

export default connect(
  (state) => ({
    labelsList: state.DataForProjectReducer.labelsList,
    loadLabelsInProcess: state.DataForProjectReducer.loadLabelsInProcess,
  }),
  (dispatch) => ({
    loadLabelsRequest: (name) => loadLabelsRequestAction(name)(dispatch),
  })
)(LabelsInput);
