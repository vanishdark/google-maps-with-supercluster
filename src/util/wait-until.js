export const waitUntil = (condition) => {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      if (!condition()) {
        return;
      }

      clearInterval(interval);
      resolve();
    }, 100);
  });
};
