

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                     
    timer = setTimeout(() => fn(...args), delay); 
  };
}



export function throttle(fn, limit) {
  let lastRun = 0;                            
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {     
      lastRun = now;
      fn(...args);
    }
  };
}
