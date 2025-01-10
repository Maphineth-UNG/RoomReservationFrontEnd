<template>
  <div class="signup-container">
    <form class="form-container" @submit.prevent="createAccount">
      <InputField label="First name" id="firstName" type="text" v-model="firstName"
        placeholder="Enter your first name" />
      <InputField label="Last name" id="lastName" type="text" v-model="lastName" placeholder="Enter your last name" />
      <InputField label="Email" id="email" type="email" v-model="email" placeholder="Enter your email" />
      <InputField label="Password" id="password" type="password" v-model="password" placeholder="Password" />
      <InputField label="Confirm Password" id="confirmPassword" type="password" v-model="confirmPassword"
        placeholder="Confirm Password" />
      <div class="button-group">
        <button type="submit" class="btn create-account">Create account</button>
        <button type="button" class="btn back-btn" @click="$emit('switchToMain')">Back</button>
      </div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import InputField from './InputField.vue';

export default {
  components: { InputField },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    validateFields() {
      if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
        return 'All fields are required.';
      }
      return null;
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        return 'Please enter a valid email address.';
      }
      return null;
    },
    validatePasswords() {
      if (this.password !== this.confirmPassword) {
        return 'Passwords do not match.';
      }
      return null;
    },
    createAccount() {
      this.errorMessage = this.validateFields() || this.validateEmail() || this.validatePasswords();

      if (!this.errorMessage) {
        this.$emit('createAccount', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        });
      }
    },
  }

};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa; /* Light gray background */
}

.form-container {
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for a clean look */
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

input::placeholder {
  color: #aaa; /* Placeholder color */
}

.btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 20px;
  /* Rounded corners */
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  /* Smooth hover effect */
}

/* Individual button styles */
.btn.back-btn {
  background-color: #d9534f;
  /* Red for back button */
}

.btn.back-btn:hover {
  background-color: #c9302c;
  /* Darker red on hover */
}

.btn.create-account {
  background-color: #5a7dcf;
  /* Blue button background */
}

.btn.create-account:hover {
  background-color: #4a69b2;
  /* Darker blue on hover */
}

.error-message {
  margin-top: 10px;
  color: red;
  text-align: center;
  font-size: 14px;
}
</style>
