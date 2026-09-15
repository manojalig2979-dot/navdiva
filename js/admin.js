import { auth, db } from './firebase-init.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const loginForm = $('#loginForm');
const googleBtn = $('#googleLoginBtn');
const emailSubmitBtn = $('#emailSubmitBtn');
const gate = $('#loginGate');
const app = $('#adminApp');
const errorNotice = $('#loginError');

// Super-administrators authorized immediately
const SUPER_ADMINS = [
  'manoj.alig2979@gmail.com',
  'corporate@navdiva.com',
  'admin@navdiva.com'
];

function showNotice(msg, type = 'error') {
  if (!errorNotice) return;
  errorNotice.textContent = msg;
  errorNotice.className = `notice ${type}`;
  errorNotice.classList.remove('hidden');
}

function hideNotice() {
  if (!errorNotice) return;
  errorNotice.textContent = '';
  errorNotice.className = 'notice hidden';
}

function setBusy(isBusy, message = 'Signing in…') {
  if (emailSubmitBtn) {
    emailSubmitBtn.disabled = isBusy;
    emailSubmitBtn.textContent = isBusy ? message : 'Sign In ↗';
  }
  if (googleBtn) {
    googleBtn.disabled = isBusy;
  }
  if (isBusy) {
    showNotice(message, 'info');
  }
}

async function checkIsAdmin(user) {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();

  // 1. Super-admin direct authorization bypass
  if (SUPER_ADMINS.includes(email)) {
    // Explicitly write or sync user admin role to Firestore before reading tables
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'admin',
        name: user.displayName || 'Administrator',
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Super-admin profile auto-sync notice:', err.message);
    }
    return true;
  }

  // 2. Regular Firestore role lookup with 6-second timeout race
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Admin verification timed out. Check Firestore security rules.')), 6000)
    );
    const snap = await Promise.race([
      getDoc(doc(db, 'users', user.uid)),
      timeoutPromise
    ]);
    return snap.exists() && snap.data()?.role === 'admin';
  } catch (err) {
    console.error('Admin verification error:', err);
    throw err;
  }
}

// Google Sign-In Handler
googleBtn?.addEventListener('click', async () => {
  setBusy(true, 'Connecting to Google…');
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  } catch (err) {
    setBusy(false);
    console.error('Google sign-in error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      showNotice('Google sign-in was cancelled.', 'info');
    } else if (err.code === 'auth/unauthorized-domain') {
      showNotice('Google Sign-In: Current domain is not in Firebase Authorized Domains (Authentication > Settings).', 'error');
    } else if (err.code === 'auth/operation-not-allowed') {
      showNotice('Google Sign-In is not enabled yet in Firebase Console (Authentication > Sign-in method > Google).', 'error');
    } else if (err.code === 'auth/popup-blocked') {
      showNotice('Sign-in popup was blocked by browser. Please allow popups.', 'error');
    } else {
      showNotice(`Google Sign-In failed: ${err.message || err.code}`, 'error');
    }
  }
});

// Email/Password Form Handler
loginForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;
  if (!email || !password) return;

  setBusy(true, 'Signing in…');
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    setBusy(false);
    console.error('Email sign-in error:', err);
    let msg = 'Invalid account or password.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      msg = 'Invalid email address or password.';
    } else if (err.code === 'auth/too-many-requests') {
      msg = 'Too many attempts. Account temporarily locked; try again later.';
    } else if (err.code === 'auth/network-request-failed') {
      msg = 'Network error. Please check your internet connection.';
    } else if (err.message) {
      msg = err.message;
    }
    showNotice(msg, 'error');
  }
});

// Sign Out Handler
$('#logout')?.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
  }
});

// Refresh Records Handler
$('#refreshDataBtn')?.addEventListener('click', async () => {
  const btn = $('#refreshDataBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '🔄 Refreshing…';
  }
  try {
    if (auth.currentUser) {
      await checkIsAdmin(auth.currentUser);
    }
    await loadAll();
  } catch (err) {
    console.error('Manual refresh error:', err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🔄 Refresh Records';
    }
  }
});

