import ProfileBar from '@/components/personal/profile/_components/ProfileBar';
import ProfileBarBalanceInfo from '@/components/personal/profile/_components/ProfileBarBalanceInfo';
import MyProfileBarShortInfo from '@/components/personal/profile/MyProfileBar/_components/MyProfileBarShortInfo';
import MyProfileBarUser from '@/components/personal/profile/MyProfileBar/_components/MyProfileBarUser';

function MyProfileBar() {
  return (
    <ProfileBar>
      <MyProfileBarUser />
      <ProfileBarBalanceInfo />
      <MyProfileBarShortInfo />
    </ProfileBar>
  );
}

export default MyProfileBar;
