import { useMemo } from 'react';

const checkIsPreorder = ({ purchaseAvailable, available, alreadyPurchased, inCart }) =>
  !purchaseAvailable && !available && !alreadyPurchased && !inCart;

export const MarketplaceCardStatusHook = (cardInfo) => {
  const {
    alreadyPurchased,
    copyrightHoldersPresent,
    purchaseAvailable,
    realPurchaseAvailable,
    inCart,
    target: { tracksGoods },
  } = cardInfo ?? {};

  const isPreOrder = useMemo(
    () => checkIsPreorder(cardInfo) && tracksGoods.filter((item) => !checkIsPreorder(item)).length === 0,
    [cardInfo, tracksGoods]
  );

  const isPurchased = alreadyPurchased;

  const isOnlyTracks = copyrightHoldersPresent && !isPurchased && !realPurchaseAvailable;

  const isGoodsInCart = useMemo(
    () =>
      inCart ||
      (tracksGoods.length > 0 && tracksGoods.filter(({ inCart: trackInCart }) => trackInCart).length === tracksGoods.length),
    [inCart, tracksGoods]
  );

  const isCanBuy = purchaseAvailable && !isPreOrder && !isPurchased && !inCart;

  return {
    isPreOrder,
    isPurchased,
    isOnlyTracks,
    isGoodsInCart,
    isCanBuy,
  };
};
