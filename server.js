const express = require('express');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const validatePhoneNumber = require('validate-phone-number-node-js');
const logger = require('./logger');
const contact = require('./data');
const db = require('./queries');

const app = express();

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.all('*', (req, res) => {
//   res.status(404).send('resource not found');
// });

app.get('/contact', (req, res) => {
  res.send({
    success: true,
    message: 'data fatched successfully',
    data: contact,
  });
  logger.contactLogger.log('info', 'getRequest');
});

app.get('/contact/:id', (req, res) => {
  var id = req.params.id;
  var newContacts = contact.filter((e1) => (e1.id = id));
  contact = newContacts;
  res.send({
    success: true,
    message: 'data removed successfully',
    data: newContacts,
  });
  logger.contactLogger.log('info', `getRequestWithID${id}`);
});

app.post('/contact', (req, res) => {
  var name = req.body.name;
  var number = req.body.number;
  console.log('name ===>', name + number);
  if (name && number) {
    const result = validatePhoneNumber.validate(number);
    console.log('resultsssss', result);
    contact.push({
      id: (contact.length + 1).toString(),
      name: name,
      number: number,
    });
    res.send({
      success: true,
      message: 'data added successfully',
    });
  } else if (name == null) {
    res.send('name is empty');
  } else if (number == null) {
    res.send('number is empty');
  } else {
    res.send({
      success: false,
      message: 'invalid req',
      errors: [
        {
          field: 'name',
          message: 'name cannot be null',
        },
      ],
    });
  }
});

app.delete('/contact/:id', (req, res) => {
  var id = req.params.id;
  var newContacts = contact.filter((e1) => e1.id != id);
  contact = newContacts;
  res.send({
    success: true,
    message: 'data removed successfully',
  });
  logger.contactLogger.log('info', `deleteRequestWithID${id}`);
});

app.put('/contact/:id', (req, res) => {
  var id = req.params.id;
  var name = req.body.name;
  var index = contact.findIndex((e1) => e1.id == id);
  contact[index] = {
    ...contact[index],
    name: name,
  };
  res.send({
    success: true,
    message: 'updated succesfully',
  });
  logger.contactLogger.log('info', `updateRequestWithID${id}`);
});

app.listen(PORT, () => {
  console.log(`server is listening ${PORT}`);
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
