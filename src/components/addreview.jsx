
import { Text, TextInput, Pressable, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client/react';
import { ADD_REVIEW } from './graphql/queries';

const initialValues = {
  ownerName: '',
  repositoryName: '',
  rating: '',
  review: '',
};

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner is required'),
  repositoryName: yup.string().required('Repository name is required'),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .integer('Rating must be a whole number')
    .min(0, 'Rating must be at least 0')
    .max(100, 'Rating cannot exceed 100')
    .required('Rating is required'),
  review: yup.string(),
});

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#250c0c',
    padding: 10,
    marginVertical: 10,
    width: '80%',
    borderRadius: 5,
  },
  errorInput: {
    borderColor: '#d73a4a',
  },
  errorText: {
    fontSize: 14,
    color: '#d73a4a',
    width: '80%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

const AddReview = () => {
  const navigate = useNavigate();
  const [createReview, result] = useMutation(ADD_REVIEW);
  console.log("hh")

  const formik = useFormik({
    initialValues,
    validationSchema,

onSubmit: async (values) => {
  try {
    const { data } = await createReview({
      variables: {
        review: {
           ownerName: values.ownerName.trim(),
      repositoryName: values.repositoryName.trim(),
      rating: Number(values.rating),
      text: values.review || '',
        },
      },
    });
    console.log('Review added:', data.createReview);
    navigate('/');
  } catch (error) {
    console.log(
      'Failed to add review:',
      error.message
    );
  }
},

  })

  const fields = [
    { name: 'ownerName', placeholder: 'Repository owner' },
    { name: 'repositoryName', placeholder: 'Repository name' },
    { name: 'rating', placeholder: 'Rating (0–100)', keyboardType: 'numeric' },
    { name: 'review', placeholder: 'Write your review (optional)' },
  ];

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Create a Review
      </Text>

      {fields.map((field) => (
        <View key={field.name} style={{ width: '100%', alignItems: 'center' }}>
          <TextInput
            placeholder={field.placeholder}
            value={formik.values[field.name]}
            onChangeText={formik.handleChange(field.name)}
            onBlur={formik.handleBlur(field.name)}
            keyboardType={field.keyboardType || 'default'}
            multiline={field.name === 'review'}
            style={[
              styles.input,
              formik.touched[field.name] && formik.errors[field.name]
                ? styles.errorInput
                : null,
            ]}
          />

          {formik.touched[field.name] && formik.errors[field.name] && (
            <Text style={styles.errorText}>
              {formik.errors[field.name]}
            </Text>
          )}
        </View>
      ))}

      <Pressable
        onPress={formik.handleSubmit}
        disabled={result.loading}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {result.loading ? 'Submitting...' : 'Create Review'}
        </Text>
      </Pressable>
    </View>
  );
};

export default AddReview;
