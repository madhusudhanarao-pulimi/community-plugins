import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const farosVcsDashboardPlugin = createPlugin({
  id: 'faros-vcs-dashboard',
  routes: {
    root: rootRouteRef,
  },
});

export const FarosVcsDashboardPage = farosVcsDashboardPlugin.provide(
  createRoutableExtension({
    name: 'FarosVcsDashboardPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
