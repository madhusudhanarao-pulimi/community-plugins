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
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { InfoCard, Progress } from '@backstage/core-components';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useEntityGithubRepositories } from '../../hooks/useEntityGithubRepositories';
import { useGetIssuesByRepoFromGithub, PullRequest } from '../../hooks/useGetPullrequestsByRepoFromFaros';
import { NoRepositoriesInfo } from './NoRepositoriesInfo';
import moment from 'moment';
import CanvasJSReact from '@canvasjs/react-charts';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { Typography, Grid } from '@material-ui/core';

/**
 * @public
 */


var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export interface HookResponse {
 isLoading:boolean,
 pullrequestData: PullRequest[],
 retry: object
}

interface CategoryCountItem {
  category: string;
  count: number;
}

const countByCategory = (data: PullRequest[]): CategoryCountItem[] => {
  const categoryCountMap: { [key: string]: number } = data.reduce((accumulator, current) => {
    const category = current.state.category;

    if (!accumulator[category]) {
      accumulator[category] = 0;
    }

    accumulator[category] += 1;

    return accumulator;
  }, {});

  // Convert the categoryCountMap to an array of CategoryCountItem
  return Object.entries(categoryCountMap).map(([category, count]) => ({
    category,
    count
  }));
};

type datapointWithX = {
  label: string; 
  x: number;
  y: number;
};

function GeneratePRCountByStatusChart(prData)
{
  const categoryCounts = countByCategory(prData);
      console.log('Group by state: ');
      console.log(categoryCounts);
      let datapoints = [] as datapointWithX[];
      let i = 0;
      categoryCounts.forEach(pr => {
        console.log( pr.category + ' : ' + pr.count);
        let val = '${(categoryCounts as {[key: string]: number})[key]}';
        let numVal = Number(val);
        datapoints.push({label: pr.category, y: pr.count, x: i });
        i += 1;
      });
   
  let chartData = {
    title:{
      text: "PRs Count By State"
    },
    data: [

    {
      type: "column",
      indexLabel: "{y}",
      indexLabelPlacement: "outside",  
      indexLabelOrientation: "horizontal",
      dataPoints: datapoints
    }
    ]
  };
  return chartData;
}

const filter_lastmanydays = 30;

function applyFiltersForPRData(prData: PullRequest[])
{
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - filter_lastmanydays);
  prData = prData.filter(pr => {
    const createdAtDate = new Date(pr.mergedAt);
    return createdAtDate >= thirtyDaysAgo && createdAtDate <= now;
          
  });
  return prData;
}


// Calculate the difference in milliseconds between two dates
const getTimeDifference = (start: Date, end: Date): number => end.getTime() - start.getTime();

// Get the start of the week (Monday) for a given date
const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = (day + 7) % 7; // Calculate difference to Monday
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

interface PRTimeByWeek {
  weekStartDate: string;
  averageTime: number; // in milliseconds
}



const calculateAveragePRTimeByWeek = (prData: PullRequest[]): PRTimeByWeek[] => {

  //prData = prData.filter(pr => pr.state.category === "Merged" && pr.repository.name == filter_reponame);
  console.log('prData length after filter : ' + prData.length);

  // Dictionary to store total times and counts for each week
  const weekData: { [key: string]: { totalTime: number; count: number } } = {};

  prData.forEach(pr => {
    const createdAt = new Date(pr.createdAt);
    const mergedAt = ((pr.mergedAt == null || pr.mergedAt == undefined)? 
                  new Date(pr.updatedAt) : new Date(pr.mergedAt));
    const timeDiff = getTimeDifference(createdAt, mergedAt);

    const weekStart = getStartOfWeek(mergedAt).toISOString();
    
    if (!weekData[weekStart]) {
      weekData[weekStart] = { totalTime: 0, count: 0 };
    }

    weekData[weekStart].totalTime += timeDiff;
    weekData[weekStart].count += 1;
  });

  // Define the number of milliseconds in a day
  const millisecondsInDay: number = 1000 * 60 * 60 * 24;
  // const differenceInDays: number = 
  // Math.floor(differenceInMs / millisecondsInDay);

  // Compute average time for each week
  const result: PRTimeByWeek[] = Object.keys(weekData).map(weekStart => {
    const { totalTime, count } = weekData[weekStart];
    return {
      weekStartDate:  moment(new Date(weekStart)).format('MMM DD, YYYY').toString(),
      averageTime: Math.floor(totalTime / millisecondsInDay)  / count,
    };
  });

  return result;
};

