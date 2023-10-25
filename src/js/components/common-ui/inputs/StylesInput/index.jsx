import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Input from '@/components/ui/inputs/Input';
import { loadStylesRequestAction, updateStylesSuccessAction } from '@/redux-actions/projects/dataForProjectActions';

class StylesInput extends Component {
  constructor(props) {
    super(props);

    const { changeInputHandler } = this.props;

    this.changeInputHandler = changeInputHandler;
  }

  componentDidMount() {
    this.onLoadRequest();
  }

  onLoadRequest = (name) => {
    const { loadStylesRequest } = this.props;

    loadStylesRequest(name);
  };

  clickItemCallback = ({ option: { id, label } = {} } = {}, removeFlag) => {
    const { changeItems, selected, updateStylesSuccess } = this.props;
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

    changeItems(selectedTmp, removeFlag);

    updateStylesSuccess();
  };

  render() {
    const {
      stylesList,
      loadStylesInProcess,
      selected,
      searchText,
      error,
      errorMsg,
      updateStylesSuccess,
      changeItems,
      changeInputHandler,
      loadStylesRequest,
      label = 'Styles',
      placeholder = '',
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
        options={stylesList}
        optionListPositionX="right"
        clickItemCallback={this.clickItemCallback}
        selectedList={selected}
        tags
        inProcess={loadStylesInProcess}
        {...otherProps}
      />
    );
  }
}

export default connect(
  (state) => ({
    stylesList: state.DataForProjectReducer.stylesList,
    loadStylesInProcess: state.DataForProjectReducer.loadStylesInProcess,
  }),
  (dispatch) => ({
    loadStylesRequest: (name) => loadStylesRequestAction(name)(dispatch),
    updateStylesSuccess: () => {
      dispatch(updateStylesSuccessAction());
    },
  })
)(StylesInput);
