import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import * as Linking from 'expo-linking';

import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORY } from './graphql/queries';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 15,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
  language: {
    backgroundColor: '#0366d6',
    color: 'white',
    padding: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  stat: {
    alignItems: 'center',
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#586069',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  reviewsheader: {
     fontSize: 25,

  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#586069',
  },

  repoButtonContainer: {
    backgroundColor: '#0366d6',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  // Button text style
  repoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

const formatCount = (count) => {
  if (count < 1000) {
    return count?.toString() || '0';
  }
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
};

const RepositoryItem = ({ item, showGithubButton = false,showreviws=false }) => {
   const { data, loading, error } = useQuery(GET_REPOSITORY, {
    variables: { id: item.id },
    fetchPolicy: 'cache-and-network',
  });
  if (loading) {
  return <Text>Loading reviews...</Text>;
}

if (error) {
  return <Text>Error: {error.message}</Text>;
}

  const openRepository = () => {
  const targetUrl =
    item?.url || `https://github.com/${item?.fullName}`;

  if (targetUrl) {
    Linking.openURL(targetUrl);
  }
};
  if (!item) return null;
  console.log(item.reviews)

  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.topRow}>
        <Image
          style={styles.avatar}
          source={{ uri: item.ownerAvatarUrl }}
        />

        <View style={styles.content}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.language}>{item.language}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.number}>{formatCount(item.stargazersCount)}</Text>
            <Text style={styles.label}>Stars</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.number}>{formatCount(item.forksCount)}</Text>
            <Text style={styles.label}>Forks</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.number}>{item.reviewCount}</Text>
            <Text style={styles.label}>Reviews</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.number}>{item.ratingAverage}</Text>
            <Text style={styles.label}>Rating</Text>
          </View>
        </View>

        {showGithubButton && (
          <Pressable style={styles.repoButtonContainer} onPress={openRepository}>
            <Text style={styles.repoButtonText}>Open in GitHub</Text>
          </Pressable>
        )}
          {showreviws && (
     
            <Text style={styles.reviewsheader}>Reviews</Text>
    
        )}
       
      </View>
    </View>
  );
};

export default RepositoryItem;