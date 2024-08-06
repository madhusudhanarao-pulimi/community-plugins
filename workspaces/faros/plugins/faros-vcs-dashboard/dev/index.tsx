import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { farosVcsDashboardPlugin, FarosVcsDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(farosVcsDashboardPlugin)
  .addPage({
    element: <FarosVcsDashboardPage />,
    title: 'Root Page',
    path: '/faros-vcs-dashboard',
  })
  .render();
