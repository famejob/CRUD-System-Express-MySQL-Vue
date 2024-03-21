<script setup>
import { reactive } from 'vue';
import axios from "axios";
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const customer = reactive({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
})

const errors = reactive({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
});

const duplicateErrors = reactive({
    email: "",
    phone: "",
});

const validateForm = () => {
    errors.first_name = !customer.first_name.trim() ? 'กรุณากรอกชื่อ' : '';
    errors.last_name = !customer.last_name.trim() ? 'กรุณากรอกนามสกุล' : '';
    errors.email = !customer.email.trim() ? 'กรุณากรอกอีเมล' : '';
    errors.phone = !customer.phone.trim() ? 'กรุณากรอกเบอร์โทรศัพท์' : '';

    if (customer.email.trim() && !/\S+@\S+\.\S+/.test(customer.email)) {
        errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (customer.phone.trim() && !/^\+?(\d.*){3,}$/.test(customer.phone)) {
        errors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    return Object.values(errors).some(err => err !== '');
}

const checkDuplicateEmail = async () => {
    try {
        const response = await axios.post(`http://localhost:8080/email`, { email: customer.email });
        if (response.data.exists) {
            duplicateErrors.email = 'อีเมลนี้มีผู้ใช้แล้ว';
        } else {
            duplicateErrors.email = ''; // Clear error if email is not duplicate
        }
    } catch (error) {
        console.error('Error checking duplicate email:', error);
    }
};

const checkDuplicatePhone = async () => {
    try {
        const response = await axios.post(`http://localhost:8080/phone`, { phone: customer.phone });
        if (response.data.exists) {
            duplicateErrors.phone = 'เบอร์โทรนี้มีผู้ใช้แล้ว';
        } else {
            duplicateErrors.phone = ''; // Clear error if phone is not duplicate
        }
    } catch (error) {
        console.error('Error checking duplicate phone:', error);
    }
};

const handleFirstnameInput = () => {
    errors.first_name = '';
}

const handleLastnameInput = () => {
    errors.last_name = '';
}

const handleEmailInput = () => {
    errors.email = '';
    duplicateErrors.email = '';
}

const handlePhoneInput = () => {
    errors.phone = '';
    duplicateErrors.phone = '';
}
const Handlesubmit = async () => {

    if (validateForm()) {
        return; // Stop submission if there are validation errors
    }
    try {
        await checkDuplicateEmail();
        await checkDuplicatePhone();
        if (!duplicateErrors.email && !duplicateErrors.phone) {
            await axios.post(`http://localhost:8080/customers`, customer);
            router.push({ name: 'customer_list' });
        }
    } catch (error) {
        console.error('Error adding customer:', error);
    }
}
</script>

<template>
    <div class="container">
        <h1 class="my-2 text-center">Add Customer</h1>
        <div class="mt-2">
            <form @submit.prevent="Handlesubmit">
                <div class="my-2">
                    <label class="form-label">ชื่อจริง</label>
                    <input class="form-control" type="text" v-model="customer.first_name" @input="handleFirstnameInput">
                    <div v-if="errors.first_name" class="text-danger">{{ errors.first_name }}</div>
                </div>
                <div class="my-2">
                    <label class="form-label">นามสกุล</label>
                    <input class="form-control" type="text" v-model="customer.last_name" @input="handleLastnameInput">
                    <div v-if="errors.last_name" class="text-danger">{{ errors.last_name }}</div>
                </div>
                <div class="my-2">
                    <label class="form-label">อีเมล</label>
                    <input class="form-control" type="email" v-model="customer.email" @input="handleEmailInput">
                    <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                    <div v-if="duplicateErrors.email" class="text-danger">{{ duplicateErrors.email }}</div>
                </div>
                <div class="my-2">
                    <label class="form-label">เบอร์โทรศัพท์</label>
                    <input class="form-control" maxlength="10" type="tel" v-model="customer.phone"
                        @input="handlePhoneInput">
                    <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
                    <div v-if="duplicateErrors.phone" class="text-danger">{{ duplicateErrors.phone }}</div>
                </div>
                <div class="my-2">
                    <button class="btn btn-success">เพิ่ม</button>
                    <RouterLink :to="{ name: 'customer_list' }">
                        <button class="btn btn-dark ms-2">กลับ</button>
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>