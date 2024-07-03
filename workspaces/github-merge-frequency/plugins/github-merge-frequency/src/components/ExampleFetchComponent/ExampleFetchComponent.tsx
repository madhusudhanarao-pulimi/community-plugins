import React from 'react';
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {PullRequest, getSomeMessage, getRepos, fetchAllRepos, fetchAllPullRequests } from '../../api/testApi'


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
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Derrick',
        last: 'Carter',
      },
      email: 'derrick.carter@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Derrick',
      nat: 'IE',
    },
    {
      gender: 'female',
      name: {
        title: 'Miss',
        first: 'Mattie',
        last: 'Lambert',
      },
      email: 'mattie.lambert@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Mattie',
      nat: 'AU',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Mijat',
        last: 'Rakić',
      },
      email: 'mijat.rakic@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Mijat',
      nat: 'RS',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Javier',
        last: 'Reid',
      },
      email: 'javier.reid@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Javier',
      nat: 'US',
    },
    {
      gender: 'female',
      name: {
        title: 'Ms',
        first: 'Isabella',
        last: 'Li',
      },
      email: 'isabella.li@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Isabella',
      nat: 'CA',
    },
    {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Stephanie',
        last: 'Garrett',
      },
      email: 'stephanie.garrett@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Stephanie',
      nat: 'AU',
    },
    {
      gender: 'female',
      name: {
        title: 'Ms',
        first: 'Antonia',
        last: 'Núñez',
      },
      email: 'antonia.nunez@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Antonia',
      nat: 'ES',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Donald',
        last: 'Young',
      },
      email: 'donald.young@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Donald',
      nat: 'US',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Iegor',
        last: 'Holodovskiy',
      },
      email: 'iegor.holodovskiy@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Iegor',
      nat: 'UA',
    },
    {
      gender: 'female',
      name: {
        title: 'Madame',
        first: 'Jessica',
        last: 'David',
      },
      email: 'jessica.david@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Jessica',
      nat: 'CH',
    },
    {
      gender: 'female',
      name: {
        title: 'Ms',
        first: 'Eve',
        last: 'Martinez',
      },
      email: 'eve.martinez@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Eve',
      nat: 'FR',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Caleb',
        last: 'Silva',
      },
      email: 'caleb.silva@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Caleb',
      nat: 'US',
    },
    {
      gender: 'female',
      name: {
        title: 'Miss',
        first: 'Marcia',
        last: 'Jenkins',
      },
      email: 'marcia.jenkins@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Marcia',
      nat: 'US',
    },
    {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Mackenzie',
        last: 'Jones',
      },
      email: 'mackenzie.jones@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Mackenzie',
      nat: 'NZ',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Jeremiah',
        last: 'Gutierrez',
      },
      email: 'jeremiah.gutierrez@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Jeremiah',
      nat: 'AU',
    },
    {
      gender: 'female',
      name: {
        title: 'Ms',
        first: 'Luciara',
        last: 'Souza',
      },
      email: 'luciara.souza@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Luciara',
      nat: 'BR',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Valgi',
        last: 'da Cunha',
      },
      email: 'valgi.dacunha@example.com',
      picture: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=Valgi',
      nat: 'BR',
    },
  ],
};

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

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

const saveAllRepos = async () => {
  const data = await  fetchAllRepos('philips-internal');
  console.log('saveAllRepos count : ' + data.length)
}

//const [prdata, setprdata] = useState<Object[]>([]);

type PRsCountByUser = {
  userName: string; 
  prsCount: number; 
}
const saveAllPullrequests = async () => {
  const allPullRequests = await  fetchAllPullRequests('philips-internal', 'cvd_rest');
  console.log('Pull Requests count : ' + allPullRequests.length)
  console.log( allPullRequests[0].user.login)
   
   //Apply group by user name
   const grouped: { [login: string]: PullRequest[] } = {};
   allPullRequests.forEach(pr => {
     const login = pr.user.login || 'unknown'; // fallback in case login is undefined
 
     if (grouped[login]) {
       grouped[login].push(pr);
     } else {
       grouped[login] = [pr];
     }
   });

    const prsCountbyUser : PRsCountByUser[]=[];
    Object.keys(grouped).map(login=> grouped[login].length)
    console.log('#################');
    var newArr = Object.keys(grouped).map(function(val, index){
      // printing element
    console.log("key : ",val, "value : ",grouped[val].length);
    prsCountbyUser.push({prsCount :grouped[val].length, userName:val })
  });
  
  return prsCountbyUser;
}
 

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const DenseTable =  ({ users }: DenseTableProps) => {
  //const [prdata, setprdata] = useState<Object[]>([]);
  const classes = useStyles();
  const msg = getSomeMessage();
  const repos = getRepos();
 // saveAllRepos();
  const prsCountbyUser =  saveAllPullrequests();

  const allrepos = fetchAllRepos('philips-internal');
  console.log('allrepos count ' + allrepos)

  console.log('Calling getRepos')
  console.log(repos)

  const columns: TableColumn[] = [
    { title: 'User Name', field: 'name' },
    { title: 'PRs count', field: 'count' },
  ];

  // const data : Object[]=[];
  // const tempdata = prsCountbyUser.then(prsCountByUser =>prsCountByUser.map( user =>  {
  //   data.push( {
  //     name: `${user.userName} `,
  //     email: `${user.prsCount}`,
  //   });
  // }));
  //setprdata(data);
 
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
     // email: user.email,
     count: repos[1],
      nationality: user.nat,
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

export const ExampleFetchComponent = () => {

  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    // Would use fetch in a real world example
    return exampleUsers.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable users={value || []} />;
};
