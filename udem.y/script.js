let isLoggedIn = false;
let currentUser = null;
let currentRole = null;

// Simulated user database (replace with backend in production)
const users = [
  { email: "admin@example.com", password: "Admin@123", role: "admin" },
  { email: "user@example.com", password: "User@123", role: "user" },
    { email: "mahmoudbarhoom97@gmail.com", password: "Mahmoud@123", role: "admin" },
];

const courses = [
  {
    title: "تعلم البرمجة بـ Python",
    description: "كورس شامل لتعليم أساسيات البرمجة باستخدام Python.",
    image: "https://beecrowd.com/wp-content/uploads/2024/04/2022-07-19-Melhores-cursos-de-Python.jpg",
    audio: null,
    audioType: null,
    video: null,
    videoType: null
  },
  {
    title: "تصميم المواقع بـ HTML وCSS",
    description: "تعلم كيفية إنشاء مواقع ويب مذهلة باستخدام HTML وCSS.",
    image: "https://www.interviewbit.com/blog/wp-content/uploads/2021/10/HTML-and-CSS.png",
    audio: null,
    audioType: null,
    video: null,
    videoType: null
  },
  {
    title: "تصميم المواقع بـ HTML وCSS",
    description: "تعلم كيفية إنشاء مواقع ويب مذهلة باستخدام HTML وCSS.",
    image: "https://www.interviewbit.com/blog/wp-content/uploads/2021/10/HTML-and-CSS.png",
    audio: null,
    audioType: null,
    video: null,
    videoType: null
  }
];

// Password validation function
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  if (password.length < minLength) {
    return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  }
  if (!hasUpperCase) {
    return "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل";
  }
  if (!hasLowerCase) {
    return "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل";
  }
  if (!hasNumber) {
    return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  }
  if (!hasSpecialChar) {
    return "كلمة المرور يجب أن تحتوي على حرف خاص واحد على الأقل (!@#$%^&*)";
  }
  return "";
}

function updateNavbar() {
  const loginLink = document.getElementById('loginLink');
  const signupLink = document.getElementById('signupLink');
  const logoutLink = document.getElementById('logoutLink');
  const uploadLink = document.getElementById('uploadLink');
    uploadLink.style.display = currentRole === 'admin' ? 'block' : 'none';
  const adminLink = document.getElementById('adminLink');
  adminLink.style.display = currentRole === 'admin' ? 'block' : 'none';
  loginLink.style.display = isLoggedIn ? 'none' : 'block';
  signupLink.style.display = isLoggedIn ? 'none' : 'block';
  logoutLink.style.display = isLoggedIn ? 'block' : 'none';
}

function displayCourses() {
  const container = document.getElementById('coursesContainer');
  if (!container) {
    console.error("Container 'coursesContainer' not found");
    return;
  }
  container.innerHTML = '';
  courses.forEach((course, index) => {
    const courseCard = `
      <div class="col-md-4 mb-4">
        <div class="card course-card">
          <img src="${course.image}" class="card-img-top" alt="${course.title}">
          <div class="card-body">
            <h5 class="card-title">${course.title}</h5>
            <p class="card-text">${course.description}</p>
            ${course.audio ? `<audio controls src="${course.audio}" class="w-100 mb-2" type="${course.audioType}"></audio>` : ''}
            ${course.video ? `<video controls src="${course.video}" class="w-100 mb-2" type="${course.videoType}"></video>` : ''}
            <a href="#" class="btn btn-primary">عرض الكورس</a>
            ${isLoggedIn && currentRole === 'admin' ? `
              <button class="btn btn-secondary mt-2" data-bs-toggle="modal" data-bs-target="#editModal" onclick="loadCourseToEdit(${index})">تعديل</button>
              <button class="btn btn-danger mt-2" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="setDeleteCourseIndex(${index})">حذف</button>
            ` : ''}
          </div>
        </div>
      </div>`;
    container.innerHTML += courseCard;
  });
}

