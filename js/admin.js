// Admin Panel - Document Generation & Live Preview Engine

document.addEventListener('DOMContentLoaded', () => {
  initLoginSystem();
});

function initLoginSystem() {
  const loginOverlay = document.getElementById('adminLoginOverlay');
  const loginForm = document.getElementById('adminLoginForm');
  const loginError = document.getElementById('loginError');

  if (!loginOverlay) {
      initDocumentGenerator();
      return;
  }

  // Check if already authenticated in session
  if (sessionStorage.getItem('navdiva_admin_auth') === 'true') {
    loginOverlay.style.display = 'none';
    initDocumentGenerator();
    return;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pwd = document.getElementById('adminPassword').value;

    if (email === 'admin@navdiva.com' && pwd === 'Msrknsds@0304') {
      sessionStorage.setItem('navdiva_admin_auth', 'true');
      loginOverlay.style.opacity = '0';
      setTimeout(() => {
        loginOverlay.style.display = 'none';
        initDocumentGenerator();
      }, 500);
    } else {
      loginError.style.display = 'block';
      setTimeout(() => loginError.style.display = 'none', 3000);
    }
  });
}

const DOCUMENT_TEMPLATES = {
  'Salary Slip': {
    title: 'SALARY SLIP',
    refPrefix: 'NDG/2026/PAY-',
    inputs: [
      { id: 'empName', label: 'Employee Name', type: 'text', default: 'Aarav Sharma' },
      { id: 'empId', label: 'Employee ID', type: 'text', default: 'NDG-1042' },
      { id: 'payMonth', label: 'Salary Month', type: 'text', default: 'June 2026' },
      { id: 'basicPay', label: 'Basic Salary (₹)', type: 'text', default: '45000' },
      { id: 'hra', label: 'HRA (₹)', type: 'text', default: '15000' },
      { id: 'deductions', label: 'Deductions (PF/Tax) (₹)', type: 'text', default: '5000' }
    ],
    generateBody: (data) => {
      const basic = parseInt(data.basicPay) || 0;
      const hra = parseInt(data.hra) || 0;
      const deductions = parseInt(data.deductions) || 0;
      const net = basic + hra - deductions;
      return `
        <p>This is the official statement of earnings and deductions for <strong>${data.empName || '[Employee Name]'}</strong> (ID: ${data.empId || '[Employee ID]'}) for the month of <strong>${data.payMonth || '[Month]'}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="background: rgba(0,0,0,0.05);">
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Earnings</th>
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">Amount (₹)</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Basic Salary</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">${basic.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">House Rent Allowance</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">${hra.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #ef4444;">Less: Deductions</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right; color: #ef4444;">-${deductions.toLocaleString()}</td>
          </tr>
          <tr style="background: rgba(0,0,0,0.05); font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Net Payable</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">${net.toLocaleString()}</td>
          </tr>
        </table>
        <p>This is a computer-generated document and does not require a signature.</p>
      `;
    }
  },
  'Offer Letter': {
    title: 'LETTER OF OFFER',
    refPrefix: 'NDG/2026/OFF-',
    inputs: [
      { id: 'candName', label: 'Candidate Name', type: 'text', default: 'Aarav Sharma' },
      { id: 'candJob', label: 'Job Position', type: 'text', default: 'Senior Software Engineer' },
      { id: 'candUnit', label: 'Operating Unit', type: 'select', default: 'NDTechHub', options: ['NDTechHub', 'NDMART', 'Rameshta'] },
      { id: 'candSal', label: 'Annual Compensation', type: 'text', default: '₹14,50,000 Per Annum' },
      { id: 'candDate', label: 'Joining Date', type: 'date', default: '2026-07-15' },
      { id: 'candMgr', label: 'Reporting Manager', type: 'text', default: 'Rakhi Kushwaha, MD and CO-FOUNDER' }
    ],
    generateBody: (data) => {
      const formattedDate = data.candDate ? formatDateString(data.candDate) : '[Joining Date]';
      return `
        <p>Dear <strong>${data.candName || '[Candidate Name]'}</strong>,</p>
        <p>We are pleased to offer you the position of <strong>${data.candJob || '[Job Position]'}</strong> with <strong>${data.candUnit || '[Operating Unit]'}</strong>, a primary operating subsidiary of Navdiva Group Pvt Ltd. This letter outlines the principal terms and conditions of your employment offer.</p>
        <p>Your annual gross compensation package will be <strong>${data.candSal || '[Annual Compensation]'}</strong>, inclusive of all benefits, allowances, and statutory requirements, subject to standard local tax deductions. Your scheduled date of joining is <strong>${formattedDate}</strong>, and you will report directly to <strong>${data.candMgr || '[Reporting Manager]'}</strong> at our corporate hub in Delhi, India.</p>
        <p>By accepting this offer of employment, you agree to abide by the company guidelines, professional regulations, non-disclosure protocols, and intellectual property conditions. Please confirm your acceptance by signing below and returning a scanned copy on or before June 30, 2026.</p>
        <p>We look forward to welcoming you to the Navdiva family and collaborating to build state-of-the-art products.</p>
      `;
    }
  },
  'Appointment Letter': {
    title: 'APPOINTMENT LETTER',
    refPrefix: 'NDG/2026/APP-',
    inputs: [
      { id: 'candName', label: 'Employee Name', type: 'text', default: 'Karan Patel' },
      { id: 'candJob', label: 'Designation', type: 'text', default: 'Lead UI Developer' },
      { id: 'candDate', label: 'Effective Date', type: 'date', default: '2026-07-01' }
    ],
    generateBody: (data) => {
      const formattedDate = data.candDate ? formatDateString(data.candDate) : '[Effective Date]';
      return `
        <p>Dear <strong>${data.candName || '[Employee Name]'}</strong>,</p>
        <p>Following your acceptance of our offer and the successful completion of your onboarding procedures, we are pleased to confirm your formal appointment to the position of <strong>${data.candJob || '[Designation]'}</strong> with Navdiva Group Pvt Ltd, effective <strong>${formattedDate}</strong>.</p>
        <p>Your employment will be governed by the company's code of conduct and standard policies, which are subject to change from time to time. You will be on a probationary period for the first 3 months of your service, after which your employment will be confirmed subject to satisfactory performance.</p>
        <p>We trust that your knowledge, skills, and experience will be among our most valuable assets. Welcome aboard!</p>
      `;
    }
  },
  'Joining Letter': {
    title: 'JOINING CONFIRMATION LETTER',
    refPrefix: 'NDG/2026/JOIN-',
    inputs: [
      { id: 'candName', label: 'Employee Name', type: 'text', default: 'Priya Verma' },
      { id: 'candJob', label: 'Designation', type: 'text', default: 'Marketing Specialist' },
      { id: 'joinDate', label: 'Date of Joining', type: 'date', default: '2026-06-21' }
    ],
    generateBody: (data) => {
      const formattedDate = data.joinDate ? formatDateString(data.joinDate) : '[Date of Joining]';
      return `
        <p>To Human Resources,</p>
        <p>This is to formally confirm that I, <strong>${data.candName || '[Employee Name]'}</strong>, have reported for duty on <strong>${formattedDate}</strong> and have formally assumed the responsibilities of <strong>${data.candJob || '[Designation]'}</strong> at Navdiva Group Pvt Ltd.</p>
        <p>I confirm that I have submitted all required educational credentials, employment records, and identity proofs as requested during the onboarding process. I am committed to abiding by the corporate policies and contributing effectively to the organization.</p>
        <p>Please process my details for payroll and administrative records.</p>
      `;
    }
  },
  'Internship Certificate': {
    title: 'INTERNSHIP CERTIFICATE',
    refPrefix: 'NDG/2026/INT-',
    inputs: [
      { id: 'internName', label: 'Intern Name', type: 'text', default: 'Rahul Roy' },
      { id: 'internDept', label: 'Department', type: 'text', default: 'Web Development' },
      { id: 'startDate', label: 'Start Date', type: 'date', default: '2026-01-01' },
      { id: 'endDate', label: 'End Date', type: 'date', default: '2026-06-01' }
    ],
    generateBody: (data) => {
      const start = data.startDate ? formatDateString(data.startDate) : '[Start Date]';
      const end = data.endDate ? formatDateString(data.endDate) : '[End Date]';
      return `
        <p style="text-align: center; font-weight: bold; margin-bottom: 24px;">TO WHOMSOEVER IT MAY CONCERN</p>
        <p>This is to certify that <strong>${data.internName || '[Intern Name]'}</strong> has successfully completed their internship in the <strong>${data.internDept || '[Department]'}</strong> department at Navdiva Group Pvt Ltd.</p>
        <p>Their internship tenure was from <strong>${start}</strong> to <strong>${end}</strong>. During this period, they demonstrated excellent learning agility, worked on various live projects, and contributed positively to the team's objectives.</p>
        <p>We found them to be sincere, hardworking, and dedicated. We wish them all the best in their future academic and professional endeavors.</p>
      `;
    }
  },
  'Relieving Letter': {
    title: 'EXPERIENCE & RELIEVING CERTIFICATE',
    refPrefix: 'NDG/2026/EXP-',
    inputs: [
      { id: 'empName', label: 'Employee Name', type: 'text', default: 'Karan Patel' },
      { id: 'empJob', label: 'Designation Held', type: 'text', default: 'Lead UI Developer' },
      { id: 'empUnit', label: 'Operating Unit', type: 'select', default: 'NDMART', options: ['NDTechHub', 'NDMART', 'Rameshta'] },
      { id: 'empStart', label: 'Employment Start Date', type: 'date', default: '2024-03-15' },
      { id: 'empEnd', label: 'Employment End Date', type: 'date', default: '2026-05-31' }
    ],
    generateBody: (data) => {
      const formattedStart = data.empStart ? formatDateString(data.empStart) : '[Start Date]';
      const formattedEnd = data.empEnd ? formatDateString(data.empEnd) : '[End Date]';
      return `
        <p style="text-align: center; font-weight: bold; margin-bottom: 24px;">TO WHOMSOEVER IT MAY CONCERN</p>
        <p>This is to certify that <strong>${data.empName || '[Employee Name]'}</strong> was employed with <strong>${data.empUnit || '[Operating Unit]'}</strong>, a unit of Navdiva Group Pvt Ltd, from <strong>${formattedStart}</strong> to <strong>${formattedEnd}</strong>. During their tenure, they served with distinction in the capacity of <strong>${data.empJob || '[Designation Held]'}</strong>.</p>
        <p>Throughout their period of service, <strong>${data.empName || '[Employee Name]'}</strong> demonstrated dedication, diligence, and professional responsibility. Their technical efforts significantly contributed to optimization and development of our commercial infrastructures.</p>
        <p>We have accepted their voluntary resignation and hereby relieve them of all active duties and assignments, effective close of business hours on <strong>${formattedEnd}</strong>. We confirm that their accounts have been fully settled, and we wish them success and prosperity in their future endeavors.</p>
      `;
    }
  },
  'General Notice': {
    title: 'CORPORATE ANNOUNCEMENT / NOTICE',
    refPrefix: 'NDG/2026/NOT-',
    inputs: [
      { id: 'noticeSub', label: 'Notice Subject', type: 'text', default: 'Annual Holiday Declaration' },
      { id: 'noticeAudience', label: 'Target Audience', type: 'text', default: 'All Employees' },
      { id: 'noticeContent', label: 'Notice Body', type: 'text', default: 'The corporate office will remain closed on Friday for festival celebrations.' }
    ],
    generateBody: (data) => {
      return `
        <p><strong>To:</strong> ${data.noticeAudience || '[Target Audience]'}</p>
        <p><strong>Subject:</strong> ${data.noticeSub || '[Notice Subject]'}</p>
        <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;">
        <p>${data.noticeContent || '[Notice Body]'}</p>
        <br>
        <p>For any queries, please contact the HR Helpdesk.</p>
        <p>By Order of Management,<br>Navdiva Group Pvt Ltd.</p>
      `;
    }
  },
  'Employee ID Card': {
    title: 'TEMPORARY EMPLOYEE IDENTIFICATION',
    refPrefix: 'NDG/2026/ID-',
    inputs: [
      { id: 'empName', label: 'Employee Name', type: 'text', default: 'Sunita Mehra' },
      { id: 'empId', label: 'Employee ID', type: 'text', default: 'NDG-2051' },
      { id: 'empRole', label: 'Role', type: 'text', default: 'HR Executive' },
      { id: 'empBlood', label: 'Blood Group', type: 'select', default: 'O+', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] }
    ],
    generateBody: (data) => {
      return `
        <div style="width: 250px; margin: 0 auto; border: 2px solid #1e293b; border-radius: 12px; overflow: hidden; font-family: sans-serif; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <div style="background: #4f46e5; color: #fff; padding: 15px 10px;">
            <div style="font-weight: 900; font-size: 18px; letter-spacing: 1px;">NAVDIVA GROUP</div>
          </div>
          <div style="padding: 20px;">
            <div style="width: 80px; height: 80px; background: #e2e8f0; border-radius: 50%; margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #94a3b8;">
              👤
            </div>
            <h3 style="margin: 0 0 5px 0; color: #1e293b; font-size: 18px;">${data.empName || 'Employee Name'}</h3>
            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 13px;">${data.empRole || 'Role'}</p>
            <div style="text-align: left; background: #f8fafc; padding: 10px; border-radius: 8px; font-size: 12px; color: #334155;">
              <strong>ID:</strong> ${data.empId || 'NDG-XXXX'}<br>
              <strong>Blood Group:</strong> ${data.empBlood || 'O+'}
            </div>
          </div>
        </div>
      `;
    }
  }
};

