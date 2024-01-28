export function debounce<T>(
  callback: (args: T) => void,
  delay: number,
): (args: T) => void {
  let timerId = 0;

  return (...args) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
