const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const orgNameInput = document.getElementById('orgNameInput');
const responseOutput = document.getElementById('responseOutput');
const timerDisplay = document.getElementById('timerDisplay');

let timerInterval;
let startTime;

function startTimer() {
    // Clear any existing timer
    clearInterval(timerInterval);
    
    // Reset timer display
    timerDisplay.textContent = 'Time elapsed: 0s';
    
    // Set start time
    startTime = Date.now();
    
    // Start timer interval
    timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        if (elapsedSeconds < 60) {
            timerDisplay.textContent = `Time elapsed: ${elapsedSeconds}s`;
        } else {
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            timerDisplay.textContent = `Time elapsed: ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const file = fileInput.files[0];
    const orgName = orgNameInput.value.trim();

    if (!file) {
        responseOutput.textContent = 'Error: Please select a file.';
        return;
    }

    if (!orgName) {
        responseOutput.textContent = 'Error: Please enter an organization name.';
        return;
    }

    responseOutput.textContent = 'Processing...';
    startTimer(); // Start the timer when request begins

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://web-finder.contextqa.com/case/suggestions/requirements', { // Adjust URL if needed
            method: 'POST',
            body: formData,
            headers: {
                'Origin': `https://${orgName}.contextqa.com`,
                'Cqa-Origin': `https://${orgName}.contextqa.com`
            }
        });

        const responseData = await response.json();
        stopTimer(); // Stop the timer when response is received

        if (response.ok) {
            responseOutput.textContent = JSON.stringify(responseData, null, 2); // Pretty print JSON
        } else {
            responseOutput.textContent = `Error: ${response.status} - ${responseData.message || JSON.stringify(responseData)}`;
        }
    } catch (error) {
        stopTimer(); // Stop the timer on error
        console.error('Error submitting form:', error);
        responseOutput.textContent = `Network or client-side error: ${error.message}`;
    }
});