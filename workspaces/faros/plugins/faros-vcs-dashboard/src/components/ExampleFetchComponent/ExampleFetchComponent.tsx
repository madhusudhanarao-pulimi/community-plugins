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
              <td width="50%">
              <CanvasJSChart options = {value} containerProps={{ width: "700px", height: "400px" }}  />
              </td>
              <td width="50%">
                
              </td>
            </tr>
        </tbody>
        
      </table> 
      
    </body>
  </div>
);
};
