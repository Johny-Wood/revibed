export type RequestedUserInfo = {
  founder?: boolean;
  contributor?: {
    participation?: boolean;
  };
};

export const projectParticipationInfoUtil = (requestedUserInfo?: RequestedUserInfo): boolean => {
  const { founder, contributor } = requestedUserInfo ?? {};
  const { participation } = contributor ?? {};

  return !!participation || !!founder;
};
