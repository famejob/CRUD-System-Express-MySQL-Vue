const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const util = require("util");
const { body, validationResult } = require("express-validator");
const conn = require("../config");
router.get("/customers", (req, res) => {
  // Query ข้อมูลจากฐานข้อมูล
  const sql = `SELECT * FROM customers`;
  conn.query(sql, (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
      return;
    }
    // ส่งข้อมูล JSON กลับไปยัง client
    res.json(results);
  });
});

const validateData = [
  body("first_name").notEmpty().withMessage("กรุณากรอกชื่อ"),
  body("last_name").notEmpty().withMessage("กรุณากรอกนามสกุล"),
  body("email")
    .notEmpty()
    .withMessage("กรุณากรอกอีเมล")
    .isEmail()
    .withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
  body("phone")
    .notEmpty()
    .withMessage("กรุณากรอกหมายเลขโทรศัพท์")
    .isMobilePhone("any")
    .withMessage("รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง"),
];

// Function to check duplicate email
const checkDuplicateEmail = async (email) => {
  try {
    const query = `SELECT * FROM customers WHERE email = ?`;
    const queryAsync = util.promisify(conn.query).bind(conn); // Promisify the query function
    const [rows, fields] = await queryAsync(query, [email]);
    if (!rows || rows.length === 0) {
      return false; // Email does not exist in database
    }
    return true; // Email already exists in database
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมล:", error);
    throw error; // Throw error to handle it in the calling function
  }
};
// Function to check duplicate phone number
const checkDuplicatePhone = async (phone) => {
  try {
    const query = `SELECT * FROM customers WHERE phone = ?`;
    const queryAsync = util.promisify(conn.query).bind(conn); // Promisify the query function
    const [rows, fields] = await queryAsync(query, [phone]);
    if (!rows || rows.length === 0) {
      return false; // Email does not exist in database
    }
    return true; // Email already exists in database
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบหมายเลขโทรศัพท์:", error);
    throw error; // Throw error to handle it in the calling function
  }
};

router.post("/customers", validateData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, email, phone } = req.body;
  try {
    const emailExists = await checkDuplicateEmail(email);
    if (emailExists) {
      return res.status(400).json({ error: "อีเมลนี้มีอยู่ในระบบแล้ว" });
    }
    const phoneExists = await checkDuplicatePhone(phone);
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "หมายเลขโทรศัพท์นี้มีอยู่ในระบบแล้ว" });
    }
    const sql = `INSERT INTO customers (first_name,last_name,email,phone) VALUES (?,?,?,?)`;
    conn.query(sql, [first_name, last_name, email, phone], (err, result) => {
      if (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", err);
        return res.status(500).json({ error: "พบข้อผิดพลาดในการเพิ่มข้อมูล" });
      }
      console.log("เพิ่มข้อมูลสำเร็จ:", result);
      return res.status(200).json({ message: "เพิ่มข้อมูลสำเร็จ" });
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการตรวจสอบและเพิ่มข้อมูล:", error);
    return res
      .status(500)
      .json({ error: "พบข้อผิดพลาดระหว่างการตรวจสอบและเพิ่มข้อมูล" });
  }
});

