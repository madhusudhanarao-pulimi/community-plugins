# Faros VCS Dashboard plugin

Welcome to the Faros VCS Dashboard plugin!

Based on the [well-known GitHub slug annotation](https://backstage.io/docs/features/software-catalog/well-known-annotations#githubcomproject-slug) associated with the Entity, it renders different types of charts by pulling the github data from Faros.

The plugin is designed to work with Entity kind:

- Kind: API/Component: plugin renders dashboard charts from only one repository assigned to the Entity

**Loads the data from Faros and generate the dashboard charts.**

## Prerequisites

- [setup the required repository in Faros](https://app.faros.ai/default/teams/ownership/repository?search-items=cvd_rest)
- [Faros API Key](https://app.faros.ai/default/api-keys#s=accessControl)

## Usage

Install the plugin by running the following command **from your Backstage root directory**

`yarn --cwd packages/app add @backstage-community/plugin-faros-vcs-dashboard`

After installation, the plugin can be used as a Card or as a Page.

```typescript
import {
  VcsDashboardPage,
} from '@backstage-community/plugin-faros-vcs-dashboard';

// To use as a page Plugin needs to be wrapped in EntityLayout.Route
const RenderVcsDashboardPage = () => (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <EntityLayout.Route path="faros-vcs-dashboard" title="Faros VCS Dashboard">
        <VcsDashboardPage />
      </EntityLayout.Route>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

```

## Configuration

`VcsDashboardPage` provide default configuration. It is ready to use out of the box.


