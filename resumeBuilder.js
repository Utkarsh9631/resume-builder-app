$(document).ready(function () {
    let currentStep = 0;
    const steps = $(".step");
    const stepCircles = $(".step-circle");
    
    // Initialize form data structure
    let formData = {
        personalDetails: {},
        education: {},
        workExperience: [],
        projects: [],
        skills: [],
        certifications: [],
        jobTarget: {} // Add this new property
    };
    
    // Dynamic entry counters
    let workEntryCount = 1;
    let projectEntryCount = 1;
    let certEntryCount = 1;

    // Show/hide steps
    function showStep(index) {
        steps.hide();
        $(steps[index]).fadeIn();
        stepCircles.removeClass("active");
        stepCircles.eq(index).addClass("active");
    }

    // Handle next button
    $(".next").click(function () {
        // Validate current step before proceeding
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                saveCurrentStepData();
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    // Handle previous button
    $(".prev").click(function () {
        if (currentStep > 0) {
            saveCurrentStepData();
            currentStep--;
            showStep(currentStep);
        }
    });

    // Add more entries for repeatable sections
    $(document).on("click", ".add-more", function() {
        const targetType = $(this).data("target");
        
        if (targetType === "work") {
            workEntryCount++;
            $("#workExperienceContainer").append(`
                <div class="work-entry mt-3 border-top pt-3">
                    <div class="d-flex justify-content-between">
                        <h6>Experience ${workEntryCount}</h6>
                        <button type="button" class="btn-close remove-entry" data-type="work"></button>
                    </div>
                    <input type="text" name="company_${workEntryCount}" class="form-control" placeholder="Company Name">
                    <textarea name="projectDescription_${workEntryCount}" class="form-control" placeholder="Project Description"></textarea>
                    <input type="text" name="jobRole_${workEntryCount}" class="form-control" placeholder="Job Role">
                </div>
            `);
        } else if (targetType === "project") {
            projectEntryCount++;
            $("#projectsContainer").append(`
                <div class="project-entry mt-3 border-top pt-3">
                    <div class="d-flex justify-content-between">
                        <h6>Project ${projectEntryCount}</h6>
                        <button type="button" class="btn-close remove-entry" data-type="project"></button>
                    </div>
                    <textarea name="projectDesc_${projectEntryCount}" class="form-control" placeholder="Project Description"></textarea>
                    <input type="url" name="projectUrl_${projectEntryCount}" class="form-control" placeholder="Project URL">
                </div>
            `);
        } else if (targetType === "cert") {
            certEntryCount++;
            $("#certificationsContainer").append(`
                <div class="cert-entry mt-3 border-top pt-3">
                    <div class="d-flex justify-content-between">
                        <h6>Certification ${certEntryCount}</h6>
                        <button type="button" class="btn-close remove-entry" data-type="cert"></button>
                    </div>
                    <input type="text" name="certName_${certEntryCount}" class="form-control" placeholder="Certification Name">
                    <input type="url" name="certUrl_${certEntryCount}" class="form-control" placeholder="Certification URL">
                </div>
            `);
        }
    });
    
    // Remove entry
    $(document).on("click", ".remove-entry", function() {
        $(this).closest(".work-entry, .project-entry, .cert-entry").remove();
    });

    // Update the submit function to include auth token
    $("#resumeForm").submit(async function (e) {
        e.preventDefault();
        
        // Save data from final step
        saveCurrentStepData();
        
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to submit a resume");
            window.location.href = "login.html";
            return;
        }
        
        // Show loading state
        $(".submit").prop("disabled", true).html('<span class="spinner-border spinner-border-sm"></span> Submitting...');
        
        try {
            const response = await fetch("http://localhost:5000/submit-resume", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || "Failed to submit resume");
            }
            
            // Show success message
            $(".glass-card").html(`
                <div class="text-center">
                    <h3 class="text-success">✅ Resume Submitted Successfully!</h3>
                    <p>Your resume data has been saved to our database.</p>
                    <button type="button" class="btn btn-primary" onclick="location.reload()">Create Another Resume</button>
                    <button type="button" class="btn btn-secondary" onclick="location.href='dashboard.html'">Back to Dashboard</button>
                </div>
            `);
            
        } catch (err) {
            console.error("❌ Error submitting resume:", err);
            alert("Error submitting resume: " + (err.message || "Please try again"));
            $(".submit").prop("disabled", false).html('Submit ✅');
        }
    });

    // Replace or update the validateCurrentStep function
    function validateCurrentStep() {
        let isValid = true;
        const requiredFields = $(steps[currentStep]).find("[required]");
        const urlFields = $(steps[currentStep]).find("input[type='url']");
        
        // Check required fields
        requiredFields.each(function() {
            if (!$(this).val()) {
                $(this).addClass("is-invalid");
                isValid = false;
            } else {
                $(this).removeClass("is-invalid");
            }
        });
        
        // Check URL format for non-empty URL fields
        urlFields.each(function() {
            const value = $(this).val();
            if (value && !isValidUrl(value)) {
                $(this).addClass("is-invalid");
                // Add helpful message for the user
                if (!$(this).next('.invalid-feedback').length) {
                    $(this).after('<div class="invalid-feedback">Please enter a valid URL starting with http:// or https://</div>');
                }
                isValid = false;
            } else if (value) {
                $(this).removeClass("is-invalid");
            }
        });
        
        return isValid;
    }

    // Add this helper function to validate URLs
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Save data from current step
    function saveCurrentStepData() {
        switch(currentStep) {
            case 0: // Personal Details
                formData.personalDetails = {
                    name: $("input[name='name']").val(),
                    email: $("input[name='email']").val(),
                    phone: $("input[name='phone']").val(),
                    linkedin: $("input[name='linkedin']").val(),
                    github: $("input[name='github']").val(),
                    leetcode: $("input[name='leetcode']").val()
                };
                break;
                
            case 1: // Education
                formData.education = {
                    school10: $("input[name='school10']").val(),
                    passout10: $("input[name='passout10']").val(), // This will be in YYYY-MM format
                    school12: $("input[name='school12']").val(),
                    passout12: $("input[name='passout12']").val(), // This will be in YYYY-MM format
                    college: $("input[name='college']").val(),
                    graduationYear: $("input[name='graduationYear']").val() // This will be in YYYY-MM format
                };
                break;
                
            case 2: // Work Experience
                formData.workExperience = [];
                $(".work-entry").each(function(index) {
                    const entryNum = index + 1;
                    const namePrefix = index === 0 ? "" : "_" + entryNum;
                    
                    formData.workExperience.push({
                        company: $(`input[name='company${namePrefix}']`).val(),
                        projectDescription: $(`textarea[name='projectDescription${namePrefix}']`).val(),
                        jobRole: $(`input[name='jobRole${namePrefix}']`).val()
                    });
                });
                break;
                
            case 3: // Projects
                formData.projects = [];
                $(".project-entry").each(function(index) {
                    const entryNum = index + 1;
                    const namePrefix = index === 0 ? "" : "_" + entryNum;
                    
                    formData.projects.push({
                        description: $(`textarea[name='projectDesc${namePrefix}']`).val(),
                        url: $(`input[name='projectUrl${namePrefix}']`).val()
                    });
                });
                break;
                
            case 4: // Skills
                formData.skills = $("select").val() || [];
                break;
                
            case 5: // Certifications
                formData.certifications = [];
                $(".cert-entry").each(function(index) {
                    const entryNum = index + 1;
                    const namePrefix = index === 0 ? "" : "_" + entryNum;
                    
                    formData.certifications.push({
                        name: $(`input[name='certName${namePrefix}']`).val(),
                        url: $(`input[name='certUrl${namePrefix}']`).val()
                    });
                });
                break;
                
            case 6: // Job Target (new)
                formData.jobTarget = {
                    preferredRole: $("input[name='preferredRole']").val(),
                    jobDescription: $("textarea[name='jobDescription']").val()
                };
                break;
        }
    }

    // Add this to your document ready function
    $("input[type='url']").on("focus", function() {
        if (!$(this).val()) {
            $(this).attr("placeholder", "https://...");
        }
    });
});
