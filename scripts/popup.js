import {
  getAccountNames,
  getSimplifiedRoleNames,
  getAliases,
  saveAliases,
  setSimplifiedRoleNames,
} from './settings.js';

document.getElementById('aliases-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const newAliases = {};
  saveAliases(newAliases);
});

const addToAccountList = (account) => {
  const accountListElement = document.getElementById('account-list');
  const accountOption = document.createElement('option');
  accountOption.value = account;
  accountOption.innerText = account;
  accountListElement.appendChild(accountOption);
};

const removeFromAccountList = (account) => {
  const accountListElement = document.getElementById('account-list');
  const accountOption = accountListElement.querySelector(`option[value="${account}"]`);
  accountListElement.removeChild(accountOption);
};

const appendAlias = (account, alias) => {
  const aliasesElement = document.getElementById('aliases');
  const aliasElement = document.createElement('li');
  const aliasElementText = document.createTextNode(`${account}: ${alias}`);
  aliasElement.appendChild(aliasElementText);
  const aliasDeleteButton = document.createElement('button');
  aliasDeleteButton.innerText = '🗑️';
  aliasDeleteButton.addEventListener('click', async () => {
    const aliases = await getAliases();
    delete aliases[account];
    await saveAliases(aliases);
    aliasesElement.removeChild(aliasElement);
    // add back to account list
    addToAccountList(account);
  });
  aliasElement.appendChild(aliasDeleteButton);
  aliasesElement.appendChild(aliasElement);
  removeFromAccountList(account);
};

const loadConfig = async () => {
  const accountNames = await getAccountNames();
  accountNames.forEach((account) => {
    addToAccountList(account);
  });

  const aliases = await getAliases();
  if (aliases) {
    Object.entries(aliases).forEach(([account, alias]) => {
      appendAlias(account, alias);
    });
  }
};

document.getElementById('add-account-alias').addEventListener('click', async () => {
  const aliases = await getAliases();

  const account = document.getElementById('account');
  const alias = document.getElementById('alias');

  appendAlias(account.value, alias.value);

  await saveAliases({ ...aliases, [account.value]: alias.value });

  account.value = '';
  alias.value = '';
});

const simplifyRoleNamesCheckbox = document.getElementById('simplify-role-names');
simplifyRoleNamesCheckbox.addEventListener('change', async () => {
  await setSimplifiedRoleNames(simplifyRoleNamesCheckbox.checked);
});
simplifyRoleNamesCheckbox.checked = await getSimplifiedRoleNames();

setTimeout(() => loadConfig(), 100);
