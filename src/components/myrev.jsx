import { ME } from './graphql/queries';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@apollo/client/react';
import ReviewItem from './reviwitem';

const styles = StyleSheet.create({
  reviewsheader: {
    fontSize: 25,
  },
});

const MYREV = () => {
  const { data, loading, error, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Text>Loading reviews...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data?.me) {
    return <Text>Please sign in to see your reviews.</Text>;
  }

  const reviews = data.me.reviews?.edges?.map(
    (edge) => edge.node
  ) ?? [];

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={styles.reviewsheader}>My Reviews</Text>

      {reviews.length === 0 ? (
        <Text>You have not written any reviews yet.</Text>
      ) : (
        <FlatList
  data={reviews}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ReviewItem
      review={item}
      showButton={true}
      onDelete={refetch}
    />
  )}
/>
      )}
    </View>
  );
};

export default MYREV;