
import {
  createApiRef,
  ConfigApi,
  ErrorApi,
  OAuthApi,
} from '@backstage/core-plugin-api';
import { readGithubIntegrationConfigs } from '@backstage/integration';
import { ForwardedError } from '@backstage/errors';

import React, { useState, useEffect } from "react";
import { Octokit  } from "@octokit/rest";


export  function getSomeMessage(): string {
     return 'From get function'
    }

 export  async function fetchAllRepos(org) {
      const octokit = new Octokit({auth:''});
      const repos = [];
      let page = 1;
      console.log('Calling fetchAllRepos...')
      while (true) {
          const result = await octokit.request('GET /orgs/{org}/repos', {
              org: org,
             // type: 'public',
             // per_page: 100,
           //   page: page
          });
  
          if (result.data.length === 0) 
            {         
              console.log('No Repos found') 
                break;
            }
          //repos.push(...result.data);
          console.log('Inside fetchAllRepos...')
          console.log(result.data)
          return result.data;
          page++;
      }
      return repos;
  }

  export interface User {
    id: number;
    login?: string;
    type?: string;
    url?: string;
  }
  export interface PullRequest {
    id?: number;
    title?: string;
    merged_at?: string;
    closed_at?: string;
    created_at?: string;
    updated_at?: string;
    state?:string;
    user: User;
  }

  export  async function fetchAllPullRequests(org, repoName) {
    const octokit = new Octokit({auth:''});
    const pullRequests : PullRequest[] = [];
    //const pullRequests = [];
    let page = 1;
    console.log('Calling fetch All pull requests by repo name...')
    while (true) {
        const result = await  octokit.request('GET /repos/{owner}/{repo}/pulls', {
          owner: org,
          repo: repoName,
          state: 'closed',
          per_page: 100,
          page: page
      });

        if (result.data.length === 0) 
        {         
            console.log('No Pull requests found') 
            break;
        }
        //const temp =  JSON.parse(JSON.stringify(result.data))
        //const temp = result.data as PullRequest[]
        pullRequests.push(...result.data as PullRequest[]);
        //console.log('Inside fetchAllPullRequests...')
        //console.log(result.data)
        //return result.data;
        page++;
    }
    console.log('Inside fetchAllPullRequests...')
    console.log(pullRequests)
    return pullRequests;
}


export function getRepos()
{
    const octokit = new Octokit({auth:''});
    console.log('Repos..');
    octokit.rest.repos
    .listForOrg({
         org: "philips-internal"
     // org: "philips-internal",
     // type: "public",
    })
    .then(({ data }) => {
        console.log(data);
        //console.log(data[0].url);
      //setRepos(data);
      return data;
    }).catch((error)=> {
        console.log('Error occurred..');
        console.log(error);
    } );
    return "Done.."
}


