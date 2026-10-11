import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from './graphql/queries';

const useRepositories = (searchKeyword = '') => {
  const { data, loading, error, refetch } = useQuery(
    GET_REPOSITORIES,
    {
      variables: {
        searchKeyword: searchKeyword.trim() || undefined,
      },
    }
  );

  const repositories =
    data?.repositories?.edges?.map((edge) => edge.node) || [];

  return { repositories, loading, error, refetch };
};
export default useRepositories;