<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import axios from "axios";
import $ from 'jquery';
import 'datatables.net'; // Import DataTables CSS
import 'datatables.net-bs5';
const customers = ref([]);
const router = useRouter();
onMounted(async () => {
    fetchData(); // เรียกใช้งานเมื่อโหลดหน้าเสร็จสมบูรณ์
});

const fetchData = async () => {
    const response = await axios.get(`http://localhost:8080/customers`);
    customers.value = response.data;
    initDataTable();
};

const deleteCustomer = async (customerID) => {
    const confirmDelete = confirm('คุณต้องการลบข้อมูลลูกค้านี้หรือไม่?');
    if (confirmDelete) {
        await axios.delete(`http://localhost:8080/customer/${customerID}`);
        fetchData(); // หลังจากลบข้อมูลเสร็จสิ้น ทำการดึงข้อมูลใหม่เพื่ออัปเดตตาราง
    }
}

const editCustomer = (customerID) => {
    router.push({ name: 'customer_edit', params: { id: customerID } });
}

const viewCustomer = (customerID) => {
    router.push({ name: 'customer_detail', params: { id: customerID } });
}

const initDataTable = () => {
    $(document).ready(function () {
        $('#customerTable').DataTable(); // กำหนด DataTables สำหรับตารางของคุณ
    });
}
</script>

<template>
    <div class="container">
        <h1 class="text-center mt-4">Customer List</h1>
        <div class="d-flex justify-content-end mt-4">
            <RouterLink :to="{ name: 'customer_add' }">
                <button class="btn btn-success">เพิ่มลูกค้า</button>
            </RouterLink>
        </div>
        <table class="table mt-4" id="customerTable">
            <thead>
                <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>อีเมล</th>
                    <th>เบอร์โทร</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(customer, index) in customers" :key="customer.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ customer.first_name }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>
                        <button @click="editCustomer(customer.id)" class="btn btn-warning">แก้ไขข้อมูล</button>
                        <button @click="viewCustomer(customer.id)" class="btn btn-info ms-3">ดูข้อมูล</button>
                        <button @click="deleteCustomer(customer.id)" class="btn btn-danger ms-3">ลบข้อมูล</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
