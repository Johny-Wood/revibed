import { Component, createRef } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import PricingPolicyCheckBox from '@/components/common-ui/check-boxes/PricingPolicyCheckBox';
import ArtistsInput from '@/components/common-ui/inputs/ArtistsInput';
import FriendsInput from '@/components/common-ui/inputs/FriendsInput';
import GenresInput from '@/components/common-ui/inputs/GenresInput';
import InputWithTag from '@/components/common-ui/inputs/InputWithTag';
import LabelsInput from '@/components/common-ui/inputs/LabelsInput';
import StylesInput from '@/components/common-ui/inputs/StylesInput';
import CountrySelect from '@/components/common-ui/selects/CountrySelect';
import MediaConditionSelect from '@/components/common-ui/selects/MediaConditionSelect';
import SleeveConditionSelect from '@/components/common-ui/selects/SleeveConditionSelect';
import FileUploader from '@/components/common/FileUploader';
import AddProjectComment from '@/components/forms/project/AddProjectForm/_components/AddProjectComment';
import AddProjectGroup from '@/components/forms/project/AddProjectForm/_components/AddProjectGroup';
import AddProjectSaveButtons from '@/components/forms/project/AddProjectForm/_components/AddProjectSaveButtons';
import AddProjectStep from '@/components/forms/project/AddProjectForm/_components/AddProjectStep';
import AddYoutubeLink from '@/components/forms/project/AddProjectForm/_components/AddYoutubeLink';
import AddYoutubeLinkButton from '@/components/forms/project/AddProjectForm/_components/AddYoutubeLink/_components/AddYoutubeLinkButton';
import CreateProjectBonusBanner from '@/components/forms/project/AddProjectForm/_components/CreateProjectBonusBanner';
import CreateProjectBonusCheckbox from '@/components/forms/project/AddProjectForm/_components/CreateProjectBonusCheckbox';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import CheckBox from '@/components/ui/inputs/CheckBox';
import CustomInputMask from '@/components/ui/inputs/CustomInputMask';
import Input from '@/components/ui/inputs/Input';
import TextArea from '@/components/ui/inputs/TextArea';
import LinkRoute from '@/components/ui/links/LinkRoute';
import ToolTip from '@/components/ui/ToolTip';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonInputsConstants } from '@/constants/common/inputs';
import { CommonMasksConstants } from '@/constants/common/masks';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { PopupCommonIdsConstants, PopupProjectIdsConstants } from '@/constants/popups/id';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import {
  createProjectAutoFillRequestAction,
  createProjectClearAutoFillAction,
  updateProjectExternalInfoAction,
} from '@/redux-actions/create-project/createProjectActions';
import { deleteUnreadPersonalNotificationCountsEventAction } from '@/redux-actions/personal/personalNotificationCountsActions';
import NextRouter from '@/services/NextRouter';
import ScrollService from '@/services/scroll/ScrollService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { normalizeYearUtil } from '@/utils/dateUtils';
import {
  changeCheckBoxHandler,
  changeInputHandler,
  pressEnterKeyInputHandler,
  setInputError,
  validateField,
} from '@/utils/inputHandlersUtil';
import { clearSymbolsUtil, floatWithCommaFixedUtil } from '@/utils/textUtils';
import { ValidateBadRequestUtil } from '@/utils/validate/inputCheckValidate';

import cStyles from './styles.module.scss';

const MAX_YOUTUBE_LINKS = 10;
const VIDEO_STATE_ID_PREFIX = 'video-';

const returnInitialVideoItem = (id = 0) => ({
  [`${VIDEO_STATE_ID_PREFIX}${id}`]: {
    value: '',
  },
});

const projectAlreadyExistMessage = ({ link = '' }) => (
  <span>
    The Pre-order for this release already exists.&nbsp;
    <LinkRoute className="error-msg__link c-blue underline" href={link} text="Join the Pre-order" />
  </span>
);

const getAutofilledFields = ({
  itemLink,
  files,
  year,
  country,
  price,
  album,
  artists,
  labels,
  mediaCondition,
  sleeveCondition,
}) => {
  const autoFilled = [];

  if (files.length > 0) {
    autoFilled.push('files');
  }

  if (itemLink) {
    autoFilled.push('itemLink');
  }

  if (year) {
    autoFilled.push('year');
  }

  if (country) {
    autoFilled.push('country');
  }

  if (price) {
    autoFilled.push('price');
  }

  if (album) {
    autoFilled.push('album');
  }

  if (artists.length > 0) {
    autoFilled.push('artists');
  }

  if (labels.length > 0) {
    autoFilled.push('labels');
  }

  if (mediaCondition) {
    autoFilled.push('mediaCondition');
  }

  if (sleeveCondition) {
    autoFilled.push('sleeveCondition');
  }

  return autoFilled;
};

