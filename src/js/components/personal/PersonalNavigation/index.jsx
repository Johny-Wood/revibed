import PersonalNavigationList from '@/components/global/Header/_components/PersonalNavigationList';

function PersonalNavigation({ navigationList, ...restProps }) {
  return <PersonalNavigationList id="personalNavigation" navigationList={navigationList} {...restProps} />;
}

export default PersonalNavigation;