// Auth State Observer
onAuthStateChanged(auth, async user => {
  if (!user) {
    setBusy(false);
    gate.classList.remove('hidden');
    app.classList.add('hidden');
    return;
  }

  showNotice('Verifying administrator privileges…', 'info');

  try {
    const isAuthorized = await checkIsAdmin(user);
    if (isAuthorized) {
      hideNotice();
      gate.classList.add('hidden');
      app.classList.remove('hidden');
      const emailLabel = $('#adminEmailLabel');
      if (emailLabel) {
        emailLabel.textContent = `${user.email} (${user.displayName || 'Administrator'})`;
      }
      loadAll();
    } else {
      await signOut(auth);
      showNotice(`Access Denied: ${user.email} is not registered as an administrator.`, 'error');
      gate.classList.remove('hidden');
      app.classList.add('hidden');
    }
  } catch (err) {
    console.error('Auth verification failed:', err);
    await signOut(auth).catch(() => {});
    showNotice(`Authentication failed: ${err.message || 'Could not verify administrator permissions.'}`, 'error');
    gate.classList.remove('hidden');
    app.classList.add('hidden');
  } finally {
    setBusy(false);
  }
});

async function loadAll() {
  await Promise.allSettled([
    loadEmployees(),
    loadApplications(),
    loadInquiries()
  ]);
}

async function loadEmployees() {
  const tb = $('#employeeRows');
  if (!tb) return;
  tb.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Loading employee records…</td></tr>';
  try {
    const snap = await getDocs(collection(db, 'employees'));
    tb.innerHTML = '';
    if (snap.empty) {
      tb.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px; opacity:0.7;">No employee records found in database. Use the form above to add your first employee record.</td></tr>';
      return;
    }
    snap.forEach(x => {
      const d = x.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(d.employeeId)}</td><td>${esc(d.name)}</td><td>${esc(d.role)}</td><td>${esc(d.unit)}</td><td><button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem; border-color: rgba(255,51,102,0.4); color: #FF3366;" data-delete="${x.id}">Delete</button></td>`;
      tb.appendChild(tr);
    });
    $$('[data-delete]').forEach(b => {
      b.onclick = async () => {
        if (confirm('Delete this employee record?')) {
          try {
            await deleteDoc(doc(db, 'employees', b.dataset.delete));
            loadEmployees();
          } catch (delErr) {
            alert(`Error deleting record: ${delErr.message}`);
          }
        }
      };
    });
  } catch (err) {
    console.error('Error loading employees:', err);
    const isPerm = err.code === 'permission-denied' || String(err.message).toLowerCase().includes('permission');
    const tip = isPerm
      ? '<div style="margin-top:8px; font-size:0.85rem; color:var(--text-secondary); max-width: 500px; margin-left:auto; margin-right:auto;">Firestore security rules denied read access to <code>employees</code>. Please ensure the rules from <code>firestore.rules</code> are deployed in Firebase Console (Firestore Database → Rules).</div>'
      : '';
    tb.innerHTML = `<tr><td colspan="5" style="padding: 24px 16px; text-align: center;">
      <div style="color: #FF3366; font-weight: 700; margin-bottom: 6px;">⚠️ Unable to fetch employee records: ${esc(err.message)}</div>
      ${tip}
      <button class="btn btn-outline" style="margin-top: 12px; padding: 6px 16px; font-size: 0.85rem;" onclick="window.navdivaAdmin?.loadEmployees()">🔄 Retry</button>
    </td></tr>`;
  }
}

