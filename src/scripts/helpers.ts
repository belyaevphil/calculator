const watchForHover = (): void => {
  let lastTouchTime = 0 as number;
  const date = new Date().getMilliseconds() as number;

  const enableHover = () => {
    if (date - lastTouchTime < 500) return;
    document.body.classList.add('has-hover');
  };
  const disableHover = () => document.body.classList.remove('has-hover');
  const updateLastTouchTime = () => (lastTouchTime = date);

  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);

  enableHover();
};

export { watchForHover };
