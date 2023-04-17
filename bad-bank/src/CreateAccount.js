import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { auth} from './firebase';

function CreateAccount() {
  let [buttonName, setButtonName] = useState("Create Account")

  const createAccountWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("Account created successfully!", userCredential);
      return userCredential;
    } catch (error) {
      console.error("Error creating user: ", error);
      throw error; // throw the error here instead of returning null
    }
  };
  
  

  return (
    <Card style={{ width: '50%', margin: '0 auto' }}>
      <Card.Header style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '24px' }}>Create Account</Card.Header>
      <Card.Body>
        <Formik
          initialValues={{ name: '', email: '', password: '', accountType: '' }}
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = 'Required';
            }
            if (!values.email) {
              errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = 'Invalid email address';
            }
            if (!values.password) {
              errors.password = 'Required';
            } else if (values.password.length < 8) {
              errors.password = 'Password must be at least 8 characters long';
            }
            if (!values.accountType.length) {
              errors.accountType = 'Select at least one';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            // Handle submission with Firebase here
            console.log(values)
            createAccountWithEmailAndPassword(values.email, values.password)
              .then(() => {
                console.log("User created successfully");
                setSubmitting(false);
                alert("Account Created Successfully");
                setButtonName("Create Another Account");
              })
              .catch(error => {
                console.error("Error creating user: ", error);
                setSubmitting(false);
                alert("Failed to create account: " + error.message); // display the error message here
              });
          }}
          
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} isInvalid={touched.name && errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="text" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} isInvalid={touched.email && errors.email} />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} isInvalid={touched.password && errors.password} />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formAccountType">
                <Form.Label>Account Type</Form.Label>
                <Form.Check type="radio"  name="accountType" label="Employee" onChange={handleChange} onBlur={handleBlur} value="employee" id="employee-check" checked={values.accountType === 'employee'} isInvalid={touched.accountType && errors.accountType} />
                <Form.Check type="radio"  name="accountType" label="Customer" onChange={handleChange} onBlur={handleBlur} value="customer" id="customer-check" checked={values.accountType === 'customer'} isInvalid={touched.accountType && errors.accountType} />
                <Form.Control.Feedback type="invalid">{errors.accountType}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" disabled={isSubmitting}>{buttonName}</Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
}

export default CreateAccount;