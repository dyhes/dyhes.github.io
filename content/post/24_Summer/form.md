---
title: 【Antd】Form
# description: Math typesetting using KaTeX
date: 2024-08-09 00:00:00+0000
categories: 
    - nutrition
    - grass
tags:
    - Antd
---
# useForm and Antd Form
Both `useForm` and the `antd Form` component are popular tools for handling form state and validation in React applications, but they come from different libraries and have different approaches and features.

## useForm (from `react-hook-form`)
`useForm` is a hook provided by the `react-hook-form` library, which focuses on providing a highly performant and flexible way to handle form state and validation in React.
### Key Features
1. **Performance**: `useForm` minimizes re-renders, making it highly performant, especially for large forms.
2. **Minimal Re-renders**: By default, form state is managed in a way that prevents unnecessary re-renders of the entire form, updating only the specific fields that need to be updated.
3. **Validation**: Offers built-in validation and also supports schema validation using libraries like Yup.
4. **Ease of Use**: Simple API that makes it easy to integrate and manage form state.
5. **Integration with UI Libraries**: Can be easily integrated with various UI component libraries, although it doesn't provide its own set of form components.
### Example Usage
```jsx
import React from 'react';
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName', { required: true })} />
      {errors.firstName && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}
```
## antd Form Component
The `antd Form` component is part of the Ant Design library, which is a popular UI framework for React. The `Form` component provides a set of form management features that are tightly integrated with the Ant Design component library.

### Key Features
1. **Integrated with Ant Design**: Comes with pre-styled form components that match the Ant Design aesthetic.
2. **Declarative Syntax**: Uses a declarative syntax to define form fields and validation rules.
3. **Validation**: Built-in support for validation rules and messages, including custom validation.
4. **Data Binding**: Provides mechanisms for data binding and state management.
5. **Layout**: Offers various layout options to organize form fields in a responsive manner.

### Example Usage
```jsx
import React from 'react';
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';

const MyForm = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
```

## Summary

- **Performance**: `useForm` is generally more performant due to its minimal re-renders.
- **UI Integration**: `antd Form` is tightly integrated with the Ant Design component library, providing a consistent UI.
- **Flexibility**: `useForm` offers more flexibility for integrating with different UI libraries.
- **Declarative vs. Imperative**: `antd Form` uses a more declarative approach to define fields and validation, while `useForm` relies on hooks and a more imperative approach.

Choosing between the two often depends on your specific needs, such as performance requirements, UI consistency, and the complexity of your form logic.