async function loadApplications() {
  const tb = $('#applicationRows');
  if (!tb) return;
  tb.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Loading candidate applications…</td></tr>';
  try {
    const snap = await getDocs(query(collection(db, 'applications'), orderBy('createdAt', 'desc')));
    tb.innerHTML = '';
    if (snap.empty) {
      tb.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; opacity:0.7;">No career applications submitted yet.</td></tr>';
      return;
    }
    snap.forEach(x => {
      const d = x.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(d.name)}</td><td>${esc(d.email)}</td><td>${esc(d.role)}</td><td><span class="pill">${esc(d.status || 'new')}</span></td>`;
      tb.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading applications:', err);
    const isPerm = err.code === 'permission-denied' || String(err.message).toLowerCase().includes('permission');
    const tip = isPerm
      ? '<div style="margin-top:8px; font-size:0.85rem; color:var(--text-secondary); max-width: 500px; margin-left:auto; margin-right:auto;">Firestore security rules denied read access to <code>applications</code>.</div>'
      : '';
    tb.innerHTML = `<tr><td colspan="4" style="padding: 24px 16px; text-align: center;">
      <div style="color: #FF3366; font-weight: 700; margin-bottom: 6px;">⚠️ Unable to load candidate applications: ${esc(err.message)}</div>
      ${tip}
      <button class="btn btn-outline" style="margin-top: 12px; padding: 6px 16px; font-size: 0.85rem;" onclick="window.navdivaAdmin?.loadApplications()">🔄 Retry</button>
    </td></tr>`;
  }
}

async function loadInquiries() {
  const tb = $('#inquiryRows');
  if (!tb) return;
  tb.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Loading website enquiries…</td></tr>';
  try {
    const snap = await getDocs(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')));
    tb.innerHTML = '';
    if (snap.empty) {
      tb.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; opacity:0.7;">No enquiries submitted yet.</td></tr>';
      return;
    }
    snap.forEach(x => {
      const d = x.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(d.name)}</td><td>${esc(d.email)}</td><td>${esc(d.department)}</td><td>${esc(d.message).slice(0, 100)}</td>`;
      tb.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading inquiries:', err);
    const isPerm = err.code === 'permission-denied' || String(err.message).toLowerCase().includes('permission');
    const tip = isPerm
      ? '<div style="margin-top:8px; font-size:0.85rem; color:var(--text-secondary); max-width: 500px; margin-left:auto; margin-right:auto;">Firestore security rules denied read access to <code>inquiries</code>.</div>'
      : '';
    tb.innerHTML = `<tr><td colspan="4" style="padding: 24px 16px; text-align: center;">
      <div style="color: #FF3366; font-weight: 700; margin-bottom: 6px;">⚠️ Unable to load enquiries: ${esc(err.message)}</div>
      ${tip}
      <button class="btn btn-outline" style="margin-top: 12px; padding: 6px 16px; font-size: 0.85rem;" onclick="window.navdivaAdmin?.loadInquiries()">🔄 Retry</button>
    </td></tr>`;
  }
}

// Add Employee Form Handler
$('#employeeForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
  const originalText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';
  }
  const fd = new FormData(form);
  try {
    await addDoc(collection(db, 'employees'), {
      employeeId: fd.get('employeeId'),
      name: fd.get('name'),
      role: fd.get('role'),
      unit: fd.get('unit'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      createdAt: serverTimestamp()
    });
    form.reset();
    loadEmployees();
  } catch (err) {
    alert(`Could not save employee: ${err.message}`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
});

// Admin Tab Switching
$$('[data-tab]').forEach(b => {
  b.onclick = () => {
    $$('[data-tab]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $$('[data-view]').forEach(x => x.classList.add('hidden'));
    $(`[data-view="${b.dataset.tab}"]`)?.classList.remove('hidden');
  };
});

function esc(v = '') {
  return String(v).replace(/[&<>'"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[c]));
}

// Expose admin reload helper on window
window.navdivaAdmin = {
  loadEmployees,
  loadApplications,
  loadInquiries,
  loadAll
};
