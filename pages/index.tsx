import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { initializeApollo } from "../apollo/client";

const ProjectQuery = gql`
  query ProjectQuery {
    projects {
      id
      name
    }
  }
`;

const Index = () => {
  const {
    data: { projects },
  } = useQuery(ProjectQuery);

  return <div>hello world</div>;
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ProjectQuery,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Index;
