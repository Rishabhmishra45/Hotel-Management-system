export const bookingCreatedTemplate = (name, bookingId) => `
  <h2>Booking Created</h2>
  <p>Hello ${name},</p>
  <p>Your booking (${bookingId}) has been created successfully.</p>
`;

export const bookingConfirmedTemplate = (name, bookingId) => `
  <h2>Booking Confirmed 🎉</h2>
  <p>Hello ${name},</p>
  <p>Your booking (${bookingId}) is confirmed.</p>
`;
