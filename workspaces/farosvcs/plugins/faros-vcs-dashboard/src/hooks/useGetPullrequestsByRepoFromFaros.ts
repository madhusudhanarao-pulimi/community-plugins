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
import { Config } from '@backstage/config';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import {
  Repository,

} from '../modals/repositoryModal';

// # start calculate avg PR cycle time by weekly
export interface PullRequest {
  createdAt: string;
  mergedAt: string | null;
  origin: string;
  repository: {
    name: string;
  };
  state: State;
  updatedAt: string;
}

interface State {
  detail: string;
  category: string;
}

export const useGetIssuesByRepoFromGithub = (
  repos: Array<Repository>,
) => {
  const config = useApi(configApiRef);
  let accessToken = 'f3LeyW8zJ7kO8XLAginK8HKV2hAuZfGe';
  if (config.has('restAPI.farosAPIAccessToken')) {
    accessToken = config.getString('restAPI.farosAPIAccessToken');
  }

  const {
    value : PullRequest,
    loading: isLoading,
    retry,
  } = useAsyncRetry(async () => {

    if (repos.length > 0) {

      let repoFullName  = repos[0].name;
      let repoNameSplit = repoFullName.split('/');
      let repoName  = (repoNameSplit.length>1 ? repoNameSplit[repoNameSplit.length-1] : repoFullName);

      // Create your query string with the variable
  const query = `query {
              vcs_PullRequest(where: { repository: { name: { _eq: "${repoName}" } } }) {
                state
                createdAt
                mergedAt
                updatedAt
                repository {
                  name
                  createdAt
                }
                author {
                  id
                  uid
                  name
                  email
                }
                commits {
                  commit {
                    sha
                  }
                }
              }
            }
          `;

    const response = await fetch(
      "https://prod.api.faros.ai/graphs/default/graphql",  { 
          method: 'post', 
          headers: new Headers({
              'Authorization': accessToken, 
              'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ query })
        });
        const prData = await response.json();
      let pullrequestData = prData.data.vcs_PullRequest;
    return { isLoading, pullrequestData, retry };
      }

    return {};
  }, [repos]);

  return { isLoading, prData: PullRequest, retry };
};

