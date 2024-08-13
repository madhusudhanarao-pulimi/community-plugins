/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  EntityProvider,
  catalogApiRef,
  CatalogApi,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { VcsDashboard } from './VcsDashboard';
import { getByTestId, waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';


jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-04-20T08:15:47.614Z').getTime());

const entityComponentNoAnnotations = {
  metadata: {
    annotations: {
      // 'github.com/project-slug': 'philips-internal/di-superset-api',
      // 'backstage.io/source-location':
      //   'url:https://github.com/backstage/backstage',
    },
    name: 'backstage',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
} as unknown as Entity;


const entityComponent = {
  metadata: {
    annotations: {
      'github.com/project-slug': 'philips-internal/di-superset-api',
      'backstage.io/source-location':
        'url:https://github.com/backstage/backstage',
    },
    name: 'backstage',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
} as unknown as Entity;

const mockCatalogApi = {
  getEntities: () => ({}),
} as CatalogApi;

describe('renderNoRepos', () => {
  it('should render correctly when there are no repos in entity', async () => {
    const apis = [
      [catalogApiRef, mockCatalogApi],
    ] as const;

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <EntityProvider entity={entityComponentNoAnnotations}>
          <VcsDashboard></VcsDashboard>
        </EntityProvider>
      </TestApiProvider>,
    );

   // expect(getByText(/There are no GitHub repositories connected to this entity./i)).toBeTruthy();
   expect(getByText(/There are no GitHub repositories connected to this entity./i)).toBeInTheDocument();
   
  });

  
});
