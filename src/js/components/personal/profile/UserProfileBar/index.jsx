import ProfileBar from '@/components/personal/profile/_components/ProfileBar';
import UserProfileBarShortInfo from '@/components/personal/profile/UserProfileBar/_components/UserProfileBarShortInfo';
import UserProfileBarUser from '@/components/personal/profile/UserProfileBar/_components/UserProfileBarUser';

function UserProfileBar({ userId }) {
  return (
    <ProfileBar>
      <UserProfileBarUser userId={userId} />
      <UserProfileBarShortInfo userId={userId} />
    </ProfileBar>
  );
}

export default UserProfileBar;
