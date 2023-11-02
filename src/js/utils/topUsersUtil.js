import { CommonRatingTypesConstants } from '@/constants/common/rating';
import AngelIcon from '@/icons/top-users/AngelIcon';
import ContributorIcon from '@/icons/top-users/ContributorIcon';
import DiggerIcon from '@/icons/top-users/DiggerIcon';
import FounderIcon from '@/icons/top-users/FounderIcon';
import InvestorIcon from '@/icons/top-users/InvestorIcon';

export const getTopUserInfoUtil = ({ type }) => {
  switch (type) {
    case CommonRatingTypesConstants.CONTRIBUTOR:
    case CommonRatingTypesConstants.CONTRIBUTOR_HISTORY: {
      return {
        title: 'Contributor of the day',
        description: 'Joined the most projects',
        icon: ContributorIcon,
      };
    }
    case CommonRatingTypesConstants.FOUNDER: {
      return {
        title: 'Founder of the day',
        description: 'Opened the most projects',
        icon: FounderIcon,
      };
    }
    case CommonRatingTypesConstants.DIGGER: {
      return {
        title: 'Digger of the day',
        description: 'Opened the rarest pre-order',
        icon: () => <DiggerIcon className="m-bottom-2 m-right-7" />,
      };
    }
    case CommonRatingTypesConstants.ANGEL: {
      return {
        title: 'Angel of the day',
        description: 'Bought the last cuts in more pre-orders',
        icon: () => <AngelIcon className="m-bottom-2 w-28" />,
      };
    }
    case CommonRatingTypesConstants.INVESTOR:
    case CommonRatingTypesConstants.INVESTOR_HISTORY: {
      return {
        title: 'Investor of the day',
        description: 'Invested the most koins in projects',
        icon: InvestorIcon,
      };
    }
    case CommonRatingTypesConstants.CONTRIBUTOR_BY_COLLECTED_PROJECTS: {
      return {
        title: 'Contributor of the day',
        description: 'Contributed the most Koins to successful projects',
        icon: InvestorIcon,
      };
    }
    default: {
      return {
        title: '',
        description: '',
      };
    }
  }
};