function displayUsers() {
  const tableBody = document.getElementById('usersTable');
  if (!tableBody) {
    console.error("Users table not found");
    return;
  }
  tableBody.innerHTML = '';
  users.forEach(user => {
    const row = `
      <tr>
        <td>${user.email}</td>
        <td>${user.role === 'admin' ? 'مسؤول' : 'مستخدم'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="changeUserRole('${user.email}')">${user.role === 'admin' ? 'تحويل إلى مستخدم' : 'تحويل إلى مسؤول'}</button>
          <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteUserModal" onclick="setDeleteUserEmail('${user.email}')">حذف</button>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

function loadCourseToEdit(index) {
  const course = courses[index];
  document.getElementById('editCourseIndex').value = index;
  document.getElementById('editCourseTitle').value = course.title;
  document.getElementById('editCourseDescription').value = course.description;
  document.getElementById('editCourseImage').value = '';
  document.getElementById('editCourseAudio').value = '';
  document.getElementById('editCourseVideo').value = '';
}

function setDeleteCourseIndex(index) {
  document.getElementById('deleteCourseIndex').value = index;
}

function setDeleteUserEmail(email) {
  document.getElementById('deleteUserEmail').value = email;
}

function changeUserRole(email) {
  if (!isLoggedIn || currentRole !== 'admin') {
    alert('يجب أن تكون مسؤولاً لتغيير الصلاحيات');
    return;
  }
  const user = users.find(u => u.email === email);
  if (user) {
    user.role = user.role === 'admin' ? 'user' : 'admin';
    alert(`تم تغيير صلاحية ${email} إلى ${user.role === 'admin' ? 'مسؤول' : 'مستخدم'}`);
    displayUsers();
  }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');
  loginError.style.display = 'none';

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    isLoggedIn = true;
    currentUser = email;
    currentRole = user.role;
    alert(`تم تسجيل الدخول بنجاح لـ ${email} (${user.role === 'admin' ? 'مسؤول' : 'مستخدم'})`);
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    updateNavbar();
    displayCourses();
    if (currentRole === 'admin') {
      document.getElementById('adminSection').style.display = 'block';
      displayUsers();
    }
  } else {
    loginError.style.display = 'block';
  }
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const signupError = document.getElementById('signupError');
  signupError.style.display = 'none';

  if (users.find(u => u.email === email)) {
    signupError.textContent = 'البريد الإلكتروني مستخدم بالفعل';
    signupError.style.display = 'block';
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    signupError.textContent = passwordError;
    signupError.style.display = 'block';
    return;
  }

  users.push({ email, password, role: 'user' });
  alert(`تم تسجيل الحساب بنجاح لـ ${email} (مستخدم)`);
  bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
  document.getElementById('signupForm').reset();
});

document.getElementById('logoutButton').addEventListener('click', function(e) {
  e.preventDefault();
  isLoggedIn = false;
  currentUser = null;
  currentRole = null;
  document.getElementById('adminSection').style.display = 'none';
  alert('تم تسجيل الخروج بنجاح');
  updateNavbar();
  displayCourses();
});

document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!isLoggedIn || currentRole !== 'admin') {
    alert('يجب أن تكون مسؤولاً لرفع كورس');
    bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
    return;
  }

  const errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'none';

  const title = document.getElementById('courseTitle').value.trim();
  const description = document.getElementById('courseDescription').value.trim();
  const image = document.getElementById('courseImage').files[0];
  const audio = document.getElementById('courseAudio').files[0];
  const video = document.getElementById('courseVideo').files[0];

  // Validate inputs
  if (!title || !description) {
    errorMessage.textContent = 'يرجى إدخال عنوان ووصف للكورس';
    errorMessage.style.display = 'block';
    return;
  }

  // Validate file types
  let isValid = true;
  if (image && !['image/png', 'image/jpeg'].includes(image.type)) {
    isValid = false;
    errorMessage.textContent = 'يرجى رفع صورة بصيغة PNG أو JPEG';
  }
  if (audio && !['audio/mpeg', 'audio/wav'].includes(audio.type)) {
    isValid = false;
    errorMessage.textContent = 'يرجى رفع ملف صوتي بصيغة MP3 أو WAV';
  }
  if (video && !['video/mp4'].includes(video.type)) {
    isValid = false;
    errorMessage.textContent = 'يرجى رفع فيديو بصيغة MP4';
  }

  if (!isValid) {
    errorMessage.style.display = 'block';
    return;
  }

  const newCourse = {
    title,
    description,
    image: image ? URL.createObjectURL(image) : 'https://via.placeholder.com/300x200',
    audio: audio ? URL.createObjectURL(audio) : null,
    audioType: audio ? audio.type : null,
    video: video ? URL.createObjectURL(video) : null,
    videoType: video ? video.type : null
  };

  courses.push(newCourse);
  displayCourses();
  alert('تم رفع الكورس بنجاح!');
  bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
  document.getElementById('uploadForm').reset();
});

document.getElementById('editForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!isLoggedIn || currentRole !== 'admin') {
    alert('يجب أن تكون مسؤولاً لتعديل الكورس');
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    return;
  }

  const errorMessage = document.getElementById('editErrorMessage');
  errorMessage.style.display = 'none';

  const index = parseInt(document.getElementById('editCourseIndex').value);
  const title = document.getElementById('editCourseTitle').value.trim();
  const description = document.getElementById('editCourseDescription').value.trim();
  const image = document.getElementById('editCourseImage').files[0];
  const audio = document.getElementById('editCourseAudio').files[0];
  const video = document.getElementById('editCourseVideo').files[0];

  // Validate inputs
  if (!title || !description) {
    errorMessage.textContent = 'يرجى إدخال عنوان ووصف للكورس';
    errorMessage.style.display = 'block';
    return;
  }

  // Validate file types
  let isValid = true;
  if (image && !['image/png', 'image/jpeg'].includes(image.type)) {
    isValid = false;
    errorMessage.textContent = 'يرجى رفع صورة بصيغة PNG أو JPEG';
  }
  if (audio && !['audio/mpeg', 'audio/wav'].includes(audio.type)) {
    isValid = false;
    errorMessage.textContent = 'يرجى رفع ملف صوتي بصيغة MP3 أو WAV';
  }
  if (video && !['video/mp4'].includes(video.type)) {
    isValid = false;
    errorMessage.textContent = 'يرجى رفع فيديو بصيغة MP4';
  }

  if (!isValid) {
    errorMessage.style.display = 'block';
    return;
  }

  const updatedCourse = {
    title,
    description,
    image: image ? URL.createObjectURL(image) : courses[index].image,
    audio: audio ? URL.createObjectURL(audio) : courses[index].audio,
    audioType: audio ? audio.type : courses[index].audioType,
    video: video ? URL.createObjectURL(video) : courses[index].video,
    videoType: video ? video.type : courses[index].videoType
  };

  courses[index] = updatedCourse;
  displayCourses();
  alert('تم تعديل الكورس بنجاح!');
  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
  document.getElementById('editForm').reset();
});

document.getElementById('confirmDeleteButton').addEventListener('click', function() {
  if (!isLoggedIn || currentRole !== 'admin') {
    alert('يجب أن تكون مسؤولاً لحذف الكورس');
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    return;
  }

  const index = parseInt(document.getElementById('deleteCourseIndex').value);
  courses.splice(index, 1);
  displayCourses();
  alert('تم حذف الكورس بنجاح!');
  bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
});

document.getElementById('confirmDeleteUserButton').addEventListener('click', function() {
  if (!isLoggedIn || currentRole !== 'admin') {
    alert('يجب أن تكون مسؤولاً لحذف المستخدم');
    bootstrap.Modal.getInstance(document.getElementById('deleteUserModal')).hide();
    return;
  }

  const email = document.getElementById('deleteUserEmail').value;
  if (email === currentUser) {
    alert('لا يمكنك حذف حسابك الخاص');
    bootstrap.Modal.getInstance(document.getElementById('deleteUserModal')).hide();
    return;
  }

  const index = users.findIndex(u => u.email === email);
  if (index !== -1) {
    users.splice(index, 1);
    displayUsers();
    alert('تم حذف المستخدم بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('deleteUserModal')).hide();
  }
});

// Initial setup
try {
  displayCourses();
  updateNavbar();
} catch (error) {
  console.error('Error initializing:', error);
}