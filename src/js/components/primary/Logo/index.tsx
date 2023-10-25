import LogoPrimaryIcon from '@/icons/site-logo/LogoPrimaryIcon';
import LogoSecondaryIcon from '@/icons/site-logo/LogoSecondaryIcon';

type LogoProps = {
  type?: 'primary' | 'secondary';
  color?: string;
};

const Logo = ({ type = 'primary', color = 'black' }: LogoProps) =>
  type === 'primary' ? <LogoPrimaryIcon color={color} /> : <LogoSecondaryIcon color={color} />;

export default Logo;
