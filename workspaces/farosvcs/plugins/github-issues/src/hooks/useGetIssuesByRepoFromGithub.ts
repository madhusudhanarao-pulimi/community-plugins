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

import { useApi } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import {
  Repository,
  githubIssuesApiRef,
  GithubIssuesByRepoOptions,
} from '../api';



// # start calculate avg PR cycle time by weekly
export interface PullRequest {
  createdAt: string;
  mergedAt: string;
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

interface PRTimeByWeek {
  weekStartDate: string;
  averageTime: number; // in milliseconds
}

function applyRepoFilterForPRData(prData: PullRequest[], filter_reponame: string)
{
  prData = prData.filter(pr => {
    return  pr.repository.name == filter_reponame;
  });
  return prData;
}


export const useGetIssuesByRepoFromGithub = (
  repos: Array<Repository>,
  itemsPerRepo: number,
  options?: GithubIssuesByRepoOptions,
) => {
  const githubIssuesApi = useApi(githubIssuesApiRef);

  const {
    value : PullRequest,
    loading: isLoading,
    retry,
  } = useAsyncRetry(async () => {

    const response = await fetch(
      "https://prod.api.faros.ai/graphs/default/graphql",  { 
          method: 'post', 
          headers: new Headers({
              'Authorization': 'f3LeyW8zJ7kO8XLAginK8HKV2hAuZfGe', 
              'Content-Type': 'application/json'
          }),
          body: JSON.stringify({"query":"query { vcs_PullRequest { state createdAt mergedAt updatedAt repository {       name       createdAt     }   \t\tauthor {   \t\t\tid \t\t\tuid \t\t\tname \t\t\temail  \t\t}    \t\tcommits {     \t\t\tcommit {         sha       }    \t\t\t} \t\t}  \t}"})  
        });
        const prData = await response.json();
      console.log("API response : ");
      console.log(prData);
      console.log('repos');
      console.log(repos);
      let repoFullName  = repos[0].name;
      let repoNameSplit = repoFullName.split('/');
      let repoName  = (repoNameSplit.length>1 ? repoNameSplit[repoNameSplit.length-1] : repoFullName);
      let pullrequestData = applyRepoFilterForPRData(prData.data.vcs_PullRequest, repoName);

    // if (repos.length > 0) {
    //   return await githubIssuesApi.fetchIssuesByRepoFromGithub(
    //     repos,
    //     itemsPerRepo,
    //     options,
    //   );
    // }
    return { isLoading, pullrequestData, retry };


    //return {};
  }, [repos]);

  return { isLoading, prData: PullRequest, retry };
};

