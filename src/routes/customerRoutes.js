const express = require("express");
const router = express.Router();
const customerService = require("../services/customerServices");
const addressService = require("../services/addressServices");

// Create customer with first address automatically
router.post("/customers", (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    addressLine,
    city,
    state,
    pinCode,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !addressLine ||
    !city ||
    !state ||
    !pinCode
  ) {
    return res.status(400).send({ error: "All fields are required" });
  }

  customerService.createCustomerWithAddress(req.body, (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({
      message: "Customer and first address created successfully",
      result,
    });
  });
});

// Read customer + all addresses
router.get("/customers/:id", (req, res) => {
  customerService.getCustomerById(req.params.id, (err, customer) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(customer);
  });
});


// Get customer + addresses + onlyOneAddress flag
router.get("/customers/:id", (req, res) => {
  customerService.getCustomerById(req.params.id, (err, customer) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(customer);
  });
});


// Update customer
router.put("/customers/:id", (req, res) => {
  customerService.updateCustomer(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({ message: "Customer updated successfully", result });
  });
});

// Delete customer + addresses
router.delete("/customers/:id", (req, res) => {
  customerService.deleteCustomer(req.params.id, (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({
      message: "Customer and all addresses deleted successfully",
      result,
    });
  });
});

// Search customers by city/state/pin
router.get("/customers", (req, res) => {
  customerService.searchCustomers(req.query, (err, rows) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(rows);
  });
});

// Pagination + sorting
router.get("/customers-list", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "customer_id";

  customerService.listCustomers(page, limit, sortBy, (err, rows) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(rows);
  });
});

// Add additional address for customer
router.post("/customers/:id/addresses", (req, res) => {
  const customerId = req.params.id;
  const { addressLine, city, state, pinCode } = req.body;

  if (!addressLine || !city || !state || !pinCode) {
    return res.status(400).send({ error: "All address fields are required" });
  }

  addressService.addAddress(customerId, req.body, (err, addressId) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({ message: "Address added successfully", addressId });
  });
});

// Update an address
router.put("/addresses/:addressId", (req, res) => {
  addressService.updateAddress(
    req.params.addressId,
    req.body,
    (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      res.send({ message: "Address updated successfully", result });
    }
  );
});

// Delete an address
router.delete("/addresses/:addressId", (req, res) => {
  addressService.deleteAddress(req.params.addressId, (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({ message: "Address deleted successfully", result });
  });
});

// List all addresses for a customer
router.get("/customers/:id/addresses", (req, res) => {
  addressService.getAddressesByCustomerId(req.params.id, (err, rows) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(rows);
  });
});

module.exports = router;
