<template>
  <div class="account-container">
    <h2>Welcome, {{ user.firstName }} {{ user.lastName }}</h2>

    <div class="reservations-section">
      <h2>My Reservations</h2>
      <button class="btn create-btn" @click="openCreateModal">Create Reservation</button>
      <table class="reservation-table">
        <thead>
          <tr>
            <th>Reservation ID</th>
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
            <td>{{ booking.id }}</td>
            <td>{{ getRoomName(booking.roomId) }}</td>
            <td>{{ formatDate(booking.startTime) }}</td>
            <td>{{ formatTime(booking.startTime) }}</td>
            <td>{{ formatDate(booking.endTime) }}</td>
            <td>{{ formatTime(booking.endTime) }}</td>
            <td>
              <button class="btn modify-btn" @click="editReservation(index)">Modify</button>
              <button class="btn delete-btn" @click="deleteReservation(booking.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="bookings.length === 0">
            <td colspan="7" class="no-data">No reservations available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Reservation Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Reservation</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label for="editRoom">Room</label>
            <select id="editRoom" v-model="editForm.roomId" required>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="editDate">Date</label>
            <input type="date" id="editDate" v-model="editForm.date" required />
          </div>
          <div class="form-group">
            <label for="editStartTime">Start Time</label>
            <select v-model="editForm.startHour" required>
              <option v-for="hour in paddedHours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
            :
            <select v-model="editForm.startMinute" required>
              <option v-for="minute in paddedMinutes" :key="minute" :value="minute">{{ minute }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editEndDate">End Date</label>
            <input type="date" id="editEndDate" v-model="editForm.endDate" required />
          </div>
          <div class="form-group">
            <label for="editEndTime">End Time</label>
            <select v-model="editForm.endHour" required>
              <option v-for="hour in paddedHours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
            :
            <select v-model="editForm.endMinute" required>
              <option v-for="minute in paddedMinutes" :key="minute" :value="minute">{{ minute }}</option>
            </select>
          </div>
          <div class="error-message" v-if="timeError">{{ timeError }}</div>
          <div class="modal-actions">
            <button type="submit" class="btn save-btn">Save</button>
            <button type="button" class="btn cancel-btn" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Reservation Modal -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h3>Create Reservation</h3>
        <form @submit.prevent="validateAndCreateReservation">
          <div class="form-group">
            <label for="createRoom">Room</label>
            <select id="createRoom" v-model="createForm.roomId" required>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="createDate">Date</label>
            <input type="date" id="createDate" v-model="createForm.date" required />
          </div>
          <div class="form-group">
            <label for="createStartTime">Start Time</label>
            <select v-model="createForm.startHour" required>
              <option v-for="hour in paddedHours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
            :
            <select v-model="createForm.startMinute" required>
              <option v-for="minute in paddedMinutes" :key="minute" :value="minute">{{ minute }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="createEndDate">End Date</label>
            <input type="date" id="createEndDate" v-model="createForm.endDate" required />
          </div>
          <div class="form-group">
            <label for="createEndTime">End Time</label>
            <select v-model="createForm.endHour" required>
              <option v-for="hour in paddedHours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
            :
            <select v-model="createForm.endMinute" required>
              <option v-for="minute in paddedMinutes" :key="minute" :value="minute">{{ minute }}</option>
            </select>
          </div>
          <div class="error-message" v-if="timeError">{{ timeError }}</div>
          <div class="modal-actions">
            <button type="submit" class="btn save-btn">Create</button>
            <button type="button" class="btn cancel-btn" @click="closeCreateModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <button class="btn logout-btn" @click="$emit('logout')">Logout</button>
  </div>
</template>

<script>
import api from './api';
import { TimeUtils } from './TimeUtils';

export default {
  props: {
    user: {
      required: true,
    },
  },
  data() {
    const now = new Date();
    const nowPlusOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      bookings: [],
      rooms: [],
      showEditModal: false,
      showCreateModal: false,
      timeError: '',
      editForm: {
        id: null,
        roomId: '',
        date: '',
        startHour: null,
        startMinute: null,
        endDate: '',
        endHour: null,
        endMinute: null,
      },
      createForm: {
        date: now.toISOString().split('T')[0],
        startHour: now.getHours(),
        startMinute: Math.floor(now.getMinutes() / 5) * 5,
        endDate: nowPlusOneHour.toISOString().split('T')[0],
        endHour: nowPlusOneHour.getHours(),
        endMinute: Math.floor(nowPlusOneHour.getMinutes() / 5) * 5,
      },
      hours: Array.from({ length: 24 }, (_, i) => i),
      minutes: Array.from({ length: 12 }, (_, i) => i * 5),
      currentBookingIndex: null,
    };
  },
  computed: {
    paddedHours() {
      return this.hours.map(hour => String(hour).padStart(2, '0'));
    },
    paddedMinutes() {
      return this.minutes.map(minute => String(minute).padStart(2, '0')); 
    },
  },
  async created() {
    try {
      const [roomsData, bookingsData] = await Promise.all([
        api.getAllRooms(),
        api.getUserBookings(this.user.id)
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

    validateAndCreateReservation() {
      this.timeError = '';

      if (!this.createForm.date || !this.createForm.endDate) {
        this.timeError = 'Both start and end dates are required';
        return;
      }

      const now = new Date();
      
      const startDateTimeStr = `${this.createForm.date}T${String(this.createForm.startHour).padStart(2, '0')}:${String(this.createForm.startMinute).padStart(2, '0')}`;
      const endDateTimeStr = `${this.createForm.endDate}T${String(this.createForm.endHour).padStart(2, '0')}:${String(this.createForm.endMinute).padStart(2, '0')}`;

      const startDateTime = new Date(startDateTimeStr);
      const endDateTime = new Date(endDateTimeStr);

      if (startDateTime < now) {
        this.timeError = 'Start time cannot be in the past. Please select a valid time.';
        return;
      }

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        this.timeError = 'Invalid date/time format';
        return;
      }

      const timeDifferenceInMs = endDateTime.getTime() - startDateTime.getTime();
      const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);

      if (timeDifferenceInHours > 4) {
        this.timeError = 'Reservations cannot exceed 4 hours';
        return;
      }

      this.createReservation();
    }
    ,

    closeEditModal() {
      this.showEditModal = false;
      this.timeError = '';
      this.editForm = {
        id: null,
        roomId: '',
        date: '',
        startHour: null,
        startMinute: null,
        endHour: null,
        endMinute: null,
      };
      this.currentBookingIndex = null;
    },

    async editReservation(index) {
      const booking = this.bookings[index];
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);

      startTime.setHours(startTime.getHours() + 1);
      endTime.setHours(endTime.getHours() + 1);

      this.editForm = {
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
      this.showEditModal = true;
    },

    async saveChanges() {
      try {
        if (!this.editForm.date || !this.editForm.endDate) {
          throw new Error('Both start and end dates are required');
        }

        const startDateTimeStr = `${this.editForm.date}T${String(this.editForm.startHour).padStart(2, '0')}:${String(this.editForm.startMinute).padStart(2, '0')}`;
        const endDateTimeStr = `${this.editForm.endDate}T${String(this.editForm.endHour).padStart(2, '0')}:${String(this.editForm.endMinute).padStart(2, '0')}`;

        const startDateTime = new Date(startDateTimeStr);
        const endDateTime = new Date(endDateTimeStr);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          throw new Error('Invalid date/time format');
        }

        const now = new Date();
        if (startDateTime < now) {
          this.timeError = 'Start time cannot be in the past. Please choose a valid time.';
          return;
        }

        if (endDateTime <= startDateTime) {
          throw new Error('End time must be after start time');
        }

        const duration = (endDateTime - startDateTime) / (1000 * 60 * 60);
        if (duration > 4) {
          throw new Error('Reservations cannot exceed 4 hours');
        }

        const payload = {
          roomId: this.editForm.roomId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          userId: this.user.id,
        };

        console.log('Payload:', payload);

        const updatedBooking = await api.updateBooking(this.editForm.id, payload);

        this.bookings[this.currentBookingIndex] = updatedBooking;
        this.closeEditModal();
        alert('Reservation updated successfully!');
      } catch (error) {
        alert('Error updating reservation: ' + error.message);
      }
    },

  async createReservation() {
    try {
      if (!this.createForm.date || !this.createForm.endDate) {
        throw new Error('Both start and end dates are required');
      }

      const startDateTimeStr = `${this.createForm.date}T${String(this.createForm.startHour).padStart(2, '0')}:${String(this.createForm.startMinute).padStart(2, '0')}`;
      const endDateTimeStr = `${this.createForm.endDate}T${String(this.createForm.endHour).padStart(2, '0')}:${String(this.createForm.endMinute).padStart(2, '0')}`;

      const startDateTime = new Date(startDateTimeStr);
      const endDateTime = new Date(endDateTimeStr);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date/time format');
      }

      const payload = {
        roomId: this.createForm.roomId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        userId: this.user.id,
      };

      console.log('Payload:', payload);

      const newBooking = await api.createBooking(payload);

      this.bookings.push(newBooking);
      this.closeCreateModal();
      alert('Reservation created successfully!');
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Error creating reservation: ' + error.message);
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

  openCreateModal() {
    const now = new Date();
    const nowPlusTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const roundedMinutes = Math.floor(now.getMinutes() / 5) * 5 + 5;

    this.createForm = {
      roomId: this.rooms[0].id, 
      date: now.toISOString().split('T')[0],
      startHour: String(now.getHours()).padStart(2, '0'),
      startMinute: String(roundedMinutes).padStart(2, '0'),
      endDate: now.toISOString().split('T')[0],
      endHour: String(nowPlusTwoHours.getHours()).padStart(2, '0'),
      endMinute: String(roundedMinutes).padStart(2, '0'),
    }; 
    
    this.showCreateModal = true;
  },

  closeCreateModal() {
    this.showCreateModal = false;
    this.timeError = '';
    this.createForm = {
      roomId: '',
      date: '',
      startHour: null,
      startMinute: null,
      endHour: null,
      endMinute: null,
    };
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: left;
}

.error-message {
  color: #dc3545;
  margin-top: 10px;
  font-size: 14px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: #5cb85c;
  color: white;
}

.save-btn:hover {
  background-color: #4cae4c;
}

.cancel-btn {
  background-color: #d9534f;
  color: white;
}

.cancel-btn:hover {
  background-color: #c9302c;
}

input[type="time"]::-webkit-datetime-edit-ampm-field {
  display: none;
}

input[type="time"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
}

input[type="text"]:invalid {
  border-color: #dc3545;
}
</style>