const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

type datapoint = {
  label: string; 
  y: number;
};


function GeneratePRCountByWeekChart(prData)
{
  let averageTimes = calculateAveragePRTimeByWeek(prData);
  averageTimes =  averageTimes.sort((a, b) => {
    const dateA = new Date(a.weekStartDate);
    const dateB = new Date(b.weekStartDate);
    return dateA.getTime() - dateB.getTime();
  });
  console.log("averageTimes by week : ");
  console.log(averageTimes);

    let datapoints = [] as datapoint[];
  averageTimes.forEach(pr => {
    datapoints.push({label: pr.weekStartDate, y: pr.averageTime });
  });

  let chartData ={
    axisY:
    {
      title: "Days",
    },
    
    title:{
    text: "PR Cycle time by week"
    },
     data: [
    {
      type: "line",
      dataPoints: datapoints
    }
    ],
    indexLabel: "{y}", // Simple indexLabel
    toolTip:{   
			content: "{label}: {y} days"      
		},
   
   
  };
  return chartData;
}


export const VcsDashboard = () => {
  const { repositories } = useEntityGithubRepositories();
  const {
    isLoading,
    prData,
    retry,
  } = useGetIssuesByRepoFromGithub(repositories);

  console.log(" Inside GithubIssues : ");
  //const prData1 =  prData.json();
  console.log(prData);
  let temp = prData as HookResponse;
  console.log('temp');
  console.log(temp);

  let prCountByStatusChart :any;
  let avgPRCycleTimeChart : any;
  if(temp != undefined && temp.pullrequestData != undefined)
  {
       console.log(temp.pullrequestData);
       const categoryCounts = countByCategory(temp.pullrequestData);
      console.log('Group by state: ');
      console.log(categoryCounts);
      prCountByStatusChart =  GeneratePRCountByStatusChart(temp.pullrequestData);
      let tempPRData = applyFiltersForPRData(temp.pullrequestData);
      avgPRCycleTimeChart = GeneratePRCountByWeekChart(tempPRData);
        //return { avg: avgPRCycleTimeChart, state: prCountByStatusChart };
  }
  else{
    return <NoRepositoriesInfo />;
  }
 
  // console.log(prData);
  // console.log(isLoading);

  if (!repositories.length) {
    return <NoRepositoriesInfo />;
  }

  return (
    <Page themeId="tool">
    <Header title="Welcome to faros-vcs-dashboard!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Version Control Dashboard">
        <SupportButton>Dashboard for github metrics.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          {/* <InfoCard title="Information card">
            <Typography variant="body1">
              All content should be wrapped in a card like this.
            </Typography>
          </InfoCard> */}
        </Grid>
        <Grid item>
        <div className="App">
    <body className="App-header">
       <table height="300px">
        <tbody>
            <tr>
              <td width="50%">
               <CanvasJSChart options = {avgPRCycleTimeChart} containerProps={{ width: "700px", height: "400px" }}  /> 
              </td>
              <td width="50%">
               <CanvasJSChart options = {prCountByStatusChart} containerProps={{ width: "700px", height: "400px" }}  />
              </td> 
            </tr>
        </tbody>
        
      </table> 
      
    </body>
  </div>
        </Grid>
      </Grid>
    </Content>
  </Page>

  );
};
