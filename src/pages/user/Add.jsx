import React from 'react';
import UserForm from '../../containers/user/form';
import PageTitle from '../../components/Typography/PageTitle';

function AddUser() {
  return (
    <>
      <PageTitle>Create User</PageTitle>
      <UserForm />
    </>
  );
}

export default AddUser;
