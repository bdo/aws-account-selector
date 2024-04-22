import { getAliases, getProjectIndex, setAccountNames, setProjectIndex } from './settings.js';

const ACCOUNT_REGEX = 'Account: (?<accountName>.*?)-(?<env>\\w+) \\((?<accountNumber>\\d+)\\)';

const accountNames = [];

const accountNodes = Array.from(document.querySelectorAll('fieldset > .saml-account'));

const simplifiedRoleNames = (strings) => {
  if (strings.length < 2) return strings;

  const commonPrefix = strings.reduce((prefix, str) => {
    while (str.indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
    }
    return prefix;
  }, strings[0]);

  return strings.map((str) => str.slice(commonPrefix.length));
};

accountNodes.forEach((accountNode) => {
  const fullAccountName = accountNode.querySelector('.saml-account-name').innerText;
  const account = fullAccountName.match(new RegExp(ACCOUNT_REGEX)).groups;
  if (!accountNames.includes(account.accountName)) accountNames.push(account.accountName);
  Object.assign(accountNode, { ...account, fullAccountName });

  const roles = Array.from(accountNode.querySelectorAll('.saml-role-description'));

  simplifiedRoleNames(roles.map((r) => r.innerText)).forEach((role, i) => {
    const fullRoleName = roles[i].innerText;
    roles[i].innerText = role;
    roles[i].fullRoleName = fullRoleName;
  });
});

const initializeProjectSelectorAndRoles = async () => {
  const projectSelector = document.querySelector('#projects');
  const storedProjectIndex = await getProjectIndex();
  projectSelector.selectedIndex = storedProjectIndex;

  projectSelector.addEventListener('change', async () => {
    await setProjectIndex(projectSelector.selectedIndex);
    updateAccountsBasedOnProject(projectSelector.value);
  });

  updateAccountsBasedOnProject(projectSelector.value);
};

const updateAccountsBasedOnProject = (accountName) => {
  const accounts = Array.from(document.querySelectorAll('fieldset > .saml-account'));

  if (!accountNames.includes(accountName)) {
    accounts.forEach(resetAccountToOriginalState);
  } else {
    accounts.forEach((account) => {
      if (account.accountName === accountName) {
        account.style.display = 'block';
        const accountNameElement = account.querySelector('.saml-account-name');
        accountNameElement.innerText = `${account.env.toUpperCase()} (${account.accountNumber})`;
      } else {
        account.style.display = 'none';
      }
    });
  }

  reorderAccounts();
};

const resetAccountToOriginalState = (role) => {
  role.style.display = 'block';
  const accountNameElement = role.querySelector('.saml-account-name');
  accountNameElement.innerText = role.fullAccountName;
};

const reorderAccounts = () => {
  const roleContainer = document.querySelector('fieldset');
  const sortedRoles = Array.from(roleContainer.children)
    .filter((child) => child.classList.contains('saml-account'))
    .sort((roleA, roleB) => {
      const envsOrdering = ['dev', 'staging', 'int', 'prod'];
      if (roleA.accountName === roleB.accountName)
        return envsOrdering.indexOf(roleA.env) - envsOrdering.indexOf(roleB.env);
      return roleA.accountName.localeCompare(roleB.accountName);
    });

  sortedRoles.forEach((element) => roleContainer.appendChild(element));
};

(async () => {
  await setAccountNames(accountNames);

  const aliases = await getAliases();

  if (!document.querySelector('#project-selector')) {
    const projectSelectorHTML = `
  <h1 id="project-selector">
    <hr/>
    <div style="display: flex; align-items: center">
      <label for="projects">Project:</label>&nbsp;
      <select id="projects" style="font-size: 100%">
        ${accountNames
          .map((name) => {
            const alias = aliases[name] ?? name;
            return `<option value="${name}">${alias}</option>`;
          })
          .join('')}
        <option value="ALL">All</option>
      </select>
    </div>
    <hr/>
  </h1>`;

    document.querySelector('#saml_form').insertAdjacentHTML('afterbegin', projectSelectorHTML);
    await initializeProjectSelectorAndRoles();
  }
})();
