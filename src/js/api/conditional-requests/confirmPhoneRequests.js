const confirmPhoneRequests = [
  {
    url: 'personal/withdraws',
    method: 'post',
  },
  {
    urlPattern: /^.*projects\/[\d]+\/rip-link$/i,
    method: 'post',
  },
];

export default confirmPhoneRequests;
