const ripperUseCoinsAllowedRequests = [
  {
    urlPattern: /^.*projects\/[\d]+\/buy-cut$/i,
    method: 'put',
  },
  {
    url: 'personal/balance',
    method: 'put',
  },
  {
    url: 'personal/withdraws',
    method: 'post',
  },
  {
    url: 'personal/balance/royalty/output',
    method: 'post',
  },
  {
    url: 'promo-actions/codes',
    method: 'post',
  },
  {
    url: 'projects/draft',
    method: 'post',
  },
  {
    url: 'personal/purchase',
    method: 'post',
  },
  {
    urlPattern: /^.*projects\/draft\/[\d]+$/i,
    method: 'put',
  },
];

export default ripperUseCoinsAllowedRequests;
