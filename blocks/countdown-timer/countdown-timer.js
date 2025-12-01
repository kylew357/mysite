export default function decorate(block) {
  // Extract the end date from the block content
  const endDateText = block.querySelector('div')?.textContent?.trim();

  if (!endDateText) {
    block.innerHTML = '<p class="countdown-error">Please provide an end date</p>';
    return;
  }

  // Parse the end date
  const endDate = new Date(endDateText);

  if (Number.isNaN(endDate.getTime())) {
    block.innerHTML = `<p class="countdown-error">Invalid date format: ${endDateText}</p>`;
    return;
  }

  // Create countdown structure
  block.innerHTML = `
    <div class="countdown-container">
      <div class="countdown-unit">
        <div class="countdown-value" data-unit="days">0</div>
        <div class="countdown-label">Days</div>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-unit">
        <div class="countdown-value" data-unit="hours">0</div>
        <div class="countdown-label">Hours</div>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-unit">
        <div class="countdown-value" data-unit="minutes">0</div>
        <div class="countdown-label">Minutes</div>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-unit">
        <div class="countdown-value" data-unit="seconds">0</div>
        <div class="countdown-label">Seconds</div>
      </div>
    </div>
    <div class="countdown-message"></div>
  `;

  const daysEl = block.querySelector('[data-unit="days"]');
  const hoursEl = block.querySelector('[data-unit="hours"]');
  const minutesEl = block.querySelector('[data-unit="minutes"]');
  const secondsEl = block.querySelector('[data-unit="seconds"]');
  const messageEl = block.querySelector('.countdown-message');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDate.getTime() - now;

    if (distance < 0) {
      // Countdown finished
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      messageEl.textContent = 'The countdown has ended!';
      messageEl.classList.add('countdown-ended');
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  // Initial update
  updateCountdown();

  // Update every second
  const intervalId = setInterval(updateCountdown, 1000);

  // Clean up interval when block is removed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === block || node.contains(block)) {
          clearInterval(intervalId);
          observer.disconnect();
        }
      });
    });
  });

  if (block.parentNode) {
    observer.observe(block.parentNode, { childList: true, subtree: true });
  }
}
