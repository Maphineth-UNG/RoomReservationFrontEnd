<template>
  <div class="account-container">
    <h2>Welcome, {{ user.firstName }} {{ user.lastName }}</h2>

    <div class="reservations-section">
      <h2>My Reservations</h2>
      <button class="btn create-btn" @click="openModal('create')">Create Reservation</button>
      <table class="reservation-table">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Start Date</th>
            <th>Start Time</th>
            <th>End Date</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="booking.id">
            <td>{{ getRoomName(booking.roomId) }}</td>
            <td>{{ formatDate(booking.startTime) }}</td>
            <td>{{ formatTime(booking.startTime) }}</td>
            <td>{{ formatDate(booking.endTime) }}</td>
            <td>{{ formatTime(booking.endTime) }}</td>
            <td>
              <button class="btn modify-btn" @click="openModal('edit', index)">Modify</button>
              <button class="btn delete-btn" @click="deleteReservation(booking.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="bookings.length === 0">
            <td colspan="6" class="no-data">No reservations available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ReservationModal v-if="showModal" :mode="modalMode" :rooms="rooms" :form="form" :time-error="timeError"
      @save="handleSave" @close="closeModal" />
    <button class="btn logout-btn" @click="$emit('logout')">Logout</button>
  </div>
</template>


<script>
import ReservationModal from './ReservationModal.vue'; // Reusable modal
import api from './api';
import { TimeUtils } from './TimeUtils';

export default {
  components: { ReservationModal },
  props: {
    user: { required: true },
  },
  data() {
    const now = new Date();
    const nowPlusOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      bookings: [],
      rooms: [],
      showModal: false,
      modalMode: 'create', // 'create' or 'edit'
      currentBookingIndex: null,
      timeError: '',
      form: {
        roomId: '',
        date: now.toISOString().split('T')[0],
        startHour: now.getHours(),
        startMinute: Math.floor(now.getMinutes() / 5) * 5,
        endDate: nowPlusOneHour.toISOString().split('T')[0],
        endHour: nowPlusOneHour.getHours(),
        endMinute: Math.floor(nowPlusOneHour.getMinutes() / 5) * 5,
      },
      hours: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
      minutes: Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')),
    };
  },
  async created() {
    try {
      const [roomsData, bookingsData] = await Promise.all([
        api.getAllRooms(),
        api.getUserBookings(this.user.id),
      ]);
      this.rooms = roomsData;
      this.bookings = bookingsData;
    } catch (error) {
      alert('Error loading data: ' + error.message);
    }
  },
  methods: {
    getRoomName(roomId) {
      const room = this.rooms.find(r => r.id === roomId);
      return room ? room.name : 'Unknown Room';
    },
    formatDate(date) {
      return TimeUtils.formatDate(date);
    },
    formatTime(time) {
      return TimeUtils.formatTime(time);
    },
    openModal(mode, index = null) {
      this.modalMode = mode;
      this.showModal = true;

      if (mode === 'edit' && index !== null) {
        const booking = this.bookings[index];
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);

        this.form = {
          id: booking.id,
          roomId: booking.roomId,
          date: startTime.toISOString().split('T')[0],
          startHour: String(startTime.getHours()).padStart(2, '0'),
          startMinute: String(startTime.getMinutes()).padStart(2, '0'),
          endDate: endTime.toISOString().split('T')[0],
          endHour: String(endTime.getHours()).padStart(2, '0'),
          endMinute: String(endTime.getMinutes()).padStart(2, '0'),
        };
        this.currentBookingIndex = index;
      }
    },
    closeModal() {
      this.showModal = false;
      this.timeError = '';
      this.form = {
        roomId: this.rooms[0]?.id || '',
        date: '',
        startHour: null,
        startMinute: null,
        endDate: '',
        endHour: null,
        endMinute: null,
      };
    },
    async handleSave(data) {
      try {
        const startDateTimeStr = `${data.date}T${String(data.startHour).padStart(2, '0')}:${String(data.startMinute).padStart(2, '0')}`;
        const endDateTimeStr = `${data.endDate}T${String(data.endHour).padStart(2, '0')}:${String(data.endMinute).padStart(2, '0')}`;

        const startDateTime = new Date(startDateTimeStr);
        const endDateTime = new Date(endDateTimeStr);

        const payload = {
          roomId: data.roomId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          userId: this.user.id,
        };

        if (this.modalMode === 'create') {
          const newBooking = await api.createBooking(payload);
          this.bookings.push(newBooking);
          alert('Reservation created successfully!');
        } else if (this.modalMode === 'edit') {
          const updatedBooking = await api.updateBooking(this.form.id, payload);
          if (this.currentBookingIndex !== null) {
            this.bookings[this.currentBookingIndex] = updatedBooking;
          }
          alert('Reservation updated successfully!');
        }
        this.closeModal();
      } catch (error) {
        alert('Error saving reservation: ' + error.message);
      }
    },
    async deleteReservation(bookingId) {
      if (confirm('Are you sure you want to delete this reservation?')) {
        try {
          await api.deleteBooking(bookingId);
          this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
          alert('Reservation deleted successfully!');
        } catch (error) {
          alert('Error deleting reservation: ' + error.message);
        }
      }
    },
  },
};
</script>



<style scoped>
.account-container {
  text-align: center;
  margin: 20px;
}

.reservations-section {
  margin-top: 20px;
}

.reservation-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
}

.reservation-table th,
.reservation-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.reservation-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: #888;
}

.btn {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modify-btn {
  background-color: #5a7dcf;
  color: white;
}

.modify-btn:hover {
  background-color: #4a69b2;
}

.delete-btn {
  background-color: #d9534f;
  color: white;
}

.delete-btn:hover {
  background-color: #c9302c;
}

.logout-btn {
  margin-top: 20px;
  background-color: #5a7dcf;
  color: white;
}

.logout-btn:hover {
  background-color: #4a69b2;
}

.create-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px 0;
  display: inline-block;
}

.error-message {
  color: #dc3545;
  margin-top: 10px;
  font-size: 14px;
}
</style>
