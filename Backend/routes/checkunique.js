const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const conn = require("../config");

// API endpoint to check duplicate email
router.post("/email", (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM customers WHERE email = ?`;
  conn.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error querying MySQL: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.json({ exists: true, message: "Email already exists" });
    } else {
      res.json({ exists: false, message: "Email is available" });
    }
  });
});

// API endpoint to check duplicate phone number
router.post("/phone", (req, res) => {
  const { phone } = req.body;
  const sql = `SELECT * FROM customers WHERE phone = ?`;
  conn.query(sql, [phone], (err, results) => {
    if (err) {
      console.error("Error querying MySQL: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.json({ exists: true, message: "Phone number already exists" });
    } else {
      res.json({ exists: false, message: "Phone number is available" });
    }
  });
});

// API endpoint to check duplicate email
router.post("/email/:id", (req, res) => {
  const { email } = req.body;
  const customerId = req.params.id;
  const sql = `SELECT * FROM customers WHERE email = ?`;
  const sql_ud = `SELECT * FROM customers WHERE email = ? and id = ?`;
  conn.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error querying MySQL: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    conn.query(sql_ud, [email, customerId], (err, results_ud) => {
      if (err) {
        console.error("Error querying MySQL: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0 || results_ud.length === 1) {
        res.json({ exists: false, message: "Email is available" });
      } else {
        res.json({ exists: true, message: "Email already exists" });
      }
    });
  });
});

// API endpoint to check duplicate phone number
router.post("/phone/:id", (req, res) => {
  const { phone } = req.body;
  const customerId = req.params.id;
  const sql = `SELECT * FROM customers WHERE phone = ?`;
  const sql_ud = `SELECT * FROM customers WHERE phone = ? and id = ?`;
  conn.query(sql, [phone], (err, results) => {
    if (err) {
      console.error("Error querying MySQL: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    conn.query(sql_ud, [phone, customerId], (err, results_ud) => {
      if (err) {
        console.error("Error querying MySQL: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0 || results_ud.length === 1) {
        res.json({ exists: false, message: "Phone number is available" });
      } else {
        res.json({ exists: true, message: "Phone number already exists" });
      }
    });
  });
});

module.exports = router;
