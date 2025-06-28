import fetch from 'node-fetch';

const TOKEN = "164c6f0a-b446-41b5-bffe-7c68113db02a";
const PROJECT_ID = "5bb6a463-50d8-4017-af36-d7d0c1ee4e2c";
const ENVIRONMENT_ID = "1c7b2c65-60d8-4ebf-9413-943d4e02d059";

// const query = `
//   query observabilityDashboards(
//     $after: String,
//     $before: String,
//     $environmentId: String!,
//     $first: Int,
//     $last: Int
//   ) {
//     observabilityDashboards(
//       after: $after,
//       before: $before,
//       environmentId: $environmentId,
//       first: $first,
//       last: $last
//     ) {
//       edges {
//         node {
//           id
//           name
//           createdAt
//           updatedAt
//           graphs {
//             name
//             metrics {
//               name
//               unit
//             }
//           }
//         }
//       }
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//     }
//   }
// `;


const query = `
  {
    viewer {
      id
      name
    }
  }
`;


const variables = {
  after: null,
  before: null,
  environmentId: ENVIRONMENT_ID,
  first: 10,
  last: null,
};

async function getObservabilityDashboards() {
  try {
    const response = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
    } else {
      console.log(JSON.stringify(data.data, null, 2));
    }
  } catch (error) {
    console.error('Error fetching observability dashboards:', error);
  }
}

getObservabilityDashboards();
