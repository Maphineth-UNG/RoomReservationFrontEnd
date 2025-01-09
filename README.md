# Room Reservation FrontEnd

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## User Manual

### Overview
The **Room Reservation** application allows users to:
- Create and manage reservations.
- Edit or delete existing reservations.
- Log in or sign up for an account.

### Features
1. **Sign-Up**: Create an account by providing your name, email, and password.
2. **Login**: Access the platform using your registered email and password.
3. **Reservation Management**:
   - View all your reservations in a table format.
   - Add new reservations with date, time, and room details.
   - Edit or delete existing reservations.
4. **Logout**: Securely log out of your account.

### Step-by-Step Guide

#### Sign-Up
1. Click the **Sign Up** button on the login page.
2. Fill in the required details:
   - First Name
   - Last Name
   - Email
   - Password
   - Confirm Password
3. Click **Create Account** to register.
4. After successful registration, you'll be redirected to the login page.

#### Login
1. Enter your registered email and password on the login page.
2. Click the **Login** button to access your account.
3. If the login is successful, you will be redirected to the account dashboard.

#### Creating a Reservation
1. Click the **Create Reservation** button on the dashboard.
2. Fill in the following details:
   - Room Name
   - Date
   - Start Time
   - End Time
3. Click **Save** to add the reservation.
4. The new reservation will appear in the reservation table.

#### Editing a Reservation
1. Locate the reservation in the table.
2. Click the **Modify** button next to the reservation.
3. Update the required fields in the form.
4. Click **Save** to apply the changes.

#### Deleting a Reservation
1. Locate the reservation in the table.
2. Click the **Delete** button next to the reservation.
3. Confirm the deletion in the prompt.

#### Logging Out
1. Click the **Logout** button in the dashboard.
2. You will be redirected to the login page.


