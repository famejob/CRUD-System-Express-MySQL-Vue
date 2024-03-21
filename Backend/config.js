const mysql = require("mysql");
const dbConfig = {
  host: "localhost",
  user: "root", // ชื่อผู้ใช้ MySQL
  password: "", // รหัสผ่าน MySQL
  database: "php_crud", // ชื่อฐานข้อมูลที่ต้องการเชื่อมต่อ
};
const conn = mysql.createConnection(dbConfig);
conn.connect((err) => {
  if (err) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ:", err);
    throw err;
  }

  console.log("เชื่อมต่อกับ MySQL สำเร็จ");
});

module.exports = conn;
