export const getConfig = async () => {
  const { config } = await chrome.storage.local.get(['config']);
  return config ?? {};
};

export const saveConfig = async (config) => {
  const toSave = {
    ...config,
    lastUpdated: Date.now(),
  };
  await chrome.storage.local.set({ config: toSave });
  return toSave;
};

export const saveAliases = async (aliases) => {
  const config = await getConfig();
  await saveConfig({ ...config, aliases });
};

export const getAliases = async () => {
  const config = await getConfig();
  return config.aliases ?? {};
};

export const getAccountNames = async () => {
  const { accountNames } = await chrome.storage.local.get(['accountNames']);
  return accountNames ?? [];
};

export const setAccountNames = async (accountNames) => {
  await chrome.storage.local.set({ accountNames });
};

export const setProjectIndex = async (index) => {
  await chrome.storage.local.set({ storedProjectIndex: index });
};

export const getProjectIndex = async () => {
  const { storedProjectIndex } = await chrome.storage.local.get(['storedProjectIndex']);
  return storedProjectIndex ?? 0;
};
