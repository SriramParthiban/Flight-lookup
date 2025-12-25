document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('flightInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');

    function search() {
        const query = input.value.trim();
        if (!query) return;

        // Loading State
        const originalBtnText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<span class="loader">...</span>';
        searchBtn.disabled = true;

        // Clear previous
        resultsContainer.innerHTML = '';

        fetch(`/api/flights?flightNumber=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    renderNoResults();
                } else {
                    renderResults(data);
                }
            })
            .catch(err => {
                console.error(err);
                resultsContainer.innerHTML = '<div class="no-results">Error fetching flights. Please try again.</div>';
            })
            .finally(() => {
                searchBtn.innerHTML = originalBtnText;
                searchBtn.disabled = false;
            });
    }

    function renderResults(flights) {
        flights.forEach(flight => {
            const statusClass = `status-${flight.status.toLowerCase().replace(' ', '-')}`;

            const card = document.createElement('div');
            card.className = 'glass-panel flight-card';

            card.innerHTML = `
                <div class="card-header">
                    <span class="flight-num">${flight.flightNumber}</span>
                    <span class="status-badge ${statusClass}">${flight.status}</span>
                </div>
                
                <div class="route-display">
                    <div class="location">
                        <span class="location-code">${flight.startLocation}</span>
                        <div class="location-time">${flight.startTime}</div>
                    </div>
                    
                    <div class="route-line">
                        <span class="plane-icon">✈</span>
                    </div>
                    
                    <div class="location">
                        <span class="location-code">${flight.endLocation}</span>
                        <div class="location-time">${flight.endTime}</div>
                    </div>
                </div>
                
                <div class="flight-details">
                    <div class="detail-item">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${flight.duration}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Departs</span>
                        <span class="detail-value">${flight.timeZoneStart}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Arrives</span>
                        <span class="detail-value">${flight.timeZoneEnd}</span>
                    </div>
                </div>
            `;

            resultsContainer.appendChild(card);
        });
    }

    function renderNoResults() {
        const msg = document.createElement('div');
        msg.className = 'no-results';
        msg.innerHTML = `
            <p>No flights found for <strong>"${input.value}"</strong></p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7">Try "AA123" or "UA456"</p>
        `;
        resultsContainer.appendChild(msg);
    }

    // Event Listeners
    searchBtn.addEventListener('click', search);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search();
    });
});
