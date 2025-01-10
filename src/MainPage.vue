<template>
  <div class="main-container">
    <form class="form-container" @submit.prevent="login">
      <InputField label="Email" id="email" type="email" v-model="email" placeholder="Enter your email" />
      <InputField label="Password" id="password" type="password" v-model="password" placeholder="Enter your password" />
      <div class="button-group">
        <button type="submit" class="btn">Login</button>
        <button type="button" class="btn" @click="$emit('switchToSignUp')">Sign up</button>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from './InputField.vue';

export default {
  components: {
    InputField,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      this.$emit('login', this.email, this.password);
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.form-container {
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  width: 80%;
  margin: 5px 0;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #5a7dcf;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #4a69b2;
}
</style>
