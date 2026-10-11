
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client/react';

import ReviewItem from './reviwitem';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import { GET_REPOSITORY } from './graphql/queries';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d73a4a',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerError: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  retryButton: {
    color: '#0366d6',
    fontWeight: 'bold',
  },
});

const PAGE_SIZE = 5;

const SingleRepository = () => {
  const { id } = useParams();
  const [loadingMore, setLoadingMore] = useState(false);
  const [paginationError, setPaginationError] = useState(null);
  const loadingMoreRef = useRef(false);

  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  const loadMoreReviews = async () => {
    const pageInfo = data?.repository?.reviews?.pageInfo;
    if (
      loadingMoreRef.current ||
      !pageInfo?.hasNextPage ||
      !pageInfo.endCursor
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setPaginationError(null);

    try {
      await fetchMore({
        variables: {
          id,
          first: PAGE_SIZE,
          after: pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult?.repository) {
            return previousResult;
          }

          const currentEdges = previousResult.repository.reviews.edges;
          const knownReviewIds = new Set(
            currentEdges.map((edge) => edge.node.id),
          );
          const nextEdges = fetchMoreResult.repository.reviews.edges.filter(
            (edge) => !knownReviewIds.has(edge.node.id),
          );

          return {
            ...previousResult,
            repository: {
              ...fetchMoreResult.repository,
              reviews: {
                ...fetchMoreResult.repository.reviews,
                edges: [...currentEdges, ...nextEdges],
              },
            },
          };
        },
      });
    } catch (fetchError) {
      console.error('Failed to load more reviews:', fetchError);
      setPaginationError(fetchError.message);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0366d6" />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error: {error.message}
        </Text>
      </View>
    );
  }

  const repository = data?.repository;

  if (!repository) {
    return (
      <View style={styles.centerContainer}>
        <Text>Repository not found.</Text>
      </View>
    );
  }

  const reviews =
    repository.reviews?.edges?.map((edge) => edge.node) ?? [];

  return (
    <FlatList
      data={reviews}
      onEndReached={loadMoreReviews}
      onEndReachedThreshold={0.5}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReviewItem review={item} />
      )}
      ListHeaderComponent={
        <RepositoryItem
          item={repository}
          showGithubButton
          showreviws
        />
      }
      ItemSeparatorComponent={() => (
        <View style={{ height: 10 }} />
      )}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text>No reviews yet.</Text>
        </View>
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#0366d6" />
          </View>
        ) : paginationError ? (
          <View style={styles.footerError}>
            <Text style={styles.errorText}>{paginationError}</Text>
            <Pressable onPress={loadMoreReviews} accessibilityRole="button">
              <Text style={styles.retryButton}>Try again</Text>
            </Pressable>
          </View>
        ) : null
      }
    />
  );
};

export default SingleRepository;
