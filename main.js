/* ================= DOM REFERENCES ================= */
const form = document.getElementById('resume-form');

const nameInput = document.getElementById('name');
const dobInput = document.getElementById('start');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('number');
const nationalityInput = document.getElementById('nationality');
const educationInput = document.getElementById('education');
const skillsInput = document.getElementById('skills');
const experienceInput = document.getElementById('experience');
const photoInput = document.getElementById('photoInput');

const overlay = document.getElementById('overlay');
const resumePopup = document.getElementById('resumePopup');
const closePopup = document.getElementById('closePopup');

/* Resume preview fields */
const rpName = document.getElementById('rp-name');
const rpRole = document.getElementById('rp-role');
const rpPhone = document.getElementById('rp-phone');
const rpEmail = document.getElementById('rp-email');
const rpDob = document.getElementById('rp-dob');
const rpNationality = document.getElementById('rp-nationality');
const rpSkills = document.getElementById('rp-skills');
const rpEducation = document.getElementById('rp-education');
const rpExperience = document.getElementById('rp-experience');
const rpSummary = document.getElementById('rp-summary');

/* Profile image */
const profilePreview = document.getElementById('profilePreview');
const photoPlaceholder = document.getElementById('photoPlaceholder');

/* ================= UTILITIES ================= */

// Date formatter
function formatDateISOToReadable(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d)
    ? ''
    : d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
}

// Escape HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/* ================= RENDER FUNCTIONS ================= */

function renderSkills(skillsStr) {
  rpSkills.innerHTML = '';

  const skills = skillsStr
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!skills.length) {
    rpSkills.innerHTML = `<span class="skill-pill">No skills</span>`;
    return;
  }

  skills.forEach(skill => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.textContent = skill;
    rpSkills.appendChild(pill);
  });
}

function renderEducation(text) {
  rpEducation.innerHTML = '';

  text.split('\n').filter(Boolean).forEach(line => {
    const div = document.createElement('div');
    div.className = 'edu-item';
    div.innerHTML = escapeHtml(line);
    rpEducation.appendChild(div);
  });
}

function renderExperience(text) {
  rpExperience.innerHTML = '';

  text.split('\n').filter(Boolean).forEach(line => {
    const div = document.createElement('div');
    div.className = 'exp-item';
    div.innerHTML = escapeHtml(line);
    rpExperience.appendChild(div);
  });
}

/* ================= POPULATE RESUME ================= */

function populateResume(data) {
  rpName.textContent = data.name || 'Full Name';
  rpRole.textContent = data.role || 'Frontend Developer';
  rpPhone.textContent = data.phone;
  rpEmail.textContent = data.email;
  rpDob.textContent = data.dob;
  rpNationality.textContent = data.nationality;

  renderSkills(data.skills);
  renderEducation(data.education);
  renderExperience(data.experience);

  rpSummary.textContent =
    `Motivated ${rpRole.textContent} with strong skills in ${data.skills
      .split(',')
      .slice(0, 4)
      .join(', ')}.`;
}

/* ================= PROFILE PHOTO ================= */

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePreview.src = reader.result;
    profilePreview.style.display = 'block';
    photoPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

/* ================= POPUP CONTROL ================= */

function showPopup() {
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hidePopup() {
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

/* ================= FORM SUBMIT ================= */

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    name: nameInput.value.trim(),
    role: 'Frontend Developer',
    dob: formatDateISOToReadable(dobInput.value),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    nationality: nationalityInput.value.trim(),
    education: educationInput.value.trim(),
    skills: skillsInput.value.trim(),
    experience: experienceInput.value.trim()
  };

  populateResume(data);
  showPopup();
});

/* ================= EVENTS ================= */

closePopup.addEventListener('click', hidePopup);

overlay.addEventListener('click', e => {
  if (e.target === overlay) hidePopup();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) {
    hidePopup();
  }
});

/* ================= PDF DOWNLOAD ================= */

document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  const clone = resumePopup.cloneNode(true);

  const actions = clone.querySelector('.popup-actions');
  if (actions) actions.remove();

  clone.style.maxWidth = '820px';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  html2pdf()
    .set({
      margin: 10,
      filename: `${rpName.textContent.replaceAll(' ', '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(clone)
    .save()
    .then(() => wrapper.remove());
});
