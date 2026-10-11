
import { View, Text, StyleSheet,Button ,Alert,Pressable} from 'react-native';
import { DELETE_REVIEW} from './graphql/queries';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client/react';
const styles = StyleSheet.create({
  viewRepoButton: {
  backgroundColor: '#0366d6',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 5,
  alignSelf: 'center',
  marginRight: 8,
},
viewRepoButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
buttonRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
  container: {
    backgroundColor: '#b8bfc7',
    padding: 15,
    flexDirection: 'row',
  },
 buttondel: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 5,
  alignSelf: 'center',
  marginRight: 8,
  backgroundColor: '#8d1414',
  
},
buttondelText: {
  color: 'white',
  fontWeight: 'bold',
},
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  rating: {
    borderWidth: 2,
    borderColor: '#0366d6',
    color: '#0366d6',
    fontWeight: 'bold',
    width: 45,
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 23,
    overflow: 'hidden',
    paddingTop: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  date: {
    color: '#586069',
    marginVertical: 4,
  },
});

const ReviewItem = ({ review, showButton = false ,onDelete }) => {
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const navigate = useNavigate();

  const handleDelete = () => {
  Alert.alert(
    'Delete review',
    'Are you sure you want to delete this review?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview({
              variables: { id: review.id },
            });
            await onDelete?.();
           
          } catch (error) {
            console.error('Failed to delete review:', error);
          }
        },
      },
    ],
    { cancelable: true }
  );
};

  return (
    <View style={styles.container}>
      <Text style={styles.rating}>{review.rating}</Text>

      <View style={styles.content}>
        <Text style={styles.username}>{review.user.username}</Text>

        <Text style={styles.date}>
          {new Date(review.createdAt).toLocaleDateString()}
        </Text>

        <Text>{review.text}</Text>
      </View>



        {showButton && (
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.viewRepoButton}
            onPress={() => navigate(`/repository/${review.repositoryId}`)}
          >
            <Text style={styles.viewRepoButtonText}>View Repository</Text>
          </Pressable>

          <Pressable style={styles.buttondel} onPress={handleDelete}>
            <Text style={styles.buttondelText}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReviewItem;
