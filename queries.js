const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'learning',
  password: 'postgres',
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM customers ', (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

// pool.query("INSERT INTO customers (customer_id,first_name, last_name) VALUES (6,'test','test') ", (error, results) => {
//   if (error) {
//     throw error
//   }
//   response.status(201).send('get')
//getUsers.toString

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    'SELECT * FROM customers WHERE customer_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createUser = (request, response) => {
  const { customer_id, first_name, last_name } = request.body;
  pool.query(
    'INSERT INTO customers (customer_id,first_name,last_name ) VALUES ($1, $2, $3)',
    [customer_id, first_name, last_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    }
  );
};

const updateUser = (request, response) => {
  const customer_id = parseInt(request.params.id);
  const { first_name, last_name } = request.body;

  pool.query(
    'UPDATE customers SET first_name = $2,  last_name = $3 WHERE customer_id = $1',
    [customer_id, first_name, last_name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${customer_id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const customer_id = parseInt(request.params.id);

  pool.query(
    'DELETE FROM customers WHERE customer_id = $1',
    [customer_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${customer_id}`);
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
