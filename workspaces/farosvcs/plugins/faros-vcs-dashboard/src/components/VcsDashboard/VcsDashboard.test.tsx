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
import { VcsDashboard, GeneratePRCountByWeekChart, GeneratePRCountByStatusChart } from './VcsDashboard';
import { getByTestId, waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { PullRequest } from '../../hooks/useGetPullrequestsByRepoFromFaros';


jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-04-20T08:15:47.614Z').getTime());

const entityComponentNoAnnotations = {
  metadata: {
    annotations: {
      
    },
    name: 'backstage',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
} as unknown as Entity;


// Create a mock collection of PullRequest objects
const mockPullRequests: PullRequest[] = [
  {
    createdAt: '2024-08-01T12:00:00Z',
    mergedAt: '2024-08-05T15:00:00Z',
    origin: 'user1',
    repository: {
      name: 'repo1',
    },
    state: { detail: 'merged', category: 'merged' } ,
    updatedAt: '2024-08-05T15:00:00Z',
  },
  {
    createdAt: '2024-08-02T14:30:00Z',
    mergedAt: '2024-08-08T09:15:00Z',
    origin: 'user2',
    repository: {
      name: 'repo1',
    },
    state: { detail: 'merged', category: 'merged' } ,
    updatedAt: '2024-08-10T09:00:00Z',
  },
  {
    createdAt: '2024-08-03T09:15:00Z',
    mergedAt: '2024-08-08T09:15:00Z',
    origin: 'user3',
    repository: {
      name: 'repo1',
    },
    state: { detail: 'merged', category: 'merged' } ,
    updatedAt: '2024-08-09T11:30:00Z',
  },
  {
    createdAt: '2024-08-04T16:45:00Z',
    mergedAt: null,
    origin: 'user4',
    repository: {
      name: 'repo1',
    },
    state: { detail: 'Open', category: 'Open' } ,
    updatedAt: '2024-08-06T10:30:00Z',
  },
  {
    createdAt: '2024-08-07T13:00:00Z',
    mergedAt: null,
    origin: 'user5',
    repository: {
      name: 'repo1',
    },
    state: { detail: 'Open', category: 'Open' } ,
    updatedAt: '2024-08-13T08:00:00Z',
  },
];

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

   expect(getByText(/There are no GitHub repositories connected to this entity./i)).toBeInTheDocument();
   
  });


  it('GeneratePRCountByWeekChart', async () => {
   
    let _chartResult = GeneratePRCountByWeekChart(mockPullRequests);
    const expectedChartData = {
      axisY: { title: 'Days' },
      title: { text: 'PR Cycle time by week' },
      data: [
        {
          type: 'line',
          indexLabel: '{y}',
          indexLabelPlacement: 'outside',
          indexLabelOrientation: 'horizontal',
          dataPoints: [ { label: 'Aug 04, 2024', y: 4 }, { label: 'Aug 11, 2024', y: 5 } ]
        }
      ],
      toolTip: { content: '{label}: {y} days' }
    }

    // Assert
    expect(_chartResult).toEqual(expectedChartData);
  });

  it('GeneratePRCountByStatusChart', async () => {
   
    let _chartResult = GeneratePRCountByStatusChart(mockPullRequests);

     const expectedChartData =  {
        title: { text: 'PRs Count By State' },
        data: [
          {
            type: 'column',
            indexLabel: '{y}',
            indexLabelPlacement: 'outside',
            indexLabelOrientation: 'horizontal',
            dataPoints:  [ { label: 'merged', y: 3, x: 0 }, { label: 'Open', y: 2, x: 1 } ]
          }
        ]
      }

    // // Assert
    expect(_chartResult).toEqual(expectedChartData);
  });

  
});
