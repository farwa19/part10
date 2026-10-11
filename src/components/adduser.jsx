
import { Text, TextInput, Pressable, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { CREATE_USER } from './graphql/queries';

const initialValues = {
  username: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = yup.object().shape({

username: yup
  .string()
  .required('Username is required')
  .min(5, 'Username must be at least 5 characters'),

 password: yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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

const AddUser = () => {
  const navigate = useNavigate();
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError('');
      try {
        const { data } = await createUser({
          variables: {
            user: {
              username: values.username.trim(),
              password: values.password,
            },
          },
        });

        console.log('User created:', data?.createUser);
        navigate('/login');
      } catch (error) {
        console.error('Failed to create user:', error);
        setSubmitError(error.message || 'Unable to create user. Please try again.');
      }
    },
  });

  const fields = [
    { name: 'username', placeholder: 'Username' },
    { name: 'password', placeholder: 'Password', secureTextEntry: true },
    { name: 'confirmPassword', placeholder: 'Confirm password', secureTextEntry: true },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>

      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

      {fields.map((field) => (
        <View key={field.name} style={{ width: '100%', alignItems: 'center' }}>
          <TextInput
            placeholder={field.placeholder}
            value={formik.values[field.name]}
            onChangeText={formik.handleChange(field.name)}
            onBlur={formik.handleBlur(field.name)}
            secureTextEntry={field.secureTextEntry || false}
            style={[
              styles.input,
              formik.touched[field.name] && formik.errors[field.name]
                ? styles.errorInput
                : null,
            ]}
          />

          {formik.touched[field.name] && formik.errors[field.name] && (
            <Text style={styles.errorText}>{formik.errors[field.name]}</Text>
          )}
        </View>
      ))}

      <Pressable onPress={formik.handleSubmit} disabled={loading} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create User'}</Text>
      </Pressable>
    </View>
  );
};

export default AddUser;
