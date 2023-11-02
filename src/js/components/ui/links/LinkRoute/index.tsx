import { useMemo } from 'react';

import classNames from 'classnames';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { LinkDefaultProps } from '@/components/ui/links/LinkDefault';
import LinkDefault from '@/components/ui/links/LinkDefault';

export type LinkRouteProps = Omit<LinkDefaultProps, 'href'> &
  Pick<LinkProps, 'href'> & {
    asPathExclude?: string | { pathname: string; query?: unknown };
    backgroundColor?: string;
  };

const LinkRoute = ({
  href: hrefName,
  text,
  size,
  focused,
  children,
  className,
  textClassName,
  onClick,
  type,
  transparent,
  disabled,
  isInProcess,
  rounded,
  translateKey,
  style,
  title,
  icon,
  iconPosition,
  iconColor,
  tooltip,
  borderColor,
  backgroundColor,
  gtmAttribute,
  asPath: asPathLink,
  asPathExclude: asPathExcludeLink,
  inheritanceActive = true,
  color,
  withActive = true,
  onMouseOverCapture,
  ariaLabel,
  doubleText,
  ...linkProps
}: LinkRouteProps) => {
  const href = useMemo(() => {
    let hrefStr = '';

    if (typeof hrefName === 'object') {
      const { pathname: hrefPathname } = hrefName;

      if (hrefPathname) {
        hrefStr = hrefPathname;
      }
    } else {
      hrefStr = hrefName;
    }

    return hrefStr;
  }, [hrefName]);

  const { asPath, query } = useRouter();

  const asPathWithoutQuery = useMemo(() => {
    let asPathWithoutQueryStr = asPath.substring(0, asPath.indexOf('?')) || asPath;

    Object.keys(query).forEach((queryKey) => {
      asPathWithoutQueryStr = asPathWithoutQueryStr.replace(`[${queryKey}]`, (query[queryKey] ?? '') as string);
    });

    asPathWithoutQueryStr = asPathWithoutQueryStr.split('#').shift() ?? '';

    return asPathWithoutQueryStr;
  }, [asPath, query]);

  const isActiveCurrent = useMemo(() => withActive && asPathWithoutQuery === href, [asPathWithoutQuery, href, withActive]);

  const isActive = useMemo(
    () =>
      withActive &&
      (isActiveCurrent ||
        (inheritanceActive &&
          href !== '/' &&
          (asPathWithoutQuery.startsWith(href) ||
            ((!asPathExcludeLink || asPathExcludeLink === href) && asPathLink && asPathWithoutQuery.startsWith(asPathLink))))),
    [asPathExcludeLink, asPathLink, asPathWithoutQuery, href, inheritanceActive, isActiveCurrent, withActive]
  );

  return (
    <Link {...linkProps} href={hrefName} legacyBehavior passHref>
      <LinkDefault
        focused={focused}
        text={text}
        title={title}
        href={href}
        size={size}
        type={type}
        style={style}
        transparent={transparent}
        rounded={rounded}
        disabled={disabled}
        isInProcess={isInProcess}
        color={color}
        doubleText={doubleText}
        textClassName={textClassName}
        className={classNames(
          className,
          backgroundColor && !borderColor && !transparent && `background-${backgroundColor}`,
          isActive && 'active',
          !!borderColor && 'border',
          !!borderColor && `border-${borderColor}`
        )}
        onClick={(e) => {
          if (isActiveCurrent) {
            e.preventDefault();
          }

          if (onClick) {
            onClick(e);
          }
        }}
        target="_self"
        translateKey={translateKey}
        tooltip={tooltip}
        icon={icon}
        iconPosition={iconPosition}
        iconColor={iconColor}
        gtmAttribute={gtmAttribute}
        onMouseOverCapture={onMouseOverCapture}
        ariaLabel={ariaLabel}
      >
        {children}
      </LinkDefault>
    </Link>
  );
};

export default LinkRoute;
