<template>
  <div>
    <MainPage
      v-if="currentPage === 'main'"
      @switchToSignUp="showSignUpPage"
      @login="handleLogin"
    />
    <SignUpPage
      v-if="currentPage === 'signup'"
      @switchToMain="showMainPage"
      @createAccount="handleCreateAccount"
    />
    <AccountPage
      v-if="currentPage === 'account'"
      :user="loggedInUser"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import MainPage from './MainPage.vue';
import SignUpPage from './SignUpPage.vue';
import AccountPage from './AccountPage.vue';
import api from './api';

export default {
  data() {
    return {
      currentPage: 'main',
      loggedInUser: null,
    };
  },
  components: {
    MainPage,
    SignUpPage,
    AccountPage,
  },
  methods: {
    switchPage(pageName) {
      this.currentPage = pageName;
    },
    async handleError(callback) {
      try {
        await callback();
      } catch (error) {
        alert(error.message || 'An error occurred.');
      }
    },
    showSignUpPage() {
      this.switchPage('signup');
    },
    showMainPage() {
      this.switchPage('main');
    },
    async handleCreateAccount(accountDetails) {
      this.handleError(async () => {
        await api.createUser(accountDetails);
        alert('Account created successfully! You can now log in.');
        this.switchPage('main');
      });
    },
    async handleLogin(email, password) {
      this.handleError(async () => {
        const user = await api.login(email, password);
        this.loggedInUser = user;
        this.switchPage('account');
      });
    },
    handleLogout() {
      this.loggedInUser = null;
      this.switchPage('main');
    },
  },
};
</script>
