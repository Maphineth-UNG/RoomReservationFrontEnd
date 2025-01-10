<template>
  <div class="modal">
    <div class="modal-content">
      <h3>{{ mode === 'create' ? 'Create Reservation' : 'Edit Reservation' }}</h3>
      <form @submit.prevent="handleSubmit">
        <!-- Room Selection -->
        <div class="form-group">
          <label for="room">Room</label>
          <select id="room" v-model="localForm.roomId" required>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>

        <!-- Start Date and Time -->
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input type="date" id="startDate" v-model="localForm.date" required />
        </div>
        <div class="form-group">
          <label for="startTime">Start Time</label>
          <select v-model="localForm.startHour" required>
            <option v-for="hour in paddedHours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          :
          <select v-model="localForm.startMinute" required>
            <option v-for="minute in paddedMinutes" :key="minute" :value="minute">{{ minute }}</option>
          </select>
        </div>

        <!-- End Date and Time -->
        <div class="form-group">
          <label for="endDate">End Date</label>
          <input type="date" id="endDate" v-model="localForm.endDate" required />
        </div>
        <div class="form-group">
          <label for="endTime">End Time</label>
          <select v-model="localForm.endHour" required>
            <option v-for="hour in paddedHours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          :
          <select v-model="localForm.endMinute" required>
            <option v-for="minute in paddedMinutes" :key="minute" :value="minute">{{ minute }}</option>
          </select>
        </div>

        <!-- Error Message -->
        <div class="error-message" v-if="timeError">{{ timeError }}</div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="submit" class="btn save-btn">{{ mode === 'create' ? 'Create' : 'Save' }}</button>
          <button type="button" class="btn cancel-btn" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String, // 'create' or 'edit'
      required: true,
    },
    rooms: {
      type: Array,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    timeError: {
      type: String,
      default: '',
    },
    timeError: {
      type: String,
      default: '',
    },
  },
  emits: ['update:timeError', 'save', 'close'],
  data() {
    const now = new Date();
    const nowPlusTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return {
      localForm: { ...this.form }, 
      paddedHours: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
      paddedMinutes: Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')),
      now,
      nowPlusTwoHours,
    };
  },
  mounted() {
    if (this.mode === 'create') {
      this.localForm = {
        roomId: this.rooms.length > 0 ? this.rooms[0].id : '',
        date: this.now.toISOString().split('T')[0], 
        startHour: String(this.now.getHours()).padStart(2, '0'),
        startMinute: String(Math.ceil(this.now.getMinutes() / 5) * 5).padStart(2, '0'), 
        endDate: this.now.toISOString().split('T')[0], 
        endHour: String(this.nowPlusTwoHours.getHours()).padStart(2, '0'),
        endMinute: String(Math.ceil(this.nowPlusTwoHours.getMinutes() / 5) * 5).padStart(2, '0'),
      };
    } else if (this.mode === 'edit') {
      const startTime = new Date(this.form.date + 'T' + this.form.startHour + ':' + this.form.startMinute);
      const endTime = new Date(this.form.endDate + 'T' + this.form.endHour + ':' + this.form.endMinute);

      startTime.setHours(startTime.getHours() + 1);
      endTime.setHours(endTime.getHours() + 1);

      this.localForm = {
        roomId: this.form.roomId,
        date: startTime.toISOString().split('T')[0],
        startHour: String(startTime.getHours()).padStart(2, '0'),
        startMinute: String(startTime.getMinutes()).padStart(2, '0'),
        endDate: endTime.toISOString().split('T')[0],
        endHour: String(endTime.getHours()).padStart(2, '0'),
        endMinute: String(endTime.getMinutes()).padStart(2, '0'),
      };
    }
  },
  watch: {
    form: {
      handler(newForm) {
        if (this.mode === 'edit') {
          this.localForm = { ...newForm };
        }
      },
      deep: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('update:timeError', ''); 
      
      const startDateTimeStr = `${this.localForm.date}T${this.localForm.startHour}:${this.localForm.startMinute}`;
      const endDateTimeStr = `${this.localForm.endDate}T${this.localForm.endHour}:${this.localForm.endMinute}`;

      const startDateTime = new Date(startDateTimeStr);
      const endDateTime = new Date(endDateTimeStr);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        this.$emit('update:timeError', 'Invalid date/time format');
        return;
      }

      const now = new Date();
      if (startDateTime < now) {
        this.$emit('update:timeError', 'Start time cannot be in the past.');
        return;
      }

      if (this.localForm.date === this.localForm.endDate) {
        const startHourInt = parseInt(this.localForm.startHour);
        const endHourInt = parseInt(this.localForm.endHour);

        if (startHourInt > endHourInt) {
          this.$emit('update:timeError', 'For bookings crossing midnight, please select the next day as the end date.');
          return;
        }
      }

      const startTimestamp = startDateTime.getTime();
      const endTimestamp = endDateTime.getTime();

      if (endTimestamp <= startTimestamp) {
        this.$emit('update:timeError', 'End time must be after start time.');
        return;
      }

      const duration = (endDateTime - startDateTime) / (1000 * 60 * 60);
      if (duration > 4) {
        this.$emit('update:timeError', 'Reservations cannot exceed 4 hours.');
        return;
      }

      this.$emit('save', {
        roomId: this.localForm.roomId,
        date: this.localForm.date,
        startHour: this.localForm.startHour,
        startMinute: this.localForm.startMinute,
        endDate: this.localForm.endDate,
        endHour: this.localForm.endHour,
        endMinute: this.localForm.endMinute,
      });
    },
  },
};
</script>

<style scoped>
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

.modal-content h3 {
  font-weight: bold;
  text-align: center;
  padding-bottom: 20px;
  margin: 0;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: left;
}

.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
}

.btn {
  margin: 15px 10px;
  padding: 10px 30px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn {
  background-color: #5cb85c;
  color: white;
}

.cancel-btn {
  background-color: #d9534f;
  color: white;
}

.error-message {
  color: #dc3545;
  margin-top: 10px;
  font-size: 14px;
}
</style>
