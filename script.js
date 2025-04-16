const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const orgNameInput = document.getElementById('orgNameInput');
const responseOutput = document.getElementById('responseOutput');

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

        if (response.ok) {
            responseOutput.textContent = JSON.stringify(responseData, null, 2); // Pretty print JSON
        } else {
            responseOutput.textContent = `Error: ${response.status} - ${responseData.message || JSON.stringify(responseData)}`;
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        responseOutput.textContent = `Network or client-side error: ${error.message}`;
    }
});