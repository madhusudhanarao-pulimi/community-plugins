import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import CanvasJSReact from '@canvasjs/react-charts';
import moment from 'moment';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const exampleUsers = {
  results: [
    {
      gender: 'female',
      name: {
        title: 'Miss',
        first: 'Carolyn',
        last: 'Moore',
      },
      email: 'carolyn.moore@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Carolyn',
      nat: 'GB',
    },
    {
      gender: 'female',
      name: {
        title: 'Ms',
        first: 'Esma',
        last: 'Berberoğlu',
      },
      email: 'esma.berberoglu@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Esma',
      nat: 'TR',
    },
    {
      gender: 'female',
      name: {
        title: 'Ms',
        first: 'Isabella',
        last: 'Rhodes',
      },
      email: 'isabella.rhodes@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Isabella',
      nat: 'GB',
    }
  ],
};

const filter_reponame = 'di-superset-api';
const filter_lastmanydays = 30;

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type datapoint = {
  label: string; 
  y: number;
};

type User = {
  gender: string; // "male"
  name: {
    title: string; // "Mr",
    first: string; // "Duane",
    last: string; // "Reed"
  };
  email: string; // "duane.reed@example.com"
  picture: string; // "https://api.dicebear.com/6.x/open-peeps/svg?seed=Duane"
  nat: string; // "AU"
};

type DenseTableProps = {
  users: User[];
};

// # start calculate avg PR cycle time by weekly
interface PullRequest {
  createdAt: string;
  mergedAt: string;
  origin: string;
  repository: {
    name: string;
  };
  state: {
    detail: string;
    category: string;
  };
  updatedAt: string;
}

interface PRTimeByWeek {
  weekStartDate: string;
  averageTime: number; // in milliseconds
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



const calculateAveragePRTimeByWeek = (prData: PullRequest[]): PRTimeByWeek[] => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - filter_lastmanydays);
  prData = prData.filter(pr => {
    const createdAtDate = new Date(pr.mergedAt);
    return createdAtDate >= thirtyDaysAgo && createdAtDate <= now 
           && pr.repository.name == filter_reponame;
  });

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


function GetDistinctRepos(responseData)
{
  console.log('Inside GetDistinctStates : ');
  //console.log(responseData.count);
  let repositories =  responseData.map(item => item.repository.name)
  .filter((value, index, self) => self.indexOf(value) === index);
  console.log('repositories : ');
  console.log(repositories);
  return repositories;
}

function GetPRCountByRepo(sourceData)
{
  console.log('Inside GetPRCountByRepo : ');
  //console.log(responseData.count);
  let repos =  GetDistinctRepos(sourceData);
  var temp = [] as number[];
  let datapoints = [] as  datapoint[]
   for (var repo of repos) {
     console.log(repo);
     let repoCount = 0;
     let filteredUsers = [];
      for (let i= 0; i<sourceData.length; i++) {
          if (sourceData[i].repository.name === repo ) {
            repoCount += 1; 
          }
      }
      temp = [...temp, repoCount];
      datapoints.push( {label: repo, y: repoCount});
   }

   console.log('Length of Temp[] : ' + temp.length);
   console.log(datapoints);
   return datapoints;
}

function GeneratePRCountByRepoChart(prData)
{
  let temp1=   GetPRCountByRepo(prData.data.vcs_PullRequest);
  console.log("Data by Repo: ");
  console.log(temp1);
  let chartData ={
    title: {
      text: "PR Count by Repo"
    },
    data: [
    {
      // Change type to "doughnut", "line", "splineArea", etc.
      type: "column",
      indexLabel: "{y}",
      indexLabelPlacement: "outside",  
      indexLabelOrientation: "horizontal",
      dataPoints: temp1
    }
    ]
  };
  return chartData;
}



function GeneratePRCountByWeekChart(prData)
{
  let averageTimes = calculateAveragePRTimeByWeek(prData.data.vcs_PullRequest);
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

function calculateAvgPRCycleTime(prData)
{
  let totalNumberofDays = 0;
  let totalMergedPRsCount = 0;
  let temp =prData.data.vcs_PullRequest;
  for (let i= 0; i<temp.length; i++) {
    if (temp[i].state.category === 'Merged' ) {
      let prCreatedDate = new Date(temp[i].createdAt);
      let prMergedDate = new Date(temp[i].mergedAt);

      // Calculate the difference in 
      // milliseconds between the two dates
      const differenceInMs: number = 
      Math.abs(prMergedDate.getTime() - prCreatedDate.getTime());

      // Define the number of milliseconds in a day
      const millisecondsInDay: number = 1000 * 60 * 60 * 24;

      // Calculate the difference in days by 
      // dividing the difference in milliseconds by 
      // milliseconds in a day
      const differenceInDays: number = 
      Math.floor(differenceInMs / millisecondsInDay);
      totalNumberofDays += differenceInDays;
      totalMergedPRsCount += 1;
    }
  }

    let avgPRTime = totalNumberofDays/totalMergedPRsCount;
    console.log('avgPRTime : ');
    console.log(avgPRTime);
}

export const DenseTable = ({ users }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Avatar', field: 'avatar' },
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    { title: 'Nationality', field: 'nationality' },
  ];

  const data = users.map(user => {
    return {
      avatar: (
        <img
          src={user.picture}
          className={classes.avatar}
          alt={user.name.first}
        />
      ),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      nationality: 'user.nat',
    };
  });

  return (
    <Table
      title="Example User List"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

var barChartRawData =[
  { label: "Anand Team",  y: 10  },
  { label: "BS1",  y: 11  },
  { label: "Others",  y: 20  },
  ];

let barChartData =   {
  title: {
    text: "Employees By Team"
  },
  data: [
  {
    // Change type to "doughnut", "line", "splineArea", etc.
    type: "column",
    indexLabel: "{y}",
    indexLabelPlacement: "outside",  
    indexLabelOrientation: "horizontal",
    dataPoints: barChartRawData
  }
  ]
};

export const ExampleFetchComponent = () => {

  // const { value, loading, error } = useAsync(async (): Promise<User[]> => {
  //   // Would use fetch in a real world example
  //   return exampleUsers.results;
  // }, []);

  const { value, loading, error } = useAsync(async (): Promise<any> => {

    //Fetch all repos
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

      return GeneratePRCountByWeekChart(prData);

    //   calculateAvgPRCycleTime(prData);
    // return GeneratePRCountByRepoChart(prData);
    // Would use fetch in a real world example
   // return barChartData;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }


 // return <DenseTable users={value || []} />;
 return (
  <div className="App">
    <body className="App-header">
       <table height="300px">
        <tbody>
            <tr>
              {/* <td width="50%">
               <CanvasJSChart options = {value} containerProps={{ width: "700px", height: "400px" }}  />
              </td> */}
              <td width="50%">
               <CanvasJSChart options = {value} containerProps={{ width: "700px", height: "400px" }}  /> 
              </td>
            </tr>
        </tbody>
        
      </table> 
      
    </body>
  </div>
);
};
