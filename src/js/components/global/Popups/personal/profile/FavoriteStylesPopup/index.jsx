import { Component } from 'react';

import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import GenresAndStylesInput from '@/components/common-ui/inputs/GenresAndStylesInput';
import PopularGenresAndStyles from '@/components/global/Popups/personal/profile/FavoriteStylesPopup/_components/PopularGenresAndStyles';
import Popup from '@/components/primary/Popup';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import Button from '@/components/ui/buttons/Button';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { changePersonalInformationRequestAction } from '@/redux-actions/personal/personalActions';
import { appendFormUtil } from '@/utils/form/formUtils';
import { changeInputHandler } from '@/utils/inputHandlersUtil';
import { textForLotsOfUtil } from '@/utils/textUtils';

import Styles from './styles.module.scss';

const MAX_STYLES = 10;

class FavoriteStylesPopup extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);

    const { userInfo: { favoriteStyles = [] } = {} } = props;

    this.state = {
      selectedStyles: favoriteStyles || [],
      styles: '',
      stylesInvalid: false,
    };
  }

  isChangedStyles = () => {
    const { userInfo: { favoriteStyles = [] } = {} } = this.props;
    const { selectedStyles } = this.state;

    return !isEqual(selectedStyles, favoriteStyles);
  };

  disableChangePersonalInformation = () => {
    const { changePersonalInformationInProcess } = this.props;
    const { selectedStyles, stylesInvalid } = this.state;

    return (
      changePersonalInformationInProcess ||
      stylesInvalid ||
      !this.isChangedStyles() ||
      (!this.isChangedStyles() && selectedStyles.length === 0)
    );
  };

  changePersonalInformation = () => {
    const { changePersonalInformationRequest, closePopup } = this.props;
    const { selectedStyles } = this.state;

    if (this.disableChangePersonalInformation()) {
      return;
    }

    const formData = appendFormUtil({
      fieldsForm:
        selectedStyles.length > 0
          ? [
              {
                name: 'favoriteStyles',
                value: selectedStyles.map(({ id, type }) => ({ id: `${id}`, type })),
              },
            ]
          : [
              {
                name: 'clearFavoriteStyles',
                value: true,
              },
            ],
    });

    changePersonalInformationRequest(formData).then(() => {
      closePopup(PopupPersonalIdsConstants.FavoriteStylesPopup);
    });
  };

  changeStyles = (selectedStyles, removeFlag) => {
    const { stylesInvalid } = this.state;

    if (stylesInvalid && !removeFlag) {
      return;
    }

    this.setState({
      styles: '',
      selectedStyles: selectedStyles.map(({ id, name, type }) => ({ id, name, type })),
      stylesInvalid: selectedStyles.length > MAX_STYLES,
    });
  };

  resetStyles = () => {
    this.setState({
      selectedStyles: [],
      styles: '',
      stylesInvalid: false,
    });
  };

  onDraggableSort = (selectedStyles) => {
    this.setState({
      selectedStyles,
    });
  };

  render() {
    const { changePersonalInformationInProcess } = this.props;
    const { styles, stylesInvalid, selectedStyles } = this.state;

    return (
      <Popup
        popupId={PopupPersonalIdsConstants.FavoriteStylesPopup}
        headerText="What are your favorite styles?"
        maxWidth={600}
        classCustom={Styles.FavoriteStylesPopup}
        popupContentClassName={Styles.popupContent}
        popupInClassName={Styles.popupIn}
        popupHeaderClassName={Styles.popupHeader}
      >
        <PopupTextContent className={classNames('c-gray-2', Styles.popupInfoText)}>
          Keeping your favorite styles up&nbsp;to&nbsp;date helps you get the projects you want.
        </PopupTextContent>
        <PopularGenresAndStyles changeStyles={this.changeStyles} selectedStyles={selectedStyles} />
        <GenresAndStylesInput
          draggable
          label=""
          placeholder="Search styles"
          selected={selectedStyles}
          searchText={styles}
          changeItems={this.changeStyles}
          changeInputHandler={this.changeInputHandler}
          listHeight={271}
          withResetButton={selectedStyles.length > 0}
          onReset={this.resetStyles}
          onDraggableSort={this.onDraggableSort}
          optionListPositionX="left"
        />
        <div className={classNames('m-top-5 m-bottom-10', Styles.FavoriteStylesPopup__error)}>
          <ErrorInputMessage
            className={classNames([stylesInvalid && 'invalid'])}
            invalid
            invalidMessage={`Maximum ${MAX_STYLES} ${textForLotsOfUtil(MAX_STYLES, ['style', 'styles'])}`}
          />
        </div>
        <Button
          disabled={this.disableChangePersonalInformation()}
          isInProcess={changePersonalInformationInProcess}
          text={CommonMessagesConstants.SAVE}
          className={classNames('w-100pct m-top-10', Styles.FavoriteStylesPopup__buttonSave)}
          onClick={this.changePersonalInformation}
        />
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
    changePersonalInformationInProcess: state.PersonalReducer.changePersonalInformationInProcess,
  }),
  (dispatch) => ({
    changePersonalInformationRequest: (formData) => changePersonalInformationRequestAction(formData)(dispatch),
  })
)(FavoriteStylesPopup);