router.get("/customer/:id", async (req, res) => {
  const customerId = req.params.id; // Get the customer ID from the request parameters
  try {
    const sql = `SELECT * FROM customers WHERE id = ?`;
    const queryAsync = util.promisify(conn.query).bind(conn);
    const [rows, fields] = await queryAsync(sql, [customerId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return res.status(500).json({ error: "Error fetching customer by ID" });
  }
});

// Function to check duplicate email
const checkDuplicateEmailUpdate = async (email, id) => {
  try {
    const query = `SELECT * FROM customers WHERE email = ? AND id = ? `;
    const queryAsync = util.promisify(conn.query).bind(conn); // Promisify the query function
    const [rows, fields] = await queryAsync(query, [email, id]);
    return rows;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมล:", error);
    throw error; // Throw error to handle it in the calling function
  }
};

const checkDuplicatePhoneUpdate = async (phone, id) => {
  try {
    const query = `SELECT * FROM customers WHERE phone = ? AND id = ? `;
    const queryAsync = util.promisify(conn.query).bind(conn); // Promisify the query function
    const [rows, fields] = await queryAsync(query, [phone, id]);
    return rows;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบหมายเลขโทรศัพท์:", error);
    throw error; // Throw error to handle it in the calling function
  }
};

const checkDuplicateEmailMiddleware = async (req, res, next) => {
  const customerId = req.params.id;
  const { email } = req.body;
  try {
    const emailExists = await checkDuplicateEmail(email);
    const emailExistsUpdate = await checkDuplicateEmailUpdate(
      email,
      customerId
    );
    if (emailExists == false || emailExistsUpdate) {
      next();
    } else if (emailExists) {
      return res.status(400).json({ error: "อีเมลนี้มีอยู่ในระบบแล้ว" });
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมลซ้ำ:", error);
    return res.status(500).json({ error: "พบข้อผิดพลาดในการตรวจสอบอีเมลซ้ำ" });
  }
};

const checkDuplicatePhoneMiddleware = async (req, res, next) => {
  const customerId = req.params.id;
  const { phone } = req.body;
  try {
    const phoneExists = await checkDuplicatePhone(phone);
    const phoneExistsUpdate = await checkDuplicatePhoneUpdate(
      phone,
      customerId
    );
    if (phoneExists == false || phoneExistsUpdate) {
      next();
    } else if (phoneExists) {
      return res
        .status(400)
        .json({ error: "หมายเลขโทรศัพท์นี้มีอยู่ในระบบแล้ว" });
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบหมายเลขโทรศัพท์ซ้ำ:", error);
    return res
      .status(500)
      .json({ error: "พบข้อผิดพลาดในการตรวจสอบหมายเลขโทรศัพท์ซ้ำ" });
  }
};

router.put(
  "/customer/:id",
  validateData,
  checkDuplicateEmailMiddleware,
  checkDuplicatePhoneMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const customerId = req.params.id; // รับค่า ID ของลูกค้าจาก request parameters
    const { first_name, last_name, email, phone } = req.body; // รับข้อมูลใหม่ที่จะอัปเดตจาก req.body

    try {
      // ตรวจสอบว่าลูกค้าที่ต้องการอัปเดตมีอยู่หรือไม่
      const checkCustomerSql = `SELECT * FROM customers WHERE id = ?`;
      const queryAsync = util.promisify(conn.query).bind(conn);
      const [existingRows, fields] = await queryAsync(checkCustomerSql, [
        customerId,
      ]);

      if (!existingRows || existingRows.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // สร้างคำสั่ง SQL UPDATE ข้อมูลลูกค้า
      const updateSql = `UPDATE customers SET first_name=?, last_name=?, email=?, phone=? WHERE id=?`;
      const updateResult = await queryAsync(updateSql, [
        first_name,
        last_name,
        email,
        phone,
        customerId,
      ]);

      console.log("Update Result:", updateResult); // สามารถล็อกผลลัพธ์การอัปเดตได้เพื่อตรวจสอบ

      return res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
      console.error("Error updating customer:", error);
      return res.status(500).json({ error: "Error updating customer" });
    }
  }
);

router.delete("/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const checkCustomerSql = `SELECT * FROM customers WHERE id = ?`;
    const queryAsync = util.promisify(conn.query).bind(conn);
    const [existingRows, fields] = await queryAsync(checkCustomerSql, [
      customerId,
    ]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    // สร้างคำสั่ง SQL DELETE ข้อมูลลูกค้า
    const sql = `DELETE FROM customers WHERE id=?`;
    queryAsync(sql, customerId);

    return res.status(200).json({ message: "Customer delete successfully" });
  } catch (error) {
    console.error("Error delete customer:", error);
    return res.status(500).json({ error: "Error deleteing customer" });
  }
});

module.exports = router;
