export const TimeUtils = {
  formatTime(isoDateString) {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    date.setHours(date.getHours() + 1);
    return this.to24HourFormat(date);
  },

  formatDate(isoDateString) {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  isValidTimeRange(startDate, startTime, endDate, endTime) {
    if (!startDate || !startTime || !endDate || !endTime) {
      return {
        valid: false,
        error: 'Start and end date/time are required',
      };
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      return {
        valid: false,
        error: 'End time must be after start time',
      };
    }

    return {
      valid: true,
      error: null,
    };
  },

  to24HourFormat(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
};