class AddProjectForm extends Component {
  constructor(props) {
    super(props);

    this.newProjectRef = createRef();

    this.changeInputHandler = changeInputHandler.bind(this);
    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.setInputError = setInputError.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    const {
      languageSelected: { language } = {},
      itemId,
      project: {
        priceInfo,
        isPrivate: privateProject,
        invitedUsers = [],
        invitedEmails = [],
        covers = [],
        youtubeLinks = [],
        marketplaceLink: itemLink,
        priceBuy: price,
        albumTitle: albumName,
        description: projectComment,
        artists: selectedArtists = [],
        inviteText,
        mediaCondition,
        sleeveCondition,
        founderStartCutsCount,
        founderUseGem,
        founderUseGoldenCoin,
        releaseDetails: {
          year,
          styles: selectedStyles = [],
          labels: selectedLabels = [],
          genres: selectedGenres = [],
          country,
        } = {},
      } = {},
      isProjectEdit,
      restartProjectId,
      externalInfo: { description = '' } = {},
    } = props;

    const inviteEmails = invitedEmails.map((email) => ({
      id: email,
      name: email,
      value: email,
    }));

    const countryProps = country
      ? [
          {
            id: country.id,
            value: country.id,
            label: country[`title_${language}`],
          },
        ]
      : [];

    const youtubeLinksForState = {};
    youtubeLinks.forEach(({ id, link }, idx) => {
      if (idx + 1 > MAX_YOUTUBE_LINKS) {
        return;
      }
      youtubeLinksForState[`${VIDEO_STATE_ID_PREFIX}${idx}`] = {
        id,
        value: link,
        type: 'PROJECT',
      };
    });

    const founderUseGemState = founderUseGem === undefined ? this.canFounderUseGem() : founderUseGem && this.canFounderUseGem();

    this.initialState = {
      autoFilled: isProjectEdit
        ? getAutofilledFields({
            files: covers,
            labels: selectedLabels,
            year,
            album: albumName,
            itemLink,
            country,
            mediaCondition,
            artists: selectedArtists,
            sleeveCondition,
            price,
          })
        : [],
      priceInfo: priceInfo || {},
      status: undefined,

      agree: false,
      privateProject: privateProject || false,
      sellerComment: false,

      itemLink: itemLink || itemId || '',
      itemLinkError: false,
      itemLinkErrorMsg: '',

      selectedArtists: selectedArtists || [],
      artists: '',
      artistsError: false,
      artistsErrorMsg: '',

      covers: covers || [],
      selectedFiles: covers || [],
      selectedFilesBlob: [],

      albumName: albumName || '',
      albumNameError: false,
      albumNameErrorMsg: '',

      selectedLabels: selectedLabels || [],
      labels: '',
      labelsError: false,
      labelsErrorMsg: '',

      year: year || '',
      yearError: false,
      yearErrorMsg: '',

      country: countryProps || [],

      selectedGenres: selectedGenres || [],
      genres: '',
      genresError: false,
      genresErrorMsg: '',

      selectedStyles: selectedStyles || [],
      styles: '',
      stylesError: false,
      stylesErrorMsg: '',

      selectedMediaCondition: mediaCondition
        ? [
            {
              id: mediaCondition.id,
              name: mediaCondition.shortTitle,
              value: mediaCondition.id,
              label: `${mediaCondition.title} (${mediaCondition.shortTitle})`,
            },
          ]
        : [],
      mediaConditionError: false,
      mediaConditionErrorMsg: '',

      selectedSleeveCondition: sleeveCondition
        ? [
            {
              id: sleeveCondition.id,
              name: sleeveCondition.shortTitle,
              value: sleeveCondition.id,
              label: `${sleeveCondition.title} (${sleeveCondition.shortTitle})`,
            },
          ]
        : [],
      sleeveConditionError: false,
      sleeveConditionErrorMsg: '',

      youtubeLinks: Object.keys(youtubeLinksForState).length > 0 ? youtubeLinksForState : { ...returnInitialVideoItem() },

      projectComment: (!restartProjectId ? projectComment : description) || '',
      projectCommentError: false,
      projectCommentErrorMsg: '',

      price: price || '',
      priceError: false,
      priceErrorMsg: '',

      selectedFriends: invitedUsers || [],
      friends: '',
      friendsError: false,
      friendsErrorMsg: '',

      selectedInviteEmails: inviteEmails || [],
      inviteEmails: '',
      inviteEmailsError: false,
      inviteEmailsErrorMsg: '',

      inviteText: inviteText || '',
      inviteTextError: false,
      inviteTextErrorMsg: '',

      founderStartCutsCount: founderStartCutsCount || this.getMinCutCount({ founderUseGemState }),

      founderUseGem: founderUseGemState,
      founderUseGemError: false,
      founderUseGemErrorMsg: '',

      founderUseGoldenCoin:
        founderUseGoldenCoin === undefined
          ? this.canFounderUseGoldenKoin()
          : founderUseGoldenCoin && this.canFounderUseGoldenKoin(),
      founderUseGoldenCoinError: false,
      founderUseGoldenCoinErrorMsg: '',

      cutsCountHandChanged: false,
    };

    this.state = this.initialState;
  }

