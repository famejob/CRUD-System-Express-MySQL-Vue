<script setup>
import { reactive, onMounted } from 'vue';
import axios from "axios";
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()
const customerID = route.params.id;
const customer = reactive({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
})

const fetchData = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/customer/${customerID}`);
        customer.first_name = response.data.first_name;
        customer.last_name = response.data.last_name;
        customer.email = response.data.email;
        customer.phone = response.data.phone;
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }
}

onMounted(() => {
    fetchData();
})

</script>

<template>
    <div class="container">
        <h1 class="my-2 text-center">Customer Detail</h1>
        <div class="mt-2">
            <form @submit.prevent="Handlesubmit">
                <div class="my-2">
                    <label class="form-label">ชื่อจริง</label>
                    <input class="form-control" type="text" v-model="customer.first_name" readonly>
                </div>
                <div class="my-2">
                    <label class="form-label">นามสกุล</label>
                    <input class="form-control" type="text" v-model="customer.last_name" readonly>
                </div>
                <div class="my-2">
                    <label class="form-label">อีเมล</label>
                    <input class="form-control" type="email" v-model="customer.email" readonly>
                </div>
                <div class="my-2">
                    <label class="form-label">เบอร์โทรศัพท์</label>
                    <input class="form-control" maxlength="10" type="tel" v-model="customer.phone" readonly>
                </div>
                <div class="my-2">
                    <RouterLink :to="{ name: 'customer_list' }">
                        <button class="btn btn-dark">กลับ</button>
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>