import gql from "graphql-tag";
import Link from "next/link";
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

  return <div>Welcome to {projects[0].name}</div>;
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
