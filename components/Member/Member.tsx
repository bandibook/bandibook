import type { MembersInfo } from '@/../constants';
import { memberContainerCss, profileImageCss } from './style';

export type MemberProps = MembersInfo;

export const Member = (props: MemberProps) => {
  const { username, profileUrl, github } = props;

  const handleClick = () => window.open(github);

  return (
    <div css={memberContainerCss} onClick={handleClick}>
      <img src={profileUrl} alt={`${username}_profile_image`} css={profileImageCss} />
      <p>{username}</p>
    </div>
  );
};