  componentDidMount() {
    const {
      isProjectEdit,
      projectId,
      deleteUnreadEventAction,
      userInfo: { createProjectsDisabled } = {},
      showPopup,
      variablesList: { START_PROJECT_ENABLED } = {},
    } = this.props;

    const { router = {} } = NextRouter.getInstance();

    if (START_PROJECT_ENABLED) {
      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
        ScrollBlockIdConstants.CREATE_PROJECT,
        RoutePathsConstants.DRAFTS_ADD,
        this.newProjectRef
      );

      if (createProjectsDisabled) {
        router.push(RoutePathsConstants.PROJECTS).then(() => {
          showPopup(PopupProjectIdsConstants.CreateProjectsDisabledPopup, {
            typeAction: isProjectEdit && 'edit',
          });
        });
      }

      this.autoFillFromQuery();

      if (isProjectEdit) {
        deleteUnreadEventAction([+projectId], {
          location: ProjectsLocationsConstants.MY_PROJECTS,
        });
      }
    }
  }

  componentDidUpdate(_, prevState) {
    const { founderUseGem } = this.state;
    const { founderUseGem: founderUseGemPrev } = prevState;

    if (founderUseGem !== founderUseGemPrev) {
      this.updateFounderStartCutsCount({ founderUseGem });
    }
  }

  componentWillUnmount() {
    const { createProjectClearAutoFill, updateProjectExternalInfo } = this.props;

    createProjectClearAutoFill({});
    updateProjectExternalInfo({ externalInfo: { description: '' } });
  }

  updateFounderStartCutsCount = ({ founderUseGem }) => {
    this.setState({
      founderStartCutsCount: this.getMinCutCount({ founderUseGemState: founderUseGem }),
    });
  };

  canFounderUseGoldenKoin = () => {
    const { variablesList: { CREATE_PROJECT_USE_GOLDEN_COIN_ALLOWED } = {}, userInfo: { goldenCoinsCount } = {} } = this.props;

    return goldenCoinsCount > 0 && CREATE_PROJECT_USE_GOLDEN_COIN_ALLOWED;
  };

  canFounderUseGem = () => {
    const { variablesList: { CREATE_PROJECT_USE_GEM_ALLOWED } = {}, userInfo: { gemsCount } = {} } = this.props;

    return gemsCount > 0 && CREATE_PROJECT_USE_GEM_ALLOWED && !this.canFounderUseGoldenKoin();
  };

  autoFillFromQuery = () => {
    const { itemId } = this.props;

    if (itemId) {
      this.autoFillItemLink();
    }
  };

  disabledItemLinkButton = () => {
    const { autoFilled, itemLink, itemLinkError } = this.state;

    const { createProjectAutoFillInProcess } = this.state;

    return createProjectAutoFillInProcess || !itemLink || itemLinkError || autoFilled.includes('itemLink');
  };

  autoFillItemLink = () => {
    const { itemLink } = this.state;
    const { createProjectAutoFillRequest } = this.props;

    if (this.disabledItemLinkButton()) {
      return;
    }

    createProjectAutoFillRequest(itemLink)
      .then((createProjectData) => {
        this.autoFillFields(createProjectData);
      })
      .catch(({ error, payload: { errorField, projectLink = '' } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            NOT_FOUND: () => {
              this.setInputError('itemLink', CommonErrorMessages.PROJECT_INVALID_LINK);
            },
            PROJECT_ALREADY_EXIST: () => {
              this.setInputError('itemLink', () => projectAlreadyExistMessage({ link: projectLink }));
            },
          });
        }
      });
  };

  autoFillFields = (createProjectData) => {
    const {
      price = '',
      mediaCondition: mediaConditionProps,
      sleeveCondition: sleeveConditionProps,
      release: {
        covers: coversProps = [],
        country: countryProps,
        album = '',
        artists = [],
        labels = [],
        genres = [],
        styles = [],
        videos: youtubeLinksProps = [],
        year: yearProps = '',
      } = {},
      priceInfo = {},
    } = createProjectData;

    const { languageSelected: { language } = {} } = this.props;

    const { selectedFiles } = this.state;

    const selectedCoversArr = coversProps.map(({ id, path }) => ({
      file: path,
      fileName: id,
      id,
    }));

    const selectedFilesAttachment = selectedFiles.filter(({ isAttachment }) => isAttachment);
    const selectedFilesTmp = cloneDeep([...selectedCoversArr, ...selectedFilesAttachment]);
    const youtubeLinks = {};

    youtubeLinksProps.forEach(({ id, link }, idx) => {
      if (idx + 1 > MAX_YOUTUBE_LINKS) {
        return;
      }
      youtubeLinks[`${VIDEO_STATE_ID_PREFIX}${idx}`] = {
        id,
        value: link,
        type: 'RELEASE',
      };
    });

    this.setState({
      autoFilled: getAutofilledFields({
        files: coversProps,
        itemLink: true,
        labels,
        year: yearProps,
        price,
        artists,
        country: countryProps,
        album,
        mediaCondition: mediaConditionProps,
        sleeveCondition: sleeveConditionProps,
      }),
      priceInfo,
      covers: coversProps,
      selectedFiles: selectedFilesTmp,
      country: countryProps
        ? [
            {
              id: countryProps.id,
              value: countryProps.id,
              label: countryProps[`title_${language}`],
            },
          ]
        : [],
      selectedStyles: styles || [],
      selectedGenres: genres || [],
      selectedArtists: artists || [],
      selectedLabels: labels || [],
      albumName: album || '',
      youtubeLinks: Object.keys(youtubeLinks).length > 0 ? youtubeLinks : { ...returnInitialVideoItem() },
      year: yearProps || '',
      price: parseFloat(price).toFixed(2) || '',
      selectedMediaCondition: mediaConditionProps
        ? [
            {
              id: mediaConditionProps.id,
              name: mediaConditionProps.title,
              value: mediaConditionProps.id,
              label: `${mediaConditionProps.title}${
                mediaConditionProps.shortTitle ? ` (${mediaConditionProps.shortTitle})` : ''
              }`,
            },
          ]
        : [],
      selectedSleeveCondition: sleeveConditionProps
        ? [
            {
              id: sleeveConditionProps.id,
              name: sleeveConditionProps.title,
              value: sleeveConditionProps.id,
              label: `${sleeveConditionProps.title}${
                sleeveConditionProps.shortTitle ? ` (${sleeveConditionProps.shortTitle})` : ''
              }`,
            },
          ]
        : [],
    });
  };

  changeArtists = (selectedArtists) => {
    this.setState({
      artists: '',
      selectedArtists,
    });
  };

  changeLabels = (selectedLabels) => {
    this.setState({
      labels: '',
      selectedLabels,
    });
  };

  changeFriends = (selectedFriends) => {
    this.setState({
      friends: '',
      selectedFriends,
    });
  };

  changeInviteEmails = (selectedInviteEmails, removeFlag) => {
    const { inviteEmails } = this.state;

    this.setState({
      inviteEmails: !removeFlag ? '' : inviteEmails,
      selectedInviteEmails,
    });
  };

  changeGenres = (selectedGenres) => {
    this.setState({
      genres: '',
      selectedGenres,
    });
  };

  changeStyles = (selectedStyles) => {
    this.setState({
      styles: '',
      selectedStyles,
    });
  };

  changeCountry = (selectedCountry) => {
    this.setState({
      country: [selectedCountry],
    });
  };

  changeMediaCondition = (selectedMediaCondition) => {
    this.setState({
      selectedMediaCondition,
    });
  };

  changeSleeveCondition = (selectedSleeveCondition) => {
    this.setState({
      selectedSleeveCondition,
    });
  };

  uploadCoverCallback = (files) => {
    this.setState({
      selectedFiles: [...files],
    });
  };

  uploadCoverBlobCallback = (files) => {
    const { selectedFilesBlob } = this.state;

    this.setState({
      selectedFilesBlob: [...selectedFilesBlob, ...files],
    });
  };

  onRemoveFile = (id) => {
    const { covers, selectedFiles, selectedFilesBlob } = this.state;

    const tmpFiles = cloneDeep(selectedFiles);
    const findIdx = tmpFiles.findIndex((f) => f.id === id);

    if (findIdx > -1) {
      tmpFiles.splice(findIdx, 1);
    }

    const tmpCovers = cloneDeep(covers);
    const findCoversIdx = tmpCovers.findIndex((f) => f.id === id);

    if (findCoversIdx > -1) {
      tmpCovers.splice(findCoversIdx, 1);
    }

    const tmpBlob = cloneDeep(selectedFilesBlob);
    const findBlobIdx = tmpBlob.findIndex((f) => f.id === id);

    if (findBlobIdx > -1) {
      tmpBlob.splice(findBlobIdx, 1);
    }

    this.setState({
      selectedFiles: tmpFiles,
      covers: tmpCovers,
      selectedFilesBlob: tmpBlob,
    });
  };

  discardChangesDisabled = () => {
    const { createProjectInProcess, editProjectInProcess } = this.props;

    return createProjectInProcess || editProjectInProcess;
  };

  discardChanges = () => {
    if (this.discardChangesDisabled()) {
      return;
    }

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
      .scrollToElement({
        sectionId: ScrollBlockIdConstants.CREATE_PROJECT,
        secondOffset: 300,
        inRoute: true,
      })
      .then();

    this.setState({
      ...this.initialState,
    });
  };

  createFormData = (status) => {
    const {
      itemLink,
      privateProject,
      albumName,
      year,
      country = [],
      selectedMediaCondition = [],
      selectedSleeveCondition = [],
      youtubeLinks = {},
      projectComment,
      selectedArtists = [],
      selectedGenres = [],
      selectedStyles = [],
      selectedLabels = [],
      price,
      selectedFilesBlob = [],
      covers = [],
      selectedFriends = [],
      selectedInviteEmails = [],
      inviteText,
      founderStartCutsCount,
      founderUseGem,
      founderUseGoldenCoin,
    } = this.state;

    const formData = new FormData();
    const artistsParam = selectedArtists.map(({ id }) => id);
    const genresParam = selectedGenres.map(({ id }) => id);
    const stylesParam = selectedStyles.map(({ id }) => id);
    const labelsParam = selectedLabels.map(({ id }) => id);
    const countryParam = country[0]?.id;
    const mediaConditionParam = selectedMediaCondition[0]?.id;
    const sleeveConditionParam = selectedSleeveCondition[0]?.id;

    formData.append('founderStartCutsCount', founderStartCutsCount);

    formData.append('inviteText', inviteText || '');

    let invitesCounter = 0;

    for (let i = 0; i < selectedFriends.length; i++) {
      formData.append(`invites[${invitesCounter}].userId`, selectedFriends[i].id || '');
      invitesCounter++;
    }

    for (let i = 0; i < selectedInviteEmails.length; i++) {
      formData.append(`invites[${invitesCounter}].email`, selectedInviteEmails[i].id || '');
      invitesCounter++;
    }

    for (let i = 0; i < covers.length; i++) {
      formData.append(`covers[${i}].id`, covers[i].id);
      formData.append(`covers[${i}].type`, covers[i].type);
    }

    for (let i = 0; i < selectedFilesBlob.length; i++) {
      const { file } = selectedFilesBlob[i];
      formData.append('attachments', file || '');
    }

    formData.append('itemLink', itemLink || '');
    formData.append('private', privateProject);

    for (let i = 0; i < artistsParam.length; i++) {
      formData.append('releaseInfo.artists', artistsParam[i] || '');
    }

    for (let i = 0; i < genresParam.length; i++) {
      formData.append('releaseInfo.genres', genresParam[i] || '');
    }

    for (let i = 0; i < stylesParam.length; i++) {
      formData.append('releaseInfo.styles', stylesParam[i] || '');
    }

    for (let i = 0; i < labelsParam.length; i++) {
      formData.append('releaseInfo.labels', labelsParam[i] || '');
    }

    Object.keys(youtubeLinks).forEach((key, idx) => {
      const { id, type, value } = youtubeLinks[key] || {};
      if (id) {
        formData.append(`releaseInfo.youtubeLinks[${idx}].id`, id || '');
        formData.append(`releaseInfo.youtubeLinks[${idx}].type`, type || 'PROJECT');
      } else if (value) {
        formData.append(`releaseInfo.youtubeLinks[${idx}].link`, value || '');
      }
    });

    formData.append('releaseInfo.albumName', albumName || '');
    formData.append('releaseInfo.year', year || '');

    if (countryParam) {
      formData.append('releaseInfo.country', countryParam || '');
    }

    if (mediaConditionParam) {
      formData.append('releaseInfo.mediaCondition', mediaConditionParam || '');
    }

    if (sleeveConditionParam) {
      formData.append('releaseInfo.sleeveCondition', sleeveConditionParam || '');
    }

    formData.append('releaseInfo.description', projectComment || '');

    formData.append('paymentInfo.price', parseFloat(price) || '');

    if (this.canFounderUseGoldenKoin()) {
      formData.append('founderUseGoldenCoin', founderUseGoldenCoin);
    }

    if (this.canFounderUseGem()) {
      formData.append('founderUseGem', founderUseGem);
    }

    formData.append('status', status || '');

    return formData;
  };

  requestCatch = ({ error, errorData: { invalidLinks } = {}, errorField, link = '' }) => {
    const { showPopup, variablesList: { FOUNDER_MIN_START_CUTS_COUNT } = {} } = this.props;

    this.setState({ status: undefined });

    if (error) {
      handleErrorUtil(error, {
        BAD_REQUEST: () => {
          this.badRequest(errorField);
        },
        ITEM_NOT_FOUND: () => {
          this.setInputError('itemLink', CommonErrorMessages.ITEM_NOT_FOUND);
        },
        RELEASE_NOT_FOUND: () => {
          this.setInputError('itemLink', CommonErrorMessages.RELEASE_NOT_FOUND);
        },
        ARTISTS_REQUIRED: () => {
          this.setInputError('artists', CommonErrorMessages.REQUIRED);
        },
        MEDIA_CONDITION_REQUIRED: () => {
          this.setInputError('mediaCondition', CommonErrorMessages.REQUIRED);
        },
        SLEEVE_CONDITION_REQUIRED: () => {
          this.setInputError('sleeveCondition', CommonErrorMessages.REQUIRED);
        },
        INSUFFICIENT_FUNDS: () => {
          showPopup(PopupProjectIdsConstants.InsufficientFundsPopup);
        },
        PROJECT_NOT_FOUND: () => {
          showPopup(PopupProjectIdsConstants.ProjectNotFoundPopup);
        },
        INVALID_MIN_START_CUTS_COUNT: () => {
          showPopup(PopupCommonIdsConstants.WarningPopup, {
            text: `${CommonErrorMessages.MIN_VALUE}${FOUNDER_MIN_START_CUTS_COUNT}`,
          });
        },
        PROJECT_ALREADY_EXIST: () => {
          this.setInputError('itemLink', () => projectAlreadyExistMessage({ link }));
        },
        USE_GEM_FOR_CREATE_PROJECT_NOT_ALLOWED: () => {
          this.setInputError('founderUseGem', CommonErrorMessages.USE_GEM_FOR_CREATE_PROJECT_NOT_ALLOWED);
        },
        CREATE_PROJECT_GEM_NOT_EXISTS: () => {
          this.setInputError('founderUseGem', CommonErrorMessages.CREATE_PROJECT_GEM_NOT_EXISTS);
        },
        USE_GOLDEN_COIN_FOR_CREATE_PROJECT_NOT_ALLOWED: () => {
          this.setInputError('founderUseGoldenCoin', CommonErrorMessages.USE_GOLDEN_COIN_FOR_CREATE_PROJECT_NOT_ALLOWED);
        },
        PERMISSION_DENIED: () => {
          const { router = {} } = NextRouter.getInstance();

          router.push(RoutePathsConstants.MY_PROJECTS);
        },
        INVALID_YOUTUBE_LINKS: () => {
          this.setInvalidErrorYoutubeLinks(invalidLinks);
        },
      });
    }
  };

  setInvalidErrorYoutubeLinks = (invalidLinks = []) => {
    const { youtubeLinks } = this.state;

    invalidLinks.forEach(({ link }) => {
      Object.keys(youtubeLinks).forEach((key) => {
        const { value } = youtubeLinks[key] || {};

        if (value === link) {
          this[`youtubeLinks${key}`] = createRef();

          ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
            `createProjectYoutubeLinks${key}Id`,
            RoutePathsConstants.DRAFTS_ADD,
            this[`youtubeLinks${key}`]
          );

          this.setState(
            ({ youtubeLinks: prevYoutubeLinks }) => ({
              youtubeLinks: {
                ...prevYoutubeLinks,
                [key]: {
                  ...prevYoutubeLinks[key],
                  error: true,
                  message: CommonErrorMessages.INVALID_LINK,
                },
              },
            }),
            () => {
              ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
                .scrollToElement({
                  sectionId: `createProjectYoutubeLinks${key}Id`,
                  secondOffset: 300,
                  inRoute: true,
                })
                .then();
            }
          );
        }
      });
    });
  };

  getMinCutCount = ({ founderUseGemState }) => {
    const { variablesList: { FOUNDER_MIN_START_CUTS_COUNT = 1, CREATE_PROJECT_GEM_VALUE_PERCENTAGE = 1 } = {} } = this.props;

    return founderUseGemState ? CREATE_PROJECT_GEM_VALUE_PERCENTAGE : FOUNDER_MIN_START_CUTS_COUNT;
  };

  renderPriceInfo = () => {
    const {
      agree,
      priceInfo: { cutPrice = 0 } = {},
      founderUseGem,
      founderUseGemError,
      founderUseGemErrorMsg,
      founderUseGoldenCoin,
      founderUseGoldenCoinError,
      founderUseGoldenCoinErrorMsg,
    } = this.state;

    const {
      variablesList: {
        CREATE_PROJECT_GEM_VALUE_PERCENTAGE,
        CREATE_PROJECT_GOLDEN_COIN_VALUE_PERCENTAGE,
        PROJECT_FOUNDER_CONTRIBUTION_PRICE,
      } = {},
    } = this.props;

    const usedGoldenCoin = this.canFounderUseGoldenKoin() && founderUseGoldenCoin;
    const usedGem = this.canFounderUseGem() && founderUseGem;

    return (
      <div className={cStyles.createProjectPrice}>
        <div className={classNames(cStyles.createProjectPrice__item, 'f_direction_column f-y-start')}>
          <div className="f-y-end f-x-between w-100pct">
            <div className={classNames(globalStyles.relative, 'text_size_20 m-bottom-15 f-y-center')}>
              <span>Pay:&nbsp;&nbsp;&nbsp;</span>
              <TransitionSwitchLayout isShown={usedGoldenCoin || usedGem}>
                <span className={classNames(cStyles.createProjectPrice__sale, globalStyles.lineThrough)}>
                  <Coin type="xl" size={15} offset={false} color="gray-3">
                    <span>
                      {floatWithCommaFixedUtil(
                        cutPrice *
                          (usedGoldenCoin ? CREATE_PROJECT_GOLDEN_COIN_VALUE_PERCENTAGE : CREATE_PROJECT_GEM_VALUE_PERCENTAGE)
                      )}
                    </span>
                  </Coin>
                </span>
              </TransitionSwitchLayout>
              <span
                className={classNames(
                  cStyles.createProjectPrice__full,
                  usedGem && cStyles.createProjectPrice__full_useGem,
                  usedGoldenCoin && cStyles.createProjectPrice__full_useGoldenCoin
                )}
              >
                <Coin
                  type="xl"
                  size={20}
                  offset={false}
                  colorUrl={usedGem ? 'gem-gradient' : undefined}
                  isGoldenCoin={usedGoldenCoin}
                >
                  <span>{floatWithCommaFixedUtil(PROJECT_FOUNDER_CONTRIBUTION_PRICE)}</span>
                </Coin>
              </span>
            </div>
          </div>
          {this.canFounderUseGem() && (
            <CreateProjectBonusCheckbox
              id="founderUseGem"
              type="GEM"
              checked={founderUseGem}
              error={founderUseGemError}
              onChange={(e) => {
                this.changeCheckBoxHandler(e);

                if (!founderUseGemError) {
                  return;
                }

                this.setState({
                  founderUseGemError: false,
                  founderUseGemErrorMsg: '',
                });
              }}
            />
          )}
          <ErrorInputMessage invalidMessage={founderUseGemErrorMsg} invalid={founderUseGemError} />
          {this.canFounderUseGoldenKoin() && (
            <CreateProjectBonusCheckbox
              id="founderUseGoldenCoin"
              type="GOLDEN_COIN"
              checked={founderUseGoldenCoin}
              error={founderUseGoldenCoinError}
              onChange={(e) => {
                this.changeCheckBoxHandler(e);

                if (!founderUseGoldenCoinError) {
                  return;
                }

                this.setState({
                  founderUseGoldenCoinError: false,
                  founderUseGoldenCoinErrorMsg: '',
                });
              }}
            />
          )}
          <ErrorInputMessage invalidMessage={founderUseGoldenCoinErrorMsg} invalid={founderUseGoldenCoinError} />
        </div>
        <PricingPolicyCheckBox
          id="agree"
          checked={agree}
          onChange={this.changeCheckBoxHandler}
          className="w-auto checkbox-agree"
          anchor="project-creation"
        />
        <p className={cStyles.createProjectInstruction}>
          The record will be&nbsp;purchased under the conditions outlined in&nbsp;the estimate shown above or&nbsp;better (record
          quality will be&nbsp;equal to&nbsp;estimate or&nbsp;better). All pre-orders are subject to&nbsp;pre-moderation. This
          review process can take up&nbsp;to&nbsp;8&nbsp;hours. Pre-orders not published after review will be&nbsp;saved
          as&nbsp;drafts. All pre-order campaigns are open for a&nbsp;limited time. If&nbsp;a&nbsp;pre-order fails to&nbsp;attract
          sufficient funding, all participants will be&nbsp;refunded.
        </p>
      </div>
    );
  };

  changeInputHandlerVideos = ({ target: { value, id } = {} }) => {
    const { youtubeLinks } = this.state;
    const { project: { youtubeLinks: youtubeLinksProps = [] } = {}, createProjectData: { release: { videos = [] } = {} } = {} } =
      this.props;

    const newVideos = cloneDeep(youtubeLinks);

    newVideos[id].value = value;
    newVideos[id].error = false;
    newVideos[id].message = '';

    if (newVideos[id]?.id) {
      const { link: linkFromAutoFill } = videos.find(({ id: foundId }) => foundId === newVideos[id].id) || {};
      const { link: linkFromProps } = youtubeLinksProps.find(({ id: foundId }) => foundId === newVideos[id].id) || {};

      if ((!!linkFromAutoFill && linkFromAutoFill !== value) || (!!linkFromProps && linkFromProps !== value)) {
        delete newVideos[id].id;
      }
    }

    this.setState({
      youtubeLinks: newVideos,
    });
  };

  removeInputHandlerVideos = (id) => {
    const { youtubeLinks } = this.state;
    const newVideos = cloneDeep(youtubeLinks);
    delete newVideos[id];

    this.setState({
      youtubeLinks: newVideos,
    });
  };

  addNewVideoLink = () => {
    const { youtubeLinks } = this.state;

    if (this.disableAddNewVideoLink()) {
      return;
    }

    const maxId = Math.max(...Object.keys(youtubeLinks).map((key) => +key.split(VIDEO_STATE_ID_PREFIX).pop()));

    this.setState({
      youtubeLinks: { ...youtubeLinks, ...returnInitialVideoItem(maxId + 1) },
    });
  };

  disableAddNewVideoLink = () => {
    const { youtubeLinks } = this.state;
    return Object.keys(youtubeLinks).length === MAX_YOUTUBE_LINKS;
  };

  disabledDraftButton = () => {
    const { createProjectInProcess, editProjectInProcess } = this.props;

    const {
      itemLink,
      selectedArtists,
      albumName,
      selectedLabels,
      year,
      country,
      selectedGenres,
      selectedStyles,
      selectedMediaCondition,
      selectedSleeveCondition,
      projectComment,
      price,
      selectedFriends,
      selectedInviteEmails,
      inviteText,

      itemLinkError,
      artistsError,
      albumNameError,
      labelsError,
      yearError,
      genresError,
      stylesError,
      mediaConditionError,
      sleeveConditionError,
      projectCommentError,
      priceError,
      inviteTextError,
      friendsError,
      inviteEmailsError,
      founderUseGemError,
      founderUseGoldenCoinError,
    } = this.state;

    return (
      createProjectInProcess ||
      editProjectInProcess ||
      itemLinkError ||
      artistsError ||
      albumNameError ||
      labelsError ||
      yearError ||
      genresError ||
      stylesError ||
      mediaConditionError ||
      sleeveConditionError ||
      projectCommentError ||
      priceError ||
      inviteTextError ||
      friendsError ||
      inviteEmailsError ||
      founderUseGemError ||
      founderUseGoldenCoinError ||
      !(
        itemLink ||
        selectedArtists.length > 0 ||
        albumName ||
        selectedLabels.length > 0 ||
        year ||
        country.length > 0 ||
        selectedGenres.length > 0 ||
        selectedStyles.length > 0 ||
        selectedMediaCondition.length > 0 ||
        selectedSleeveCondition.length > 0 ||
        projectComment ||
        price ||
        selectedFriends.length > 0 ||
        selectedInviteEmails.length > 0 ||
        inviteText
      )
    );
  };

  disabledPublishButton = () => {
    const { createProjectInProcess, editProjectInProcess } = this.props;

    const {
      agree,

      itemLink,
      itemLinkError,

      selectedArtists,
      artistsError,

      albumName,
      albumNameError,

      selectedMediaCondition,
      mediaConditionError,
      selectedSleeveCondition,
      sleeveConditionError,

      price,
      priceError,

      labelsError,
      yearError,
      genresError,
      stylesError,
      projectCommentError,
      friendsError,
      inviteEmailsError,
      inviteTextError,
      founderUseGemError,
      founderUseGoldenCoinError,
    } = this.state;

    return (
      createProjectInProcess ||
      editProjectInProcess ||
      !agree ||
      !itemLink ||
      itemLinkError ||
      selectedArtists.length <= 0 ||
      artistsError ||
      !albumName ||
      albumNameError ||
      selectedMediaCondition.length <= 0 ||
      mediaConditionError ||
      selectedSleeveCondition.length <= 0 ||
      sleeveConditionError ||
      !price ||
      priceError ||
      labelsError ||
      yearError ||
      genresError ||
      stylesError ||
      projectCommentError ||
      friendsError ||
      inviteEmailsError ||
      inviteTextError ||
      founderUseGemError ||
      founderUseGoldenCoinError
    );
  };

  render() {
    const {
      status,

      autoFilled,

      privateProject,
      sellerComment,

      itemLink,
      itemLinkError,
      itemLinkErrorMsg,

      selectedFiles,

      selectedArtists,
      artists,
      artistsError,
      artistsErrorMsg,

      albumName,
      albumNameError,
      albumNameErrorMsg,

      selectedLabels,
      labels,
      labelsError,
      labelsErrorMsg,

      country,

      year,
      yearError,
      yearErrorMsg,

      selectedGenres,
      genres,
      genresError,
      genresErrorMsg,

      selectedStyles,
      styles,
      stylesError,
      stylesErrorMsg,

      selectedMediaCondition,
      mediaConditionError,
      mediaConditionErrorMsg,

      selectedSleeveCondition,
      sleeveConditionError,
      sleeveConditionErrorMsg,

      youtubeLinks,

      projectComment,
      projectCommentError,
      projectCommentErrorMsg,

      selectedFriends,
      friends,
      friendsError,
      friendsErrorMsg,

      selectedInviteEmails,
      inviteEmails,
      inviteEmailsError,
      inviteEmailsErrorMsg,

      inviteText,
      inviteTextError,
      inviteTextErrorMsg,

      founderStartCutsCount,
      priceInfo: { cutPrice = 0 } = {},
    } = this.state;

    const {
      projectId,
      isProjectEdit,
      pageTitle,
      createProjectAutoFillInProcess,
      variablesList: { FRIENDS_DISABLE, START_PROJECT_ENABLED, START_PROJECT_SUB_TEXT } = {},
    } = this.props;

    return (
      <div ref={this.newProjectRef} className={cStyles.draftProject}>
        {START_PROJECT_ENABLED ? (
          <>
            {this.canFounderUseGem() && <CreateProjectBonusBanner type="GEM" />}
            {this.canFounderUseGoldenKoin() && <CreateProjectBonusBanner type="GOLDEN_COIN" />}
            <h2 className={cStyles.draftProject__title}>{pageTitle}</h2>
            <div className="m-top-5 c-gray-2">To add a new pre-order, fill in the form</div>
            <AddProjectStep
              stepNumber={1}
              stepName={`${CommonMessagesConstants.PREORDER} details`}
              headerChild={
                <ToolTip
                  color="blue"
                  text="After inserting the link, the information will be auto-filled in the following fields"
                />
              }
            >
              <div className={cStyles.draftProject__formGroup}>
                <div className="inputs column-1">
                  <div className="input-with-button">
                    <Input
                      id="itemLink"
                      label="Paste relevant link to the item*"
                      value={itemLink}
                      invalid={itemLinkError}
                      invalidMessage={itemLinkErrorMsg}
                      onChange={this.changeInputHandler}
                      onKeyDown={(e) => pressEnterKeyInputHandler(e, this.autoFillItemLink)}
                      disabled={autoFilled.includes('itemLink') || createProjectAutoFillInProcess}
                    />
                    <Button
                      text="Аutofill"
                      transparent
                      borderColor="gray-4"
                      disabled={this.disabledItemLinkButton()}
                      isInProcess={createProjectAutoFillInProcess}
                      onClick={() => this.autoFillItemLink()}
                    />
                  </div>
                </div>
                <AddProjectGroup title="Select images">
                  <div className="inputs m-top-5">
                    <FileUploader
                      blockClassName={cStyles.uploadBlock}
                      listClassName={cStyles.uploadList}
                      listContainerClassName={cStyles.uploadList__container}
                      listItemClassName={cStyles.uploadList__item}
                      listImageClassName={cStyles.uploadList__image}
                      inputDisabled={autoFilled.includes('files')}
                      maxFiles={50}
                      maxSize={10}
                      multiple
                      inputId="files"
                      files={selectedFiles}
                      callBackUploadFiles={this.uploadCoverCallback}
                      callBackUploadBlobFiles={this.uploadCoverBlobCallback}
                      fullVersion
                      dragonDrop
                      onRemove={this.onRemoveFile}
                    />
                  </div>
                </AddProjectGroup>
                <AddProjectGroup title="Release information">
                  <div className="inputs column-2">
                    <ArtistsInput
                      disabled={autoFilled.includes('artists')}
                      selected={selectedArtists}
                      searchText={artists}
                      error={artistsError}
                      errorMsg={artistsErrorMsg}
                      changeItems={this.changeArtists}
                      changeInputHandler={this.changeInputHandler}
                    />
                    <Input
                      disabled={autoFilled.includes('album')}
                      id="albumName"
                      label="Album Name*"
                      value={albumName}
                      invalid={albumNameError}
                      invalidMessage={albumNameErrorMsg}
                      onChange={this.changeInputHandler}
                    />
                    <LabelsInput
                      disabled={autoFilled.includes('labels')}
                      selected={selectedLabels}
                      searchText={labels}
                      error={labelsError}
                      errorMsg={labelsErrorMsg}
                      changeItems={this.changeLabels}
                      changeInputHandler={this.changeInputHandler}
                    />
                    <CustomInputMask
                      disabled={autoFilled.includes('year')}
                      id="year"
                      label="Year"
                      value={year}
                      invalid={yearError}
                      invalidMessage={yearErrorMsg}
                      maskChar={null}
                      mask={CommonMasksConstants.YEAR}
                      onChange={(e) => {
                        this.changeInputHandler(e, {
                          checkValueBeforeSet: (value) => {
                            if (clearSymbolsUtil(value).length !== clearSymbolsUtil(CommonMasksConstants.YEAR).length) {
                              return value;
                            }

                            return normalizeYearUtil(value);
                          },
                        });
                      }}
                      onBlur={(e) => {
                        if (year) {
                          this.validateField(e, {
                            fieldIsValid: (value) =>
                              clearSymbolsUtil(value).length === clearSymbolsUtil(CommonMasksConstants.YEAR).length,
                            invalidMessage: CommonInputsConstants.YEAR_FORMAT_INVALID,
                            validateEmptyField: true,
                          });
                        }
                      }}
                    />
                    <CountrySelect
                      disabled={autoFilled.includes('country')}
                      label="Country"
                      placeholderSearch="Start typing to search"
                      onSelectItem={this.changeCountry}
                      selected={country}
                      countryId={country[0]?.id}
                      targetPredicate={({ forProject }) => forProject}
                    />
                    <GenresInput
                      selected={selectedGenres}
                      searchText={genres}
                      error={genresError}
                      errorMsg={genresErrorMsg}
                      changeItems={this.changeGenres}
                      changeInputHandler={this.changeInputHandler}
                    />
                    <StylesInput
                      selected={selectedStyles}
                      searchText={styles}
                      error={stylesError}
                      errorMsg={stylesErrorMsg}
                      changeItems={this.changeStyles}
                      changeInputHandler={this.changeInputHandler}
                    />
                    {sellerComment && <AddProjectComment label="Seller’s comment" text="Text" />}
                  </div>
                </AddProjectGroup>
                <AddProjectGroup title="Item information">
                  <div className="inputs column-2">
                    <MediaConditionSelect
                      disabled={autoFilled.includes('mediaCondition')}
                      label="Media condition*"
                      selected={selectedMediaCondition}
                      error={mediaConditionError}
                      errorMsg={mediaConditionErrorMsg}
                      changeItems={this.changeMediaCondition}
                      conditionId={selectedMediaCondition[0]?.id}
                      targetPredicate={({ forProject }) => forProject}
                    />
                    <SleeveConditionSelect
                      disabled={autoFilled.includes('sleeveCondition')}
                      label="Sleeve condition*"
                      selected={selectedSleeveCondition}
                      error={sleeveConditionError}
                      errorMsg={sleeveConditionErrorMsg}
                      changeItems={this.changeSleeveCondition}
                      conditionId={selectedSleeveCondition[0]?.id}
                      targetPredicate={({ forProject }) => forProject}
                    />
                  </div>
                </AddProjectGroup>
                <AddProjectGroup title="Youtube links" afterTitle={` (up to ${MAX_YOUTUBE_LINKS} links)`}>
                  <div className="inputs">
                    {Object.keys(youtubeLinks).map((key) => {
                      const { value, error, message } = youtubeLinks[key];

                      return (
                        <AddYoutubeLink
                          ref={this[`youtubeLinks${key}`]}
                          key={`${VIDEO_STATE_ID_PREFIX}key-${key}`}
                          id={key}
                          withRemove={Object.keys(youtubeLinks).length !== 1}
                          value={value}
                          error={error}
                          message={message}
                          onChange={this.changeInputHandlerVideos}
                          onRemove={this.removeInputHandlerVideos}
                        />
                      );
                    })}
                    <AddYoutubeLinkButton disabled={this.disableAddNewVideoLink()} onClick={this.addNewVideoLink} />
                  </div>
                </AddProjectGroup>
                <AddProjectGroup title="Additional information">
                  <div className="inputs column-2">
                    <TextArea
                      className="input-w-100pct"
                      id="projectComment"
                      placeholder="Add your comment/review"
                      value={projectComment}
                      invalid={projectCommentError}
                      invalidMessage={projectCommentErrorMsg}
                      onChange={this.changeInputHandler}
                    />
                  </div>
                </AddProjectGroup>
              </div>
            </AddProjectStep>
            <AddProjectStep
              stepNumber={2}
              stepName="Invite users"
              headerChild={
                <CheckBox
                  className="w-auto"
                  id="privateProject"
                  label="Private pre-order"
                  checked={privateProject}
                  onChange={this.changeCheckBoxHandler}
                />
              }
            >
              {!FRIENDS_DISABLE && (
                <FriendsInput
                  selected={selectedFriends}
                  searchText={friends}
                  error={friendsError}
                  errorMsg={friendsErrorMsg}
                  changeItems={this.changeFriends}
                  changeInputHandler={this.changeInputHandler}
                />
              )}
              <AddProjectGroup title="Invite by email">
                <InputWithTag
                  selected={selectedInviteEmails}
                  searchText={inviteEmails}
                  error={inviteEmailsError}
                  errorMsg={inviteEmailsErrorMsg}
                  validator={{
                    regularTest: {
                      regexp: CommonRegExpConstants.EMAIL_VALIDATE,
                      invalidMessage: CommonErrorMessages.EMAIL_PATTERN,
                    },
                  }}
                  changeItems={this.changeInviteEmails}
                  id="inviteEmails"
                  label="Enter your friend’s emails to invite"
                  changeInputHandler={this.changeInputHandler}
                  validateField={this.validateField}
                />
                <div className="inputs">
                  <TextArea
                    className="input-w-100pct"
                    id="inviteText"
                    placeholder="Enter your text here"
                    value={inviteText}
                    invalid={inviteTextError}
                    invalidMessage={inviteTextErrorMsg}
                    onChange={this.changeInputHandler}
                  />
                </div>
              </AddProjectGroup>
            </AddProjectStep>
            <AddProjectStep stepNumber={3} stepName="Complete your pre-order">
              <AddProjectGroup offsetTop={5}>{this.renderPriceInfo()}</AddProjectGroup>
            </AddProjectStep>
            <div className={cStyles.doubleButtons}>
              <AddProjectSaveButtons
                status={status}
                disabledPublishButton={this.disabledPublishButton}
                disabledDraftButton={this.disabledDraftButton}
                projectId={projectId}
                isProjectEdit={isProjectEdit}
                cutPrice={cutPrice}
                founderStartCutsCount={founderStartCutsCount}
                createFormData={this.createFormData}
                requestCatch={this.requestCatch}
                changeStatus={({ status: newStatus }) => this.setState({ status: newStatus })}
              />
              <Button
                text="Discard Changes"
                type="button_string"
                disabled={this.discardChangesDisabled()}
                onClick={() => this.discardChanges()}
              />
            </div>
          </>
        ) : (
          <div className="f-x-center m-top-70 m-bottom-70">
            <div className="t-center">
              <h2>{parse(START_PROJECT_SUB_TEXT)}</h2>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
    languageSelected: state.GlobalReducer.languageSelected,
    createProjectAutoFillInProcess: state.CreateProjectReducer.createProjectAutoFillInProcess,
    createProjectData: state.CreateProjectReducer.createProjectData,
    createProjectInProcess: state.CreateProjectReducer.createProjectInProcess,
    editProjectInProcess: state.CreateProjectReducer.editProjectInProcess,
    costCalculation: state.CreateProjectReducer.costCalculation,
    externalInfo: state.CreateProjectReducer.externalInfo,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    createProjectAutoFillRequest: (itemLink) => createProjectAutoFillRequestAction(itemLink)(dispatch),
    deleteUnreadEventAction: (projectIds, params = {}) => {
      dispatch(deleteUnreadPersonalNotificationCountsEventAction(projectIds, params));
    },
    createProjectClearAutoFill: (createProjectData) => {
      dispatch(createProjectClearAutoFillAction(createProjectData));
    },
    updateProjectExternalInfo: ({ externalInfo }) => {
      dispatch(updateProjectExternalInfoAction({ externalInfo }));
    },
  })
)(AddProjectForm);
