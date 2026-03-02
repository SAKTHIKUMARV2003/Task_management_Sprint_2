// script.js

// Using strict mode for better error handling and cleaner code
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    const taskForm = document.getElementById('taskForm');
    
    // Function to calculate and update badge color based on status
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'TODO': return 'bg-primary';
            case 'IN PROGRESS': return 'bg-warning text-dark';
            case 'REVIEW': return 'bg-info text-dark';
            case 'DONE': return 'bg-success';
            default: return 'bg-secondary';
        }
    };
    
    // Function to calculate border color based on status
    const getStatusBorderClass = (status) => {
        switch(status) {
            case 'TODO': return 'border-primary';
            case 'IN PROGRESS': return 'border-warning';
            case 'REVIEW': return 'border-info';
            case 'DONE': return 'border-success';
            default: return 'border-secondary';
        }
    };

    taskForm.addEventListener('submit', (event) => {
        // Prevent default submission
        event.preventDefault();
        event.stopPropagation();
        
        // Add 'was-validated' class to show Bootstrap validation styles
        taskForm.classList.add('was-validated');
        
        // Check if the form is valid using HTML5 constraint validation API
        if (taskForm.checkValidity()) {
            
            // Gather form data
            const taskName = document.getElementById('taskName').value;
            const description = document.getElementById('description').value;
            const assignedTo = document.getElementById('assignedTo').value;
            const dueDate = document.getElementById('dueDate').value;
            const status = document.getElementById('status').value;
            
            // Create a new task card dynamically (Optional, but good for demo)
            // For now, we will just alert success as per "Task Form Validation" requirement
            // But let's actually render it to be helpful!
            
            const taskList = document.getElementById('taskList');
            
            const badgeClass = getStatusBadgeClass(status);
            const borderClass = getStatusBorderClass(status);
            
            const newTaskHTML = `
                <div class="list-group-item list-group-item-action flex-column align-items-start border-start border-5 ${borderClass} mb-3 shadow-sm rounded">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${escapeHtml(taskName)}</h5>
                        <small class="text-muted">Due: ${escapeHtml(dueDate)}</small>
                    </div>
                    <p class="mb-1">${escapeHtml(description)}</p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div>
                            <small>Assigned to: <strong>${escapeHtml(assignedTo)}</strong></small>
                        </div>
                        <div>
                            <select class="form-select form-select-sm d-inline-block w-auto me-2 priority-select">
                                <option value="LOW" selected>LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="URGENT">URGENT</option>
                            </select>
                            <span class="badge ${badgeClass}">${escapeHtml(status)}</span>
                        </div>
                    </div>
                </div>
            `;
            
            taskList.insertAdjacentHTML('afterbegin', newTaskHTML);
            
            // Reset form
            taskForm.reset();
            taskForm.classList.remove('was-validated');
            
            // Show success message (optional)
            const alertBox = document.getElementById('formAlert');
            alertBox.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">Task added successfully!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
            
            // Auto-hide alert after 3 seconds
            setTimeout(() => {
                const alert = bootstrap.Alert.getOrCreateInstance(alertBox.querySelector('.alert'));
                if(alert) alert.close();
            }, 3000);

        } else {
            // If invalid, focus on the first invalid input
            const invalidInput = taskForm.querySelector(':invalid');
            if (invalidInput) {
                invalidInput.focus();
            }
        }
    });
    
    // Handle priority selection change
    document.getElementById('taskList').addEventListener('change', (event) => {
        if (event.target.classList.contains('priority-select')) {
            const card = event.target.closest('.list-group-item');
            if (event.target.value === 'URGENT') {
                card.classList.add('bg-danger', 'text-white');
            } else {
                card.classList.remove('bg-danger', 'text-white');
            }
        }
    });

    // Helper to prevent XSS
    function escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
