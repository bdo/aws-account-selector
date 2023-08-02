# AWS Role Selector Plugin for Chrome

This plugin enhances the AWS SAML Role selection page by adding a project filter. It allows users to filter roles based on the selected project, thereby improving the user experience for developers who switch between multiple AWS accounts for different projects.

## Features

- The plugin provides a drop-down selector on the AWS SAML Role selection page to select a project.
- Once a project is selected, the roles are filtered and displayed based on the account mapping associated with the project.
- The selection of the project is stored locally and is remembered across sessions.
- The plugin also reorders roles according to their appearance in the project mapping.

## Installation

Follow these steps to install the plugin:

1. Download or clone this repository to your local machine.
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable Developer mode by clicking the toggle switch at the top right.
4. Click the "Load unpacked" button that appears.
5. Navigate to the location where you downloaded or cloned the repository, select the folder, and click "Open".

Now the plugin should be added to your Chrome extensions, and you'll see it when navigating to the AWS SAML Role selection page.

## Usage

Once installed, navigate to your AWS SAML Role selection page. You will see a new "Project" drop-down selector at the top. Select the project for which you wish to see the roles, and the roles will be filtered and displayed accordingly.
