// Flag to check if user has saved their progress
let isSaved = true;
let currentFolder = null;

// Warn user before they close or reload the page
window.addEventListener('beforeunload', function (event) {
    if (!isSaved) {
        const message = 'You have unsaved changes. Do you want to save before exiting?';
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
    }
});

// Mark as unsaved when changes are made
function markAsUnsaved() {
    isSaved = false;
}

// Create a new folder
function createFolder() {
    const folderName = document.getElementById('folderName').value;
    if (folderName.trim() === '') return;

    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';
    folderDiv.textContent = folderName;
    folderDiv.onclick = function() {
        openFolder(folderName);
    };

    document.getElementById('foldersContainer').appendChild(folderDiv);
    document.getElementById('folderName').value = '';
}

// Open an existing folder
function openFolder(folderName) {
    currentFolder = folderName;
    document.getElementById('taskContainer').style.display = 'block';
    loadTasks();
}

// Generate circles based on the number of questions
function generateCircles() {
    if (!currentFolder) {
        alert('Please select a folder first.');
        return;
    }

    const container = document.getElementById('circleContainer');
    container.innerHTML = ''; // Clear existing circles
    const numQuestions = document.getElementById('numQuestions').value;

    // Save number of questions and initialize completion status
    localStorage.setItem(currentFolder, JSON.stringify({
        numQuestions: numQuestions,
        completed: Array(numQuestions).fill(false)
    }));

    // Generate circles
    for (let i = 1; i <= numQuestions; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.textContent = i;
        circle.onclick = function() {
            toggleCompletion(i);
        };
        container.appendChild(circle);
    }

    markAsUnsaved(); // Mark as unsaved when circles are generated
}

// Toggle the completion status of a circle
function toggleCompletion(index) {
    if (!currentFolder) return;

    const taskData = JSON.parse(localStorage.getItem(currentFolder));
    if (!taskData) return;

    taskData.completed[index - 1] = !taskData.completed[index - 1];
    localStorage.setItem(currentFolder, JSON.stringify(taskData));
    updateCircles();

    markAsUnsaved(); // Mark as unsaved when a circle is toggled
}

// Update the appearance of circles based on their completion status
function updateCircles() {
    const container = document.getElementById('circleContainer');
    const taskData = JSON.parse(localStorage.getItem(currentFolder));
    if (!taskData) return;

    Array.from(container.children).forEach((circle, index) => {
        if (taskData.completed[index]) {
            circle.classList.add('completed');
        } else {
            circle.classList.remove('completed');
        }
    });
}

// Load tasks for the selected folder from local storage
function loadTasks() {
    const taskData = JSON.parse(localStorage.getItem(currentFolder));
    if (!taskData) return;

    document.getElementById('numQuestions').value = taskData.numQuestions;
    generateCircles(); // Regenerate circles based on saved data
    updateCircles(); // Update circle styles based on completion status
}

// Optional: Save the progress manually
function saveProgress() {
    isSaved = true; // Mark as saved
    alert('Progress saved.');
}
