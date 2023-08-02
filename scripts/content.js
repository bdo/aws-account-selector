const PROJECT_ACCOUNT_MAPPING = {
  SDP: {
    764972379026: 'DEV',
    566468150036: 'OLD STAGING',
    649630792531: 'NEW STAGING',
    443200119947: 'PROD',
  },
  INARENA: {
    435055372347: 'DEV',
    566468150036: 'STAGING',
    680383102009: 'PROD',
  },
};

const ACCOUNT_NUMBER_REGEX = /.* \((.*)\)/;

const extractAccountNumberFromRole = (roleName) => ACCOUNT_NUMBER_REGEX.exec(roleName)[1];

const initializeProjectSelectorAndRoles = () => {
  const projectSelector = document.querySelector('#projects');
  const storedProjectIndex = localStorage.getItem('storedProjectIndex') ?? 0;
  projectSelector.selectedIndex = storedProjectIndex;

  projectSelector.addEventListener('change', () => {
    localStorage.setItem('storedProjectIndex', projectSelector.selectedIndex);
    updateRolesBasedOnProject(projectSelector.value);
  });

  updateRolesBasedOnProject(projectSelector.value);
};

const updateRolesBasedOnProject = (project) => {
  const accountsForProject = PROJECT_ACCOUNT_MAPPING[project];
  const roles = document.querySelectorAll('fieldset > .saml-account');

  roles.forEach((role) => {
    const accountNameElement = role.querySelector('.saml-account-name');
    accountsForProject
      ? updateRoleWithProjectAccount(accountsForProject, role, accountNameElement)
      : resetRoleToOriginalState(role, accountNameElement);
  });

  if (accountsForProject) {
    reorderRolesByAccount(accountsForProject);
  }
};

const resetRoleToOriginalState = (role, accountNameElement) => {
  role.style.display = 'block';
  accountNameElement.innerText = accountNameElement.originalText ?? accountNameElement.innerText;
};

const updateRoleWithProjectAccount = (projectAccounts, role, accountNameElement) => {
  const accountNumber = extractAccountNumberFromRole(accountNameElement.innerText);
  const accountLabel = projectAccounts[accountNumber];

  if (accountLabel) {
    role.style.display = 'block';
    accountNameElement.originalText ||= accountNameElement.innerText;
    accountNameElement.innerText = `${accountLabel} (${accountNumber})`;
  } else {
    role.style.display = 'none';
  }
};

const reorderRolesByAccount = (projectAccounts) => {
  const roleContainer = document.querySelector('fieldset');
  const sortedRoles = Array.from(roleContainer.children)
    .filter((child) => child.classList.contains('saml-account'))
    .sort((roleA, roleB) => {
      const accountNumberA = extractAccountNumberFromRole(roleA.querySelector('.saml-account-name').innerText);
      const accountNumberB = extractAccountNumberFromRole(roleB.querySelector('.saml-account-name').innerText);
      return (
        Object.keys(projectAccounts).indexOf(accountNumberA) - Object.keys(projectAccounts).indexOf(accountNumberB)
      );
    });

  sortedRoles.forEach((element) => roleContainer.appendChild(element));
};

if (!document.querySelector('#project-selector')) {
  const projectSelectorHTML = `
    <h1 id="project-selector">
      <hr/>
      <div style="display: flex; align-items: center">
        <label for="projects">Project:</label>&nbsp;
        <select id="projects" style="font-size: 100%">
          <option value="INARENA">InArena</option>
          <option value="SDP">Sport Data Proxy / InTime</option>
          <option value="ALL">All</option>
        </select>
      </div>
      <hr/>
    </h1>`;

  document.querySelector('#saml_form').insertAdjacentHTML('afterbegin', projectSelectorHTML);
  initializeProjectSelectorAndRoles();
}
