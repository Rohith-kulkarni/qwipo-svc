const db = require("../models/db");

const customerServices = {
  createCustomerWithAddress: (data, callback) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      addressLine,
      city,
      state,
      pinCode,
    } = data;

    // Insert customer
    db.run(
      `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`,
      [firstName, lastName, phoneNumber],
      function (err) {
        if (err) return callback(err);

        const customerId = this.lastID;

        // Insert first address automatically
        db.run(
          `INSERT INTO addresses (customer_id, address_line, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`,
          [customerId, addressLine, city, state, pinCode],
          function (addrErr) {
            if (addrErr) return callback(addrErr);
            callback(null, { customerId, addressId: this.lastID });
          }
        );
      }
    );
  },

  getCustomerById: (id, callback) => {
    db.get(
      `SELECT * FROM customers WHERE customer_id=?`,
      [id],
      (err, customer) => {
        if (err) return callback(err);

        db.all(
          `SELECT * FROM addresses WHERE customer_id=?`,
          [id],
          (addrErr, addresses) => {
            if (addrErr) return callback(addrErr);
            const onlyOneAddress = addresses.length === 1;
            callback(null, { ...customer, addresses, onlyOneAddress });
          }
        );
      }
    );
  },

  updateCustomer: (id, updates, callback) => {
    const { firstName, lastName, phoneNumber } = updates;
    db.run(
      `UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE customer_id=?`,
      [firstName, lastName, phoneNumber, id],
      function (err) {
        if (err) return callback(err);
        callback(null, { updated: this.changes });
      }
    );
  },

  deleteCustomer: (id, callback) => {
    db.run(`DELETE FROM addresses WHERE customer_id=?`, [id], (err) => {
      if (err) return callback(err);
      db.run(
        `DELETE FROM customers WHERE customer_id=?`,
        [id],
        function (delErr) {
          if (delErr) return callback(delErr);
          callback(null, { deleted: this.changes });
        }
      );
    });
  },

  listCustomers: (page, limit, sortBy, callback) => {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM customers ORDER BY ${
      sortBy || "customer_id"
    } LIMIT ? OFFSET ?`;
    db.all(query, [limit, offset], callback);
  },

  searchCustomers: (filters, callback) => {
    const { city, state, pin } = filters;
    let query = `
      SELECT c.customer_id, c.first_name, c.last_name, c.phone_number,
             a.address_line, a.city, a.state, a.pin_code
      FROM customers c
      JOIN addresses a ON c.customer_id = a.customer_id
      WHERE 1=1
    `;
    const params = [];

    if (city) {
      query += " AND a.city=?";
      params.push(city);
    }
    if (state) {
      query += " AND a.state=?";
      params.push(state);
    }
    if (pin) {
      query += " AND a.pin_code=?";
      params.push(pin);
    }

    db.all(query, params, callback);
  },
};

module.exports = customerServices;
