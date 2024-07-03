import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { githubMergeFrequencyPlugin, GithubMergeFrequencyPage } from '../src/plugin';

createDevApp()
  .registerPlugin(githubMergeFrequencyPlugin)
  .addPage({
    element: <GithubMergeFrequencyPage />,
    title: 'Root Page',
    path: '/github-merge-frequency',
  })
  .render();
