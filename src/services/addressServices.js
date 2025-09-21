const db = require("../models/db");

const addressServices = {
  addAddress: (customerId, data, callback) => {
    const { addressLine, city, state, pinCode } = data;
    db.run(
      `INSERT INTO addresses (customer_id, address_line, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`,
      [customerId, addressLine, city, state, pinCode],
      function (err) {
        if (err) return callback(err);
        callback(null, this.lastID);
      }
    );
  },

  updateAddress: (addressId, data, callback) => {
    const { addressLine, city, state, pinCode } = data;
    db.run(
      `UPDATE addresses SET address_line=?, city=?, state=?, pin_code=? WHERE address_id=?`,
      [addressLine, city, state, pinCode, addressId],
      function (err) {
        if (err) return callback(err);
        callback(null, { updated: this.changes });
      }
    );
  },

  deleteAddress: (addressId, callback) => {
    db.run(
      `DELETE FROM addresses WHERE address_id=?`,
      [addressId],
      function (err) {
        if (err) return callback(err);
        callback(null, { deleted: this.changes });
      }
    );
  },

  getAddressesByCustomerId: (customerId, callback) => {
    db.all(
      `SELECT * FROM addresses WHERE customer_id=?`,
      [customerId],
      callback
    );
  },
};

module.exports = addressServices;