function initDocumentGenerator() {
  const select = document.getElementById('docTypeSelect');
  const formFieldsContainer = document.getElementById('dynamicFormFields');
  const printBtn = document.getElementById('printBtn');
  const autofillBtn = document.getElementById('autofillBtn');

  if (!select || !formFieldsContainer) return;

  let currentDocType = select.value;
  let formValues = {};
  let currentRefNumber = Math.floor(1000 + Math.random() * 9000); // Random reference index

  // Trigger form setup on change
  select.addEventListener('change', (e) => {
    currentDocType = e.target.value;
    setupFormFields();
  });

  // Autofill button hook
  autofillBtn.addEventListener('click', () => {
    const templateInputs = DOCUMENT_TEMPLATES[currentDocType].inputs;
    templateInputs.forEach(input => {
      const el = document.getElementById(input.id);
      if (el) {
        el.value = input.default;
        formValues[input.id] = input.default;
      }
    });
    updateDocumentPreview();
  });

  // Print button hook
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // PDF Generation hook
  const generatePdfBtn = document.getElementById('generatePdfBtn');
  if (generatePdfBtn) {
    generatePdfBtn.addEventListener('click', () => {
      const element = document.getElementById('printPane');
      const opt = {
        margin:       0,
        filename:     `${DOCUMENT_TEMPLATES[currentDocType].title.replace(/\s+/g, '_')}_${currentRefNumber}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      const originalText = generatePdfBtn.innerHTML;
      generatePdfBtn.innerText = 'Generating...';
      html2pdf().set(opt).from(element).save().then(() => {
        generatePdfBtn.innerHTML = originalText;
      });
    });
  }

  // Generate input fields inside sidebar
  function setupFormFields() {
    formFieldsContainer.innerHTML = '';
    formValues = {};
    
    const template = DOCUMENT_TEMPLATES[currentDocType];
    
    // Set Document Reference ID
    const refId = template.refPrefix + currentRefNumber;
    document.getElementById('docRefId').innerText = `NDG-REF: ${refId}`;
    document.getElementById('previewRef').innerText = refId;
    document.getElementById('previewDate').innerText = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('previewTitle').innerText = template.title;

    template.inputs.forEach(field => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.innerText = field.label;

      let inputEl;
      if (field.type === 'select') {
        inputEl = document.createElement('select');
        field.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.innerText = opt;
          inputEl.appendChild(option);
        });
      } else {
        inputEl = document.createElement('input');
        inputEl.type = field.type;
        inputEl.placeholder = `e.g. ${field.default}`;
      }

      inputEl.id = field.id;
      // Initialize with default value
      inputEl.value = field.default;
      formValues[field.id] = field.default;

      // Handle real-time preview updates on input/change
      const updateHandler = (e) => {
        formValues[field.id] = e.target.value;
        updateDocumentPreview();
      };
      
      inputEl.addEventListener('input', updateHandler);
      inputEl.addEventListener('change', updateHandler);

      formGroup.appendChild(label);
      formGroup.appendChild(inputEl);
      formFieldsContainer.appendChild(formGroup);
    });

    updateDocumentPreview();
  }

  // Render variables to document template body
  function updateDocumentPreview() {
    const template = DOCUMENT_TEMPLATES[currentDocType];
    const previewBody = document.getElementById('previewBody');
    const candSigBlock = document.getElementById('candidateSigBlock');
    const previewCandidateName = document.getElementById('previewCandidateName');

    if (!previewBody) return;

    // Render HTML content
    previewBody.innerHTML = template.generateBody(formValues);

    // Dynamic signature blocks adjustments
    const docsWithSignature = ['Offer Letter', 'Appointment Letter', 'Joining Letter'];
    if (docsWithSignature.includes(currentDocType)) {
      candSigBlock.style.display = 'flex';
      previewCandidateName.innerText = formValues.candName || 'Aarav Sharma';
    } else {
      candSigBlock.style.display = 'none';
    }
  }

  // Initial load
  setupFormFields();

  // Expose prefill helper globally for quick document generation from Employee Directory
  window.prefillDocForEmployee = function(emp, docType = 'Salary Slip') {
    const select = document.getElementById('docTypeSelect');
    if (select) {
      select.value = docType;
      currentDocType = docType;
      setupFormFields();
      
      // Prefill fields dynamically based on mapping
      const fieldMap = {
        'empName': emp.name,
        'candName': emp.name,
        'internName': emp.name,
        'empId': emp.id,
        'candJob': emp.role,
        'empJob': emp.role,
        'candUnit': emp.unit,
        'empUnit': emp.unit,
        'basicPay': Math.round((emp.salary || 50000) * 0.6),
        'hra': Math.round((emp.salary || 50000) * 0.3),
        'deductions': Math.round((emp.salary || 50000) * 0.1),
        'candSal': `₹${((emp.salary || 50000) * 12).toLocaleString()} Per Annum`,
        'empBlood': emp.blood || 'O+',
        'empRole': emp.role
      };

      Object.keys(fieldMap).forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl && fieldMap[id] !== undefined) {
          inputEl.value = fieldMap[id];
          formValues[id] = fieldMap[id];
        }
      });

      updateDocumentPreview();
    }
  };
}

// Global Tab Switcher Function
function switchAdminTab(tab) {
  const docView = document.getElementById('documentGeneratorView');
  const empView = document.getElementById('employeeDirectoryView');
  const tabDocGen = document.getElementById('tabDocGen');
  const tabEmpDir = document.getElementById('tabEmpDir');

  if (tab === 'docGen') {
    docView.classList.remove('hidden');
    empView.classList.add('hidden');
    tabDocGen.classList.add('active');
    tabEmpDir.classList.remove('active');
  } else if (tab === 'empDir') {
    docView.classList.add('hidden');
    empView.classList.remove('hidden');
    tabDocGen.classList.remove('active');
    tabEmpDir.classList.add('active');
    renderEmployeeDirectory();
  }
}

/* ==========================================================================
   EMPLOYEE DIRECTORY & RECORDS MANAGEMENT (CRUD + LocalStorage)
   ========================================================================== */

const INITIAL_EMPLOYEES = [
  {
    id: 'NDG-1001',
    name: 'Manoj Singh',
    role: 'Founder & CEO',
    unit: 'Navdiva Group HQ',
    email: 'manoj.singh@navdiva.com',
    phone: '+91 98100 12345',
    joinDate: '2022-01-01',
    salary: 150000,
    status: 'Active',
    blood: 'O+'
  },
  {
    id: 'NDG-1002',
    name: 'Rakhi Kushwaha',
    role: 'MD & Co-Founder',
    unit: 'Navdiva Group HQ',
    email: 'rakhi.kushwaha@navdiva.com',
    phone: '+91 98100 54321',
    joinDate: '2022-01-01',
    salary: 150000,
    status: 'Active',
    blood: 'A+'
  },
  {
    id: 'NDG-1042',
    name: 'Aarav Sharma',
    role: 'Senior Software Engineer',
    unit: 'NDTechHub',
    email: 'aarav.sharma@ndtechhub.com',
    phone: '+91 99887 76655',
    joinDate: '2024-03-15',
    salary: 60000,
    status: 'Active',
    blood: 'B+'
  },
  {
    id: 'NDG-1043',
    name: 'Sunita Mehra',
    role: 'HR Executive',
    unit: 'Navdiva Group HQ',
    email: 'sunita.m@navdiva.com',
    phone: '+91 98765 12340',
    joinDate: '2024-05-10',
    salary: 45000,
    status: 'Active',
    blood: 'O+'
  },
  {
    id: 'NDG-1044',
    name: 'Karan Patel',
    role: 'Lead UI Developer',
    unit: 'NDMART',
    email: 'karan.p@ndmart.store',
    phone: '+91 97112 33445',
    joinDate: '2024-03-15',
    salary: 65000,
    status: 'Active',
    blood: 'AB+'
  },
  {
    id: 'NDG-1045',
    name: 'Priya Verma',
    role: 'Marketing Specialist',
    unit: 'Rameshta',
    email: 'priya.v@rameshta.online',
    phone: '+91 98991 12233',
    joinDate: '2025-02-01',
    salary: 42000,
    status: 'Active',
    blood: 'A+'
  }
];

function getStoredEmployees() {
  const data = localStorage.getItem('navdiva_employees');
  if (!data) {
    localStorage.setItem('navdiva_employees', JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_EMPLOYEES;
  }
}

function saveStoredEmployees(employees) {
  localStorage.setItem('navdiva_employees', JSON.stringify(employees));
}

function renderEmployeeDirectory() {
  const grid = document.getElementById('employeeGrid');
  if (!grid) return;

  const employees = getStoredEmployees();
  const searchVal = (document.getElementById('empSearchInput')?.value || '').toLowerCase().trim();
  const unitFilter = document.getElementById('empUnitFilter')?.value || 'ALL';
  const statusFilter = document.getElementById('empStatusFilter')?.value || 'ALL';

  // Update KPI Stats
  const totalEmp = employees.length;
  const activeEmp = employees.filter(e => e.status === 'Active').length;
  const totalPayroll = employees.reduce((sum, e) => sum + (parseInt(e.salary) || 0), 0);

  const statTotalEl = document.getElementById('statTotalEmp');
  const statActiveEl = document.getElementById('statActiveEmp');
  const statPayrollEl = document.getElementById('statTotalPayroll');

  if (statTotalEl) statTotalEl.innerText = totalEmp;
  if (statActiveEl) statActiveEl.innerText = activeEmp;
  if (statPayrollEl) statPayrollEl.innerText = `₹${totalPayroll.toLocaleString('en-IN')}`;

  // Filter List
  const filtered = employees.filter(emp => {
    const matchesSearch = !searchVal || 
      emp.name.toLowerCase().includes(searchVal) ||
      emp.id.toLowerCase().includes(searchVal) ||
      emp.role.toLowerCase().includes(searchVal) ||
      emp.email.toLowerCase().includes(searchVal);

    const matchesUnit = unitFilter === 'ALL' || emp.unit === unitFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

    return matchesSearch && matchesUnit && matchesStatus;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="emp-empty-state">
        <i data-lucide="users"></i>
        <h3>No Personnel Records Found</h3>
        <p style="font-size: 14px; margin-top: 6px;">Try adjusting your search criteria or add a new employee.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map((emp) => {
    // Find index in master employees array
    const originalIndex = employees.findIndex(e => e.id === emp.id);

    // Get initials for avatar
    const initials = emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Determine unit badge class
    let unitBadgeClass = 'unit-navdivahq';
    if (emp.unit === 'NDTechHub') unitBadgeClass = 'unit-ndtechhub';
    else if (emp.unit === 'NDMART') unitBadgeClass = 'unit-ndmart';
    else if (emp.unit === 'Rameshta') unitBadgeClass = 'unit-rameshta';

    // Determine status badge class
    let statusBadgeClass = 'status-active';
    if (emp.status === 'On Leave') statusBadgeClass = 'status-leave';
    else if (emp.status === 'Former') statusBadgeClass = 'status-former';

    const formattedJoinDate = emp.joinDate ? formatDateString(emp.joinDate) : 'N/A';
    const formattedSalary = emp.salary ? `₹${parseInt(emp.salary).toLocaleString('en-IN')}/mo` : 'N/A';

    return `
      <div class="emp-card">
        <div class="emp-card-header">
          <div class="emp-avatar">${initials}</div>
          <div class="emp-header-info">
            <div class="emp-name">${escapeHtml(emp.name)}</div>
            <div class="emp-role">${escapeHtml(emp.role)}</div>
          </div>
        </div>

        <div class="emp-badges">
          <span class="badge-unit ${unitBadgeClass}">${escapeHtml(emp.unit)}</span>
          <span class="badge-status ${statusBadgeClass}">${escapeHtml(emp.status)}</span>
        </div>

        <div class="emp-details-grid">
          <div class="emp-detail-item">
            <span class="emp-detail-label">Employee ID</span>
            <span class="emp-detail-value" style="font-family: monospace;">${escapeHtml(emp.id)}</span>
          </div>
          <div class="emp-detail-item">
            <span class="emp-detail-label">Joining Date</span>
            <span class="emp-detail-value">${formattedJoinDate}</span>
          </div>
          <div class="emp-detail-item">
            <span class="emp-detail-label">Work Email</span>
            <span class="emp-detail-value">${escapeHtml(emp.email)}</span>
          </div>
          <div class="emp-detail-item">
            <span class="emp-detail-label">Monthly Salary</span>
            <span class="emp-detail-value">${formattedSalary}</span>
          </div>
        </div>

        <div class="emp-card-actions">
          <button class="btn-doc-gen" onclick="quickGenerateDoc(${originalIndex})">
            <i data-lucide="file-text" style="width: 14px; height: 14px;"></i> Doc Gen
          </button>
          <button class="btn-emp-edit" onclick="openEditEmployeeModal(${originalIndex})" title="Edit Employee">
            <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
          </button>
          <button class="btn-emp-delete" onclick="deleteEmployeeRecord(${originalIndex})" title="Delete Record">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Modal Handlers
function openAddEmployeeModal() {
  const modal = document.getElementById('employeeModal');
  const form = document.getElementById('employeeForm');
  document.getElementById('modalTitle').innerText = 'Add New Employee';
  document.getElementById('modalEmpIndex').value = '';
  form.reset();

  // Generate suggested employee ID
  const employees = getStoredEmployees();
  const nextNum = 1040 + employees.length + 1;
  document.getElementById('modalEmpId').value = `NDG-${nextNum}`;

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function openEditEmployeeModal(index) {
  const employees = getStoredEmployees();
  const emp = employees[index];
  if (!emp) return;

  const modal = document.getElementById('employeeModal');
  document.getElementById('modalTitle').innerText = 'Edit Employee Details';
  document.getElementById('modalEmpIndex').value = index;

  document.getElementById('modalEmpId').value = emp.id || '';
  document.getElementById('modalEmpName').value = emp.name || '';
  document.getElementById('modalEmpRole').value = emp.role || '';
  document.getElementById('modalEmpUnit').value = emp.unit || 'Navdiva Group HQ';
  document.getElementById('modalEmpEmail').value = emp.email || '';
  document.getElementById('modalEmpPhone').value = emp.phone || '';
  document.getElementById('modalEmpJoinDate').value = emp.joinDate || '';
  document.getElementById('modalEmpSalary').value = emp.salary || '';
  document.getElementById('modalEmpStatus').value = emp.status || 'Active';
  document.getElementById('modalEmpBlood').value = emp.blood || 'O+';

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function closeEmployeeModal() {
  const modal = document.getElementById('employeeModal');
  modal.classList.remove('active');
}

function deleteEmployeeRecord(index) {
  const employees = getStoredEmployees();
  const emp = employees[index];
  if (!emp) return;

  if (confirm(`Are you sure you want to delete personnel record for "${emp.name}" (${emp.id})?`)) {
    employees.splice(index, 1);
    saveStoredEmployees(employees);
    renderEmployeeDirectory();
  }
}

// Quick Action: Pre-fill Document Generator and switch tab
function quickGenerateDoc(index) {
  const employees = getStoredEmployees();
  const emp = employees[index];
  if (!emp) return;

  switchAdminTab('docGen');
  if (window.prefillDocForEmployee) {
    window.prefillDocForEmployee(emp, 'Salary Slip');
  }
}

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// Attach Search & Form Submit Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const empSearchInput = document.getElementById('empSearchInput');
  const empUnitFilter = document.getElementById('empUnitFilter');
  const empStatusFilter = document.getElementById('empStatusFilter');
  const employeeForm = document.getElementById('employeeForm');

  if (empSearchInput) empSearchInput.addEventListener('input', renderEmployeeDirectory);
  if (empUnitFilter) empUnitFilter.addEventListener('change', renderEmployeeDirectory);
  if (empStatusFilter) empStatusFilter.addEventListener('change', renderEmployeeDirectory);

  if (employeeForm) {
    employeeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const indexVal = document.getElementById('modalEmpIndex').value;
      const employees = getStoredEmployees();

      const newEmp = {
        id: document.getElementById('modalEmpId').value.trim(),
        name: document.getElementById('modalEmpName').value.trim(),
        role: document.getElementById('modalEmpRole').value.trim(),
        unit: document.getElementById('modalEmpUnit').value,
        email: document.getElementById('modalEmpEmail').value.trim(),
        phone: document.getElementById('modalEmpPhone').value.trim(),
        joinDate: document.getElementById('modalEmpJoinDate').value,
        salary: parseInt(document.getElementById('modalEmpSalary').value) || 0,
        status: document.getElementById('modalEmpStatus').value,
        blood: document.getElementById('modalEmpBlood').value
      };

      if (indexVal !== '') {
        // Edit existing
        employees[parseInt(indexVal)] = newEmp;
      } else {
        // Add new
        employees.push(newEmp);
      }

      saveStoredEmployees(employees);
      closeEmployeeModal();
      renderEmployeeDirectory();
    });
  }
});

// Utility to format date YYYY-MM-DD to "Month DD, YYYY"
function formatDateString(dateStr) {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

