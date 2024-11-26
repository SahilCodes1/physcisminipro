document.addEventListener('DOMContentLoaded', () => {
    // Initialize the graph when the DOM is fully loaded
    //calculate();
    initializeGraph();

    // Attach an event listener to the "Calculate" button
    const calculateButton = document.querySelector('button');
    calculateButton.addEventListener('click', updateGraph);
    calculateButton.addEventListener('click', calculate);
});

function calculate() {
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const gravity = parseFloat(document.getElementById('gravity').value);

    if (isNaN(velocity) || isNaN(angle) || isNaN(gravity) || velocity <= 0 || gravity <= 0) {
        alert("Please enter valid positive numbers for velocity, angle, and gravity.");
        return;
    }

    const angleRad = (angle * Math.PI) / 180;

    const timeOfFlight = (2 * velocity * Math.sin(angleRad)) / gravity;
    const maxHeight = (Math.pow(velocity * Math.sin(angleRad), 2)) / (2 * gravity);
    const range = (Math.pow(velocity, 2) * Math.sin(2 * angleRad)) / gravity;

    timeResult.textContent = `${timeOfFlight.toFixed(2)} s`;
    heightResult.textContent = `${maxHeight.toFixed(2)} m`;
    rangeResult.textContent = `${range.toFixed(2)} m`;

    console.log('Inputs:', velocity, angle, gravity);
    console.log('Results:', { timeOfFlight, maxHeight, range });
}

// Global variable for the chart instance
let chart;

// Function to calculate projectile data
function calculateProjectileData(velocity, angle, gravity) {
    const radianAngle = (angle * Math.PI) / 180; // Convert degrees to radians
    const totalTime = (2 * velocity * Math.sin(radianAngle)) / gravity; // Total time of flight
    const interval = 0.1; // Time step for calculations
    const data = { x: [], y: [] };

    for (let t = 0; t <= totalTime; t += interval) {
        const x = velocity * Math.cos(radianAngle) * t; // Horizontal position
        const y = velocity * Math.sin(radianAngle) * t - 0.5 * gravity * t * t; // Vertical position
        if (y < 0) break; // Stop when the projectile hits the ground
        data.x.push(x);
        data.y.push(y);
    }

    return data;
}

// Function to initialize the chart
function initializeGraph() {
    const ctx = document.getElementById('trajectoryCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // X-axis labels (distance values)
            datasets: [{
                label: 'Projectile Path',
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
                data: [] // Data points for the trajectory
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Distance (m)' }, },
                y: { title: { display: true, text: 'Height (m)' } }
            }
        }
    });
}

// Function to update the graph with new data
function updateGraph() {
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const gravity = parseFloat(document.getElementById('gravity').value);

    if (!velocity || !angle || !gravity || velocity < 0 || angle < 0 || gravity <= 0) {
        alert('Please enter valid positive values for velocity, angle, and gravity!');
        return;
    }

    // Calculate projectile data
    const data = calculateProjectileData(velocity, angle, gravity);

    // Update chart data
    chart.data.labels = data.x; // X-axis labels
    chart.data.datasets[0].data = data.x.map((x, index) => ({ x: x, y: data.y[index] })); // X, Y pairs

    // Refresh the chart
    chart.update();
}