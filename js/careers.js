// Careers Page - Interactive Filtering & Modal Management

document.addEventListener('DOMContentLoaded', () => {
  initJobFilters();
  initApplyModal();
});

// Job filtering logic
function initJobFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const jobCards = document.querySelectorAll('.job-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      jobCards.forEach(card => {
        const cardUnit = card.getAttribute('data-unit');
        
        if (filterValue === 'all' || cardUnit === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Modal handling logic
function initApplyModal() {
  const modal = document.getElementById('applyModal');
  const openBtns = document.querySelectorAll('.apply-trigger-btn');
  const closeBtn = document.getElementById('closeModalBtn');
  const jobInput = document.getElementById('appliedJob');
  const form = document.getElementById('jobApplicationForm');

  if (!modal || !closeBtn || !form) return;

  // Open modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const jobName = btn.getAttribute('data-job');
      jobInput.value = jobName;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    });
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable page scrolling
    form.reset();
  };

  closeBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const applicationData = {
      id: Date.now(),
      job: jobInput.value,
      name: document.getElementById('applicantName').value,
      email: document.getElementById('applicantEmail').value,
      phone: document.getElementById('applicantPhone').value,
      resume: document.getElementById('resumeLink').value,
      coverLetter: document.getElementById('coverLetter').value,
      date: new Date().toLocaleDateString()
    };

    // Save submission to localStorage for demo data availability
    let currentSubmissions = [];
    try {
      currentSubmissions = JSON.parse(localStorage.getItem('navdiva_job_applications')) || [];
    } catch(err) {
      currentSubmissions = [];
    }
    
    currentSubmissions.push(applicationData);
    localStorage.setItem('navdiva_job_applications', JSON.stringify(currentSubmissions));

    // Show success dialog
    alert(`Thank you, ${applicationData.name}! Your application for "${applicationData.job}" has been recorded successfully.`);
    closeModal();
  });
}
