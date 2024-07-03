import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const githubMergeFrequencyPlugin = createPlugin({
  id: 'github-merge-frequency',
  routes: {
    root: rootRouteRef,
  },
});

export const GithubMergeFrequencyPage = githubMergeFrequencyPlugin.provide(
  createRoutableExtension({
    name: 'GithubMergeFrequencyPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
