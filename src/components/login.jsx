
import { Text, TextInput, Pressable, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import useSignIn from './useSignIn';
import { useState } from 'react';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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


const Login = () => {
  const navigate = useNavigate();
  const [signIn] = useSignIn();
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async values => {
      const { username, password } = values;

      setSubmitError('');
      try {
        await signIn({
          username,
          password,
        });

        navigate('/');

      } catch (e) {
        console.error('Failed to sign in:', e);
        setSubmitError(e.message || 'Unable to sign in. Please try again.');
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

      <TextInput
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
        style={[
          styles.input,
          formik.touched.username && formik.errors.username
            ? styles.errorInput
            : null,
        ]}
      />

      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>
          {formik.errors.username}
        </Text>
      )}

      <TextInput
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        secureTextEntry
        style={[
          styles.input,
          formik.touched.password && formik.errors.password
            ? styles.errorInput
            : null,
        ]}
      />

      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>
          {formik.errors.password}
        </Text>
      )}

      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );
};

export default Login;
