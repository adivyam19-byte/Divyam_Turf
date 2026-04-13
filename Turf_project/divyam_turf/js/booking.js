// booking.js — Confirmation page

window.initConfirmPage = function() {
  const raw = localStorage.getItem('divyam_booking');
  if (!raw) {
    window.location.href = 'index.html';
    return;
  }
  const b = JSON.parse(raw);

  document.getElementById('conf-booking-id').textContent = b.bookingId;
  document.getElementById('conf-venue').textContent = b.venueName;
  document.getElementById('conf-location').textContent = b.location;
  document.getElementById('conf-date').textContent = new Date(b.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('conf-slots').textContent = b.slots.join(', ');
  document.getElementById('conf-duration').textContent = `${b.duration} hour(s)`;
  document.getElementById('conf-total').textContent = `₹${b.total.toLocaleString()}`;
};

window.downloadReceipt = function() {
  const raw = localStorage.getItem('divyam_booking');
  const b = JSON.parse(raw);
  const text = `
DIVYAM TURF BOOKING - RECEIPT
==============================
Booking ID  : ${b.bookingId}
Venue       : ${b.venueName}
Location    : ${b.location}
Date        : ${b.date}
Time Slots  : ${b.slots.join(', ')}
Duration    : ${b.duration} hour(s)
Total Paid  : ₹${b.total.toLocaleString()}
==============================
Thank you for booking with Divyam Turf!
  `.trim();
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${b.bookingId}-receipt.txt`;
  a.click();
};