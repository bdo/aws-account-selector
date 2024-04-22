(async () => {
  const src = chrome.runtime.getURL('scripts/page.js');
  await import(src);
})();
