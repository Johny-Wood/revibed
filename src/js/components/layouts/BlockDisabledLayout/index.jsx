function BlockDisabledLayout({ disabled, children }) {
  if (disabled) {
    return null;
  }

  return children;
}

export default BlockDisabledLayout;
