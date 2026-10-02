import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 0, // 0: service, 1: barber, 2: date & time, 3: confirm
  selectedService: null, // { id, name, price, duration, category }
  selectedBarber: null, // { id, name }
  selectedDate: null,
  selectedTimeSlot: null,
  validationState: { isCurrentStepValid: false },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    serviceSelected(state, action) {
      state.selectedService = action.payload;
      state.validationState.isCurrentStepValid = true;
    },
    barberSelected(state, action) {
      state.selectedBarber = action.payload;
      state.selectedDate = null;
      state.selectedTimeSlot = null;
      state.validationState.isCurrentStepValid = true;
    },
    dateSelected(state, action) {
      state.selectedDate = action.payload;
      state.selectedTimeSlot = null;
      state.validationState.isCurrentStepValid = false;
    },
    timeSlotSelected(state, action) {
      state.selectedTimeSlot = action.payload;
      state.validationState.isCurrentStepValid = true;
    },
    stepAdvanced(state) {
      if (state.step < 3) state.step += 1;
      state.validationState.isCurrentStepValid = state.step === 2 ? Boolean(state.selectedTimeSlot) : true;
    },
    stepRetreated(state) {
      if (state.step > 0) state.step -= 1;
      state.validationState.isCurrentStepValid = true;
    },
    bookingReset() {
      return initialState;
    },
  },
});

export const {
  serviceSelected,
  barberSelected,
  dateSelected,
  timeSlotSelected,
  stepAdvanced,
  stepRetreated,
  bookingReset,
} = bookingSlice.actions;
export default bookingSlice.reducer;
