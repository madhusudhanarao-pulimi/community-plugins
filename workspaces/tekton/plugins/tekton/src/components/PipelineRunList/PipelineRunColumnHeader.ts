/*
 * Copyright 2024 The Backstage Authors
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
import { TableColumn } from '@backstage/core-components';

export const PipelineRunColumnHeader: TableColumn[] = [
  {
    id: 'expander',
  },
  {
    id: 'name',
    title: 'NAME',
    field: 'metadata.name',
  },
  {
    id: 'vulnerabilities',
    title: 'VULNERABILITIES',
    field: 'status.results',
  },
  {
    id: 'status',
    title: 'STATUS',
    field: 'status.conditions[0].reason',
  },
  {
    id: 'task-status',
    title: 'TASK STATUS',
    field: 'status.conditions[0].reason',
  },
  {
    id: 'start-time',
    title: 'STARTED',
    field: 'status.startTime',
    defaultSort: 'desc',
  },
  {
    id: 'duration',
    title: 'DURATION',
    field: 'status.completionTime',
  },
  {
    id: 'actions',
    title: 'ACTIONS',
  },
];
