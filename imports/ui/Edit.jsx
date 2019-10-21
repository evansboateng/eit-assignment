import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';

import {Eits} from '../api/eits.js';

// components
import 'bootstrap/dist/css/bootstrap.min.css';
import Botton from './components/button.component.jsx';
import Input from './components/input.component.jsx';
import Nav from './components/nav.component.jsx';

// Edit form component
const Form = props => {
  const initialValue = {};
  const [inputsForm, setInputs] = useState(initialValue);

  //   Get user
  const user = Eits.findOne(props.userId);

  // handle input changes
  const handleInputChange = e => {
    e.preventDefault();
    const {name, value} = e.target;
    setInputs(inputsForm => ({...inputsForm, [name]: value}));
  };

  // update handler
  const updateHandler = e => {
    e.preventDefault();
    const {firstName, surname, age, country} = inputsForm;
    const updatedObj = {
      firstName,
      surname,
      age,
      country
    };
    Meteor.call('eit.update', user._id, updatedObj);

    props.history.push('/');
    // return <Redirect to="/" />;
  };

  return (
    <form onSubmit={updateHandler}>
      <Input defaultValue={user._id} name="id" readOnly type={'text'} hidden />
      <Input
        divClass={'form-group'}
        htmlFor={'surname'}
        labelName={'Surname'}
        defaultValue={user.surname}
        onChange={handleInputChange}
        name="surname"
        type={'text'}
        className={'form-control'}
      />
      <Input
        divClass={'form-group'}
        htmlFor={'firstname'}
        labelName={'Firstname'}
        defaultValue={user.firstName}
        onChange={handleInputChange}
        name="firstName"
        type={'text'}
        className={'form-control'}
      />
      <Input
        divClass={'form-group'}
        htmlFor={'age'}
        labelName={'Age'}
        defaultValue={user.age}
        onChange={handleInputChange}
        name="age"
        type={'text'}
        className={'form-control'}
      />
      <Input
        divClass={'form-group'}
        htmlFor={'country'}
        labelName={'Country'}
        defaultValue={user.country}
        onChange={handleInputChange}
        name="country"
        type={'text'}
        className={'form-control'}
      />
      <Botton
        type={'submit'}
        className={'btn btn-primary'}
        buttonName={'Update'}
      />
      <Botton
        type={'submit'}
        className={'btn btn-secondary-outline ml-3'}
        buttonName={'Cancel'}
      />
    </form>
  );
};

const Edit = props => {
  console.log(props);
  return (
    <div>
      <Nav />
      <div className="container">
        <div className="card">
          <div className="card-body">
            <Form userId={props.match.params.id} {...props} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Edit);
