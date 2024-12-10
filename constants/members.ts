export interface MembersInfo {
  username: string;
  profileUrl: string;
  github: string;
}

export const membersInfo: Record<string, Array<MembersInfo>> = {
  bandibook: [
    {
      username: 'Doeunnkimm',
      profileUrl: 'https://avatars.githubusercontent.com/u/112946860?v=4',
      github: 'https://github.com/Doeunnkimm',
    },
    {
      username: 'Heojoooon',
      profileUrl: 'https://avatars.githubusercontent.com/u/45158550?v=4',
      github: 'https://github.com/hjy0951',
    },
    {
      username: 'ManHyuk',
      profileUrl: 'https://avatars.githubusercontent.com/u/11765448?v=4',
      github: 'https://github.com/ManHyuk',
    },
    {
      username: '권우석',
      profileUrl: 'https://avatars.githubusercontent.com/u/62459196?v=4',
      github: 'https://github.com/egg528',
    },
  ],
  '10000-bagger': [
    {
      username: 'binary_ho',
      profileUrl: 'https://avatars.githubusercontent.com/u/71186266?v=4',
      github: 'https://github.com/binary-ho',
    },
    {
      username: '권우석',
      profileUrl: 'https://avatars.githubusercontent.com/u/62459196?v=4',
      github: 'https://github.com/egg528',
    },
  ],
};
