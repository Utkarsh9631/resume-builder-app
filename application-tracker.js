document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load resumes for the dropdown
    loadResumes();
    
    // Load applications
    loadApplications();
    
    // Set up event listeners
    document.getElementById('saveApplicationBtn').addEventListener('click', saveApplication);
    document.getElementById('statusFilter').addEventListener('change', filterApplications);
    document.getElementById('resumeFilter').addEventListener('change', filterApplications);
    document.getElementById('searchInput').addEventListener('input', filterApplications);
    
    // Set default date to today
    document.getElementById('dateInput').valueAsDate = new Date();

    // Add click handler for modal close to reset form
    document.querySelector('#addApplicationModal .btn-close').addEventListener('click', resetApplicationForm);
    document.querySelector('#addApplicationModal .btn-secondary').addEventListener('click', resetApplicationForm);

    // Add proper event handling for modal hide
    const applicationModal = document.getElementById('addApplicationModal');
    applicationModal.addEventListener('hide.bs.modal', function() {
        // Move focus out of modal before it's hidden with aria-hidden
        document.querySelector('.container h2').focus();
    });
});

// Load user's resumes
async function loadResumes() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user-resumes`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load resumes');
        
        const resumes = await response.json();
        
        // Populate resume select in add form
        const resumeSelect = document.getElementById('resumeSelect');
        resumeSelect.innerHTML = '';
        
        // Populate resume filter
        const resumeFilter = document.getElementById('resumeFilter');
        resumeFilter.innerHTML = '<option value="">All Resumes</option>';
        
        resumes.forEach(resume => {
            const name = resume.personalDetails.name || `Resume ${resume._id.substring(0, 5)}`;
            
            // Add to form select
            const option = document.createElement('option');
            option.value = resume._id;
            option.textContent = name;
            resumeSelect.appendChild(option);
            
            // Add to filter
            const filterOption = document.createElement('option');
            filterOption.value = resume._id;
            filterOption.textContent = name;
            resumeFilter.appendChild(filterOption);
        });
        
    } catch (error) {
        console.error("Error loading resumes:", error);
    }
}

// Load applications
async function loadApplications() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load applications');
        
        const applications = await response.json();
        
        // Update dashboard counters
        updateDashboardCounters(applications);
        
        // Populate applications table
        const tableBody = document.getElementById('applicationsTable');
        
        if (applications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No applications found. Click "New Application" to add one.
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = '';
        applications.forEach(app => {
            const row = document.createElement('tr');
            
            // Apply status-based styling
            if (app.status === 'Offer' || app.status === 'Accepted') {
                row.classList.add('table-success');
            } else if (app.status === 'Rejected') {
                row.classList.add('table-danger');
            } else if (app.status === 'Interview') {
                row.classList.add('table-warning');
            }
            
            const resumeName = app.resumeId?.personalDetails?.name || 'Unknown Resume';
            const formattedDate = new Date(app.applicationDate).toLocaleDateString();
            
            // Add data attribute for resume ID
            row.dataset.resumeId = app.resumeId?._id || '';
            
            row.innerHTML = `
                <td>${app.company}</td>
                <td>${app.position}</td>
                <td>${formattedDate}</td>
                <td>${resumeName}</td>
                <td>
                    <span class="badge bg-${getStatusColor(app.status)}">${app.status}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary btn-sm" onclick="editApplication('${app._id}')">
                            Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteApplication('${app._id}')">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error("Error loading applications:", error);
        document.getElementById('applicationsTable').innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Error loading applications. Please try again.
                </td>
            </tr>
        `;
    }
}

// Save or update application
async function saveApplication() {
    try {
        const token = localStorage.getItem('token');
        const applicationId = document.getElementById('applicationIdInput').value;
        const isEditMode = applicationId !== '';
        
        const applicationData = {
            resumeId: document.getElementById('resumeSelect').value,
            company: document.getElementById('companyInput').value,
            position: document.getElementById('positionInput').value,
            applicationDate: document.getElementById('dateInput').value,
            status: document.getElementById('statusInput').value,
            applicationUrl: document.getElementById('urlInput').value,
            contactPerson: document.getElementById('contactInput').value,
            notes: document.getElementById('notesInput').value
        };
        
        let url = `${API_URL}/applications`;
        let method = 'POST';
        
        if (isEditMode) {
            url = `${API_URL}/applications/${applicationId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(applicationData)
        });
        
        if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} application`);
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('addApplicationModal')).hide();
        resetApplicationForm();
        
        // Reload applications
        loadApplications();
        
    } catch (error) {
        console.error("Error saving application:", error);
        alert(`Failed to ${isEditMode ? 'update' : 'save'} application. Please try again.`);
    }
}

// Add helper function to reset form
function resetApplicationForm() {
    document.getElementById('applicationForm').reset();
    document.getElementById('applicationIdInput').value = '';
    document.getElementById('dateInput').valueAsDate = new Date();
    document.querySelector('.modal-title').textContent = 'Add New Application';
    
    // Move focus to a safe element outside the modal before it fully closes
    setTimeout(() => {
        document.querySelector('.container h2').focus();
    }, 50);
}

// Filter applications
function filterApplications() {
    const statusFilter = document.getElementById('statusFilter').value;
    const resumeFilter = document.getElementById('resumeFilter').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    const rows = document.getElementById('applicationsTable').getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        
        if (cells.length < 5) continue; // Skip header or empty row
        
        const company = cells[0].textContent.toLowerCase();
        const position = cells[1].textContent.toLowerCase();
        const status = cells[4].textContent;
        const resumeId = row.dataset.resumeId; // Get resume ID from data attribute
        
        // Check if row matches all filters
        const matchesStatus = statusFilter === '' || status.includes(statusFilter);
        const matchesResume = resumeFilter === '' || resumeId === resumeFilter;
        const matchesSearch = searchText === '' || 
                             company.includes(searchText) || 
                             position.includes(searchText);
        
        if (matchesStatus && matchesResume && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Update dashboard counters
function updateDashboardCounters(applications) {
    const counts = {
        total: applications.length,
        interviews: 0,
        rejected: 0,
        offers: 0
    };
    
    applications.forEach(app => {
        if (app.status === 'Interview') counts.interviews++;
        if (app.status === 'Rejected') counts.rejected++;
        if (app.status === 'Offer' || app.status === 'Accepted') counts.offers++;
    });
    
    document.getElementById('totalApplications').textContent = counts.total;
    document.getElementById('totalInterviews').textContent = counts.interviews;
    document.getElementById('totalRejected').textContent = counts.rejected;
    document.getElementById('totalOffers').textContent = counts.offers;
}

// Delete application
async function deleteApplication(id) {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to delete application');
        
        // Reload applications
        loadApplications();
        
    } catch (error) {
        console.error("Error deleting application:", error);
        alert("Failed to delete application. Please try again.");
    }
}

// Helper function to get Bootstrap color class for status
function getStatusColor(status) {
    switch(status) {
        case 'Applied': return 'primary';
        case 'Interview': return 'warning';
        case 'Rejected': return 'danger';
        case 'Offer': return 'success';
        case 'Accepted': return 'info';
        default: return 'secondary';
    }
}

// Edit application
async function editApplication(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch application details');
        
        const application = await response.json();
        
        // Populate form with application data
        document.getElementById('resumeSelect').value = application.resumeId;
        document.getElementById('companyInput').value = application.company;
        document.getElementById('positionInput').value = application.position;
        document.getElementById('statusInput').value = application.status;
        document.getElementById('urlInput').value = application.applicationUrl || '';
        document.getElementById('contactInput').value = application.contactPerson || '';
        document.getElementById('notesInput').value = application.notes || '';
        
        // Format the date (YYYY-MM-DD for input date field)
        const appDate = new Date(application.applicationDate);
        const formattedDate = appDate.toISOString().split('T')[0];
        document.getElementById('dateInput').value = formattedDate;
        
        // Set hidden field for application ID
        document.getElementById('applicationIdInput').value = application._id;
        
        // Update modal title
        document.querySelector('.modal-title').textContent = 'Edit Application';
        
        // Open the modal
        new bootstrap.Modal(document.getElementById('addApplicationModal')).show();
        
    } catch (error) {
        console.error("Error fetching application details:", error);
        alert("Failed to load application details. Please try again.");
    }
}

// Add a hidden field to application form for application ID
// Then update saveApplication() to handle both create and edit