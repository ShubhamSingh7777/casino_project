function randomBlinkCasinoCards() {
    const cards = document.querySelectorAll('.casino-list-item');
    if (!cards.length) return;

    // Random count: 1, 2, or 4
    const blinkCounts = [1, 2, 4];
    const count = blinkCounts[Math.floor(Math.random() * blinkCounts.length)];

    // Shuffle cards
    const shuffled = Array.from(cards).sort(() => 0.5 - Math.random());

    // Pick random cards
    const selectedCards = shuffled.slice(0, count);

    selectedCards.forEach(card => {
        card.classList.add('casino-blink');

        // Remove class after animation
        setTimeout(() => {
            card.classList.remove('casino-blink');
        }, 1600);
    });
}

// Run randomly every 2–5 seconds
setInterval(() => {
    if (Math.random() > 0.4) { // "sometimes"
        randomBlinkCasinoCards();
    }
}, Math.random() * 3000 + 2000);