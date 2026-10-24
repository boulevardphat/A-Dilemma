import React from 'react';

export default function Link({
  href,
  children,
  className,
  onClick,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}) {
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    if (!e.defaultPrevented && typeof href === 'string') {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
