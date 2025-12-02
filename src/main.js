// src/main.js
import { db } from './firebaseWrapper.js';       // Firebase initialized from wrapper
import { collection, addDoc } from 'firebase/firestore';

// Get contact ID from URL
const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get('contact_id') || 'unknown';
document.getElementById('contact_id').value = contactId;

// Form elements
const form = document.getElementById('unsubscribeForm');
const statusMessage = document.getElementById('statusMessage');
const gucciSuccess = document.getElementById('gucciSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const button = form.querySelector('button');
  button.disabled = true;
  button.textContent = 'Submitting...';

  try {
    // Add unsubscribe request to Firestore
    await addDoc(collection(db, 'unsubscribeRequests'), {
      contactId: contactId,
      requestedAt: new Date().toISOString()
    });

    // Show success banner
    gucciSuccess.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show status message
    statusMessage.textContent = 'You have been successfully unsubscribed.';
    statusMessage.classList.add('show');

    // Hide the form
    form.style.display = 'none';

    // Auto-hide banner after 4 seconds
    setTimeout(() => gucciSuccess.classList.remove('show'), 4000);

  } catch (err) {
    console.error(err);
    statusMessage.textContent = 'Error processing your request.';
    statusMessage.style.color = '#e74c3c';
    statusMessage.classList.add('show');
  } finally {
    button.disabled = false;
    button.textContent = 'Unsubscribe';
  }
});

// Close banner button
document.getElementById('closeBanner').onclick = () => {
  gucciSuccess.classList.remove('show');
};
