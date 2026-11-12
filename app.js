/**
 * ==============================================================================
 * CarX Car Rental Agency Management System - Enterprise Vanilla Architecture
 * Pure Vanilla ES6+ JavaScript (Zero Frameworks, Zero Build Pipeline)
 * Persistence: localStorage (Main Database) & sessionStorage (Active Session Cache)
 * ==============================================================================
 */

// Global State
let currentRole = 'customer'; // 'customer' | 'agency'
let currentUser = null;
let currentDraftBooking = null;
let simulatedRemainingHours = null; // for time-based refund testing simulator
let uploadedDocDataUrl = null;

// ==============================================================================
// 1. DATABASE INITIAL SEED & CACHE MEMORY MANAGEMENT
// ==============================================================================

const INITIAL_AGENCIES = [
  {
    id: 'agency_apex',
    name: 'Apex Velocity Rentals',
    hub: 'Downtown Metro Hub (Bay 4)',
    phone: '+91 98230 11223',
    email: 'apex@carx.com',
    rating: 4.8,
    totalReviews: 24,
    totalRevenue: 5420
  },
  {
    id: 'agency_royal',
    name: 'Royal Wheels Luxury Hub',
    hub: 'Airport International Terminal Zone',
    phone: '+91 98450 33445',
    email: 'royal@carx.com',
    rating: 4.9,
    totalReviews: 38,
    totalRevenue: 12850
  },
  {
    id: 'agency_metro',
    name: 'MetroDrive Fleet Services',
    hub: 'Central Express Transit Station',
    phone: '+91 98900 55667',
    email: 'metro@carx.com',
    rating: 4.7,
    totalReviews: 19,
    totalRevenue: 4380
  }
];

const INITIAL_VEHICLES = [
  {
    id: 'veh_01',
    model: 'Hyundai Creta SX (O)',
    rcNo: 'DL-01-AB-1024',
    category: 'SUV',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    dailyRate: 55,
    rating: 4.8,
    reviewCount: 14,
    status: 'Booked', // sample active booking exists
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Refined compact SUV with panoramic sunroof, ventilated seating, and class-leading safety suite.'
  },
  {
    id: 'veh_02',
    model: 'Honda City ZX i-VTEC',
    rcNo: 'DL-04-XY-8812',
    category: 'Sedan',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    dailyRate: 45,
    rating: 4.7,
    reviewCount: 19,
    status: 'Available',
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
    description: 'Executive sedan featuring supreme ride comfort, expansive rear legroom, and effortless highway cruising.'
  },
  {
    id: 'veh_03',
    model: 'BMW 330i M Sport',
    rcNo: 'KA-05-MM-3301',
    category: 'Luxury',
    agencyId: 'agency_royal',
    agencyName: 'Royal Wheels Luxury Hub',
    dailyRate: 120,
    rating: 4.9,
    reviewCount: 22,
    status: 'Available',
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    description: 'Pure Bavarian dynamics with twin-power turbo performance, laser lights, and executive M-sport package.'
  },
  {
    id: 'veh_04',
    model: 'Mercedes-Benz C200 Avantgarde',
    rcNo: 'KA-01-EQ-9900',
    category: 'Luxury',
    agencyId: 'agency_royal',
    agencyName: 'Royal Wheels Luxury Hub',
    dailyRate: 135,
    rating: 4.9,
    reviewCount: 16,
    status: 'Available',
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    description: 'Flagship luxury sedan with Burmester audio, autonomous driving assist, and unmatched acoustic refinement.'
  },
  {
    id: 'veh_05',
    model: 'Mahindra Thar 4x4 Hardtop',
    rcNo: 'MH-02-TR-4040',
    category: 'SUV',
    agencyId: 'agency_metro',
    agencyName: 'MetroDrive Fleet Services',
    dailyRate: 65,
    rating: 4.6,
    reviewCount: 11,
    status: 'Available',
    fuel: 'Diesel',
    transmission: 'Manual',
    seats: 4,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    description: 'Go-anywhere rugged 4x4 off-roader with shift-on-the-fly transfer case and all-terrain traction.'
  },
  {
    id: 'veh_06',
    model: 'Tata Nexon EV Max',
    rcNo: 'MH-12-EV-2022',
    category: 'SUV',
    agencyId: 'agency_metro',
    agencyName: 'MetroDrive Fleet Services',
    dailyRate: 50,
    rating: 4.8,
    reviewCount: 15,
    status: 'Available',
    fuel: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    description: 'Zero-emission electric compact SUV with 400km range, DC fast charging support, and silent torque.'
  },
  {
    id: 'veh_07',
    model: 'Maruti Suzuki Swift ZXi+',
    rcNo: 'DL-09-SW-1122',
    category: 'Hatchback',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    dailyRate: 35,
    rating: 4.5,
    reviewCount: 28,
    status: 'Available',
    fuel: 'Petrol',
    transmission: 'Manual',
    seats: 5,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    description: 'Agile urban hatchback engineered for incredible fuel economy and effortless city maneuvering.'
  },
  {
    id: 'veh_08',
    model: 'Toyota Innova Crysta 2.4 ZX',
    rcNo: 'MH-14-IN-7788',
    category: 'SUV',
    agencyId: 'agency_metro',
    agencyName: 'MetroDrive Fleet Services',
    dailyRate: 75,
    rating: 4.9,
    reviewCount: 31,
    status: 'Available',
    fuel: 'Diesel',
    transmission: 'Automatic',
    seats: 7,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    description: 'Legendary 7-seater multi-purpose vehicle built for ultimate passenger comfort and long-distance endurance.'
  }
];

const INITIAL_DRIVERS = [
  {
    id: 'drv_01',
    agencyId: 'agency_apex',
    name: 'Rajesh Sharma',
    licenseNo: 'DL-IND-2018-091823',
    phone: '+91 98765 43210',
    status: 'Assigned',
    assignedBookingId: 'CARX-BK-1042',
    rating: 4.9
  },
  {
    id: 'drv_02',
    agencyId: 'agency_royal',
    name: 'Vikram Malhotra',
    licenseNo: 'DL-IND-2015-882711',
    phone: '+91 98111 22334',
    status: 'Available',
    assignedBookingId: null,
    rating: 5.0
  },
  {
    id: 'drv_03',
    agencyId: 'agency_metro',
    name: 'Amit Kulkarni',
    licenseNo: 'DL-IND-2020-449102',
    phone: '+91 97654 32198',
    status: 'Available',
    assignedBookingId: null,
    rating: 4.7
  },
  {
    id: 'drv_04',
    agencyId: 'agency_apex',
    name: 'Sunita Rao',
    licenseNo: 'DL-IND-2019-331904',
    phone: '+91 99223 34455',
    status: 'Available',
    assignedBookingId: null,
    rating: 4.8
  }
];

const INITIAL_USERS = [
  {
    id: 'usr_cust_01',
    name: 'Priya Sharma',
    email: 'user@carx.com',
    password: 'pass123',
    role: 'customer',
    phone: '+91 98200 44556',
    kycId: 'AADH-IND-9021-4432',
    licenseNo: 'DL-IND-2020-001928'
  },
  {
    id: 'usr_cust_02',
    name: 'John Doe',
    email: 'john@carx.com',
    password: 'pass123',
    role: 'customer',
    phone: '+1 415 555 2671',
    kycId: 'PASS-US-9988221',
    licenseNo: 'CA-DL-882910'
  },
  {
    id: 'usr_ag_01',
    name: 'Apex Fleet Director',
    email: 'apex@carx.com',
    password: 'admin123',
    role: 'agency',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    phone: '+91 98230 11223'
  },
  {
    id: 'usr_ag_02',
    name: 'Royal Wheels Director',
    email: 'royal@carx.com',
    password: 'admin123',
    role: 'agency',
    agencyId: 'agency_royal',
    agencyName: 'Royal Wheels Luxury Hub',
    phone: '+91 98450 33445'
  },
  {
    id: 'usr_ag_03',
    name: 'MetroDrive Fleet Ops',
    email: 'metro@carx.com',
    password: 'admin123',
    role: 'agency',
    agencyId: 'agency_metro',
    agencyName: 'MetroDrive Fleet Services',
    phone: '+91 98900 55667'
  }
];

// Seed timestamps relative to current time so active bookings are in future
const now = new Date();
const tomorrow = new Date(now.getTime() + 36 * 3600 * 1000);
const dayAfter = new Date(now.getTime() + 84 * 3600 * 1000);
const pastPickup = new Date(now.getTime() - 96 * 3600 * 1000);
const pastReturn = new Date(now.getTime() - 48 * 3600 * 1000);

const INITIAL_BOOKINGS = [
  {
    bookingId: 'CARX-BK-1042',
    customerId: 'usr_cust_01',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98200 44556',
    customerEmail: 'user@carx.com',
    vehicleId: 'veh_01',
    vehicleModel: 'Hyundai Creta SX (O)',
    vehicleRc: 'DL-01-AB-1024',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    pickupLocation: 'Downtown Metro Hub (Bay 4)',
    pickupDateTime: tomorrow.toISOString(),
    returnDateTime: dayAfter.toISOString(),
    rentalDays: 2,
    driverOption: 'agency', // 'self' or 'agency'
    assignedDriverId: 'drv_01',
    assignedDriverName: 'Rajesh Sharma (+91 98765 43210)',
    licenseNo: 'DL-IND-2020-001928',
    kycDocId: 'AADH-IND-9021-4432',
    kycStatus: 'Verified',
    baseFare: 110,
    driverFee: 50,
    securityDeposit: 100,
    taxAmount: 19.2,
    totalPaid: 279.2,
    paymentMethod: 'Card (4532 •••• 8841)',
    paymentStatus: 'Paid',
    bookingStatus: 'Active', // 'Active' | 'Completed' | 'Cancelled'
    createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
    cancellationDetails: null
  },
  {
    bookingId: 'CARX-BK-0988',
    customerId: 'usr_cust_01',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98200 44556',
    customerEmail: 'user@carx.com',
    vehicleId: 'veh_02',
    vehicleModel: 'Honda City ZX i-VTEC',
    vehicleRc: 'DL-04-XY-8812',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    pickupLocation: 'Central Railway Station Hub',
    pickupDateTime: pastPickup.toISOString(),
    returnDateTime: pastReturn.toISOString(),
    rentalDays: 2,
    driverOption: 'self',
    assignedDriverId: null,
    assignedDriverName: null,
    licenseNo: 'DL-IND-2020-001928',
    kycDocId: 'AADH-IND-9021-4432',
    kycStatus: 'Verified',
    baseFare: 90,
    driverFee: 0,
    securityDeposit: 100,
    taxAmount: 10.8,
    totalPaid: 200.8,
    paymentMethod: 'UPI (traveler@okhdfcbank)',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    createdAt: new Date(now.getTime() - 120 * 3600 * 1000).toISOString(),
    cancellationDetails: null
  },
  {
    bookingId: 'CARX-BK-0842',
    customerId: 'usr_cust_01',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98200 44556',
    customerEmail: 'user@carx.com',
    vehicleId: 'veh_07',
    vehicleModel: 'Maruti Suzuki Swift ZXi+',
    vehicleRc: 'DL-09-SW-1122',
    agencyId: 'agency_apex',
    agencyName: 'Apex Velocity Rentals',
    pickupLocation: 'Suburban Express Plaza',
    pickupDateTime: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
    returnDateTime: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
    rentalDays: 2,
    driverOption: 'self',
    assignedDriverId: null,
    assignedDriverName: null,
    licenseNo: 'DL-IND-2020-001928',
    kycDocId: 'AADH-IND-9021-4432',
    kycStatus: 'Verified',
    baseFare: 70,
    driverFee: 0,
    securityDeposit: 100,
    taxAmount: 8.4,
    totalPaid: 178.4,
    paymentMethod: 'NetBanking (HDFC Bank)',
    paymentStatus: 'Refunded',
    bookingStatus: 'Cancelled',
    createdAt: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
    cancellationDetails: {
      cancelledAt: new Date(now.getTime() - 36 * 3600 * 1000).toISOString(),
      hoursBeforePickup: 28,
      tier: '>24 Hours (90% Refund Tier)',
      deductionPercentage: 10,
      deductionFee: 7.84,
      netRefundAmount: 170.56,
      refundStatus: 'Credited to Original Source'
    }
  }
];

const INITIAL_REVIEWS = [
  {
    reviewId: 'rev_01',
    bookingId: 'CARX-BK-0988',
    vehicleId: 'veh_02',
    vehicleModel: 'Honda City ZX i-VTEC',
    vehicleRc: 'DL-04-XY-8812',
    agencyId: 'agency_apex',
    authorName: 'Priya Sharma',
    rating: 5,
    condition: 'Excellent - Pristine Condition',
    service: 'Exceptional - Prompt Handover',
    comment: 'Immaculate car! The engine was responsive and the car was handed over right on time at Bay 4. Highly recommend Apex Velocity.',
    createdAt: new Date(now.getTime() - 40 * 3600 * 1000).toISOString()
  },
  {
    reviewId: 'rev_02',
    bookingId: 'CARX-BK-0711',
    vehicleId: 'veh_03',
    vehicleModel: 'BMW 330i M Sport',
    vehicleRc: 'KA-05-MM-3301',
    agencyId: 'agency_royal',
    authorName: 'Rohit Verma',
    rating: 5,
    condition: 'Excellent - Pristine Condition',
    service: 'Exceptional - Prompt Handover',
    comment: 'The BMW was a thrill to drive on the expressway. Royal Wheels provided spotless documentation and seamless return.',
    createdAt: new Date(now.getTime() - 72 * 3600 * 1000).toISOString()
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_01',
    targetUserId: 'usr_cust_01',
    title: 'Chauffeur Assigned & Vehicle Ready',
    message: 'Rajesh Sharma (+91 98765 43210) has been assigned for Booking CARX-BK-1042. Pickup point: Downtown Metro Hub (Bay 4).',
    timestamp: new Date().toISOString(),
    read: false
  }
];

// Helper: Database Access (localStorage)
function getDB(key, defaultVal = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (err) {
    console.error('Database read error:', err);
    return defaultVal;
  }
}

function setDB(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    updateDBStatusTag();
  } catch (err) {
    console.error('Database write error:', err);
    showToast('Database Error', 'Could not save data to localStorage.', 'error');
  }
}

// Helper: Cache Memory (sessionStorage)
function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Cache read error:', err);
    return null;
  }
}

function setCache(key, val) {
  try {
    sessionStorage.setItem(key, JSON.stringify(val));
    updateCacheStatusTag();
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

function clearCache(key) {
  try {
    sessionStorage.removeItem(key);
    updateCacheStatusTag();
  } catch (err) {
    console.error('Cache clear error:', err);
  }
}

// Initial Database Seeding
function seedInitialDataIfEmpty(force = false) {
  if (force || !localStorage.getItem('carx_vehicles')) {
    setDB('carx_agencies', INITIAL_AGENCIES);
    setDB('carx_vehicles', INITIAL_VEHICLES);
    setDB('carx_drivers', INITIAL_DRIVERS);
    setDB('carx_users', INITIAL_USERS);
    setDB('carx_bookings', INITIAL_BOOKINGS);
    setDB('carx_reviews', INITIAL_REVIEWS);
    setDB('carx_notifications', INITIAL_NOTIFICATIONS);
    console.log('CarX: Main Database (localStorage) seeded with initial enterprise records.');
  }
}

function resetToInitialSeed() {
  if (confirm('Reset Main Database (localStorage) to initial demo state? All custom bookings and entries will be restored to seed values.')) {
    seedInitialDataIfEmpty(true);
    showToast('Database Reset', 'Main Database (localStorage) restored to default state.', 'info');
    if (currentUser) {
      if (currentUser.role === 'customer') {
        openCustomerWorkflow('vehicles');
      } else {
        renderAgencyDashboard();
      }
    }
  }
}

function updateCacheStatusTag() {
  const tag = document.getElementById('cache-status-tag');
  const session = getCache('carx_active_session');
  if (tag) {
    if (session && session.token) {
      tag.textContent = `Cache (sessionStorage): Active [${session.token.substring(0, 10)}...]`;
      tag.style.color = '#38bdf8';
    } else {
      tag.textContent = 'Cache (sessionStorage): Empty / Idle';
      tag.style.color = '#94a3b8';
    }
  }
}

function updateDBStatusTag() {
  const tag = document.getElementById('db-status-tag');
  if (tag) {
    tag.textContent = 'Main DB (localStorage): Connected';
  }
}

// ==============================================================================
// 2. AUTHENTICATION GATEWAY & SESSION VERIFICATION
// ==============================================================================

function initApp() {
  seedInitialDataIfEmpty();
  updateDBStatusTag();
  updateCacheStatusTag();

  // Cache Memory Check (Verify Session & Cache in sessionStorage)
  verifyActiveSessionCache();
}

function verifyActiveSessionCache() {
  const cacheAlert = document.getElementById('auth-cache-msg');
  const cacheText = document.getElementById('auth-cache-text');
  
  if (cacheAlert && cacheText) {
    cacheAlert.style.display = 'flex';
    cacheText.textContent = 'Verifying active session token in Cache Memory (sessionStorage)...';
  }

  setTimeout(() => {
    const cachedSession = getCache('carx_active_session');
    
    if (cachedSession && cachedSession.token && cachedSession.user) {
      // Valid session found in cache!
      currentUser = cachedSession.user;
      currentRole = currentUser.role;

      showToast(
        'Active Session Resumed',
        `Authenticated from Cache Memory as ${currentUser.name} (${currentUser.role.toUpperCase()})`,
        'success'
      );

      routeToDashboard(currentUser.role);
    } else {
      // No active session in cache
      if (cacheAlert && cacheText) {
        cacheText.textContent = 'No cached session token found. Please authenticate via credentials or Google OAuth.';
      }
      routeToAuthGateway();
    }
  }, 450);
}

function setAuthRole(role) {
  currentRole = role;
  const tabs = document.querySelectorAll('.role-tab');
  tabs.forEach(tab => {
    if (tab.dataset.role === role) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const agencyGroup = document.getElementById('reg-agency-group');
  if (agencyGroup) {
    agencyGroup.style.display = role === 'agency' ? 'flex' : 'none';
  }
}

function toggleAuthMode(mode) {
  const btnLogin = document.getElementById('btn-mode-login');
  const btnReg = document.getElementById('btn-mode-register');
  const formLogin = document.getElementById('form-login');
  const formReg = document.getElementById('form-register');

  if (mode === 'login') {
    btnLogin.classList.add('active');
    btnReg.classList.remove('active');
    formLogin.classList.remove('hidden');
    formReg.classList.add('hidden');
  } else {
    btnReg.classList.add('active');
    btnLogin.classList.remove('active');
    formReg.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

function fillCreds(email, pass, role) {
  setAuthRole(role);
  toggleAuthMode('login');
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = pass;
  showToast('Test Credentials Filled', `Loaded ${email}`, 'info');
}

function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass = document.getElementById('login-password').value;

  const users = getDB('carx_users', []);
  const foundUser = users.find(u => u.email.toLowerCase() === email && u.password === pass);

  if (!foundUser) {
    showToast('Authentication Failure', 'Invalid email or password credentials. Check seeded demo accounts.', 'error');
    return;
  }

  // Check role match
  if (foundUser.role !== currentRole) {
    showToast(
      'Role Mismatch Warning',
      `Account "${foundUser.name}" is registered as a ${foundUser.role.toUpperCase()}. Switched role automatically.`,
      'warning'
    );
    setAuthRole(foundUser.role);
  }

  // Create active session in Cache Memory (sessionStorage)
  const sessionToken = 'CRX-SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now();
  const sessionData = {
    token: sessionToken,
    user: foundUser,
    loggedAt: new Date().toISOString()
  };
  setCache('carx_active_session', sessionData);

  currentUser = foundUser;
  showToast('Authentication Success', `Welcome back, ${foundUser.name}! Session cached in memory.`, 'success');
  routeToDashboard(foundUser.role);
}

function handleRegistration(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const phone = document.getElementById('reg-phone').value.trim();
  const pass = document.getElementById('reg-password').value;
  const agencyName = document.getElementById('reg-agency-name').value.trim();

  const users = getDB('carx_users', []);
  if (users.some(u => u.email.toLowerCase() === email)) {
    showToast('Registration Error', 'An account with this email address already exists in the database.', 'error');
    return;
  }

  let newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    password: pass,
    phone,
    role: currentRole
  };

  if (currentRole === 'agency') {
    const agencyId = 'agency_' + Date.now();
    const finalAgencyName = agencyName || (name + ' Fleet');
    newUser.agencyId = agencyId;
    newUser.agencyName = finalAgencyName;

    // Add agency to DB
    const agencies = getDB('carx_agencies', []);
    agencies.push({
      id: agencyId,
      name: finalAgencyName,
      hub: 'Central Operational Terminal',
      phone,
      email,
      rating: 5.0,
      totalReviews: 0,
      totalRevenue: 0
    });
    setDB('carx_agencies', agencies);
  } else {
    newUser.kycId = 'ID-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    newUser.licenseNo = 'DL-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  users.push(newUser);
  setDB('carx_users', users);

  // Store in cache
  const sessionToken = 'CRX-SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now();
  setCache('carx_active_session', {
    token: sessionToken,
    user: newUser,
    loggedAt: new Date().toISOString()
  });

  currentUser = newUser;
  showToast('Account Created', `Registration complete for ${name}. Saved to Main Database.`, 'success');
  routeToDashboard(newUser.role);
}

// Simulated Google OAuth Flow
function triggerGoogleOAuth() {
  openModal('modal-google-oauth');
}

function completeGoogleOAuth(email, name, forceRole) {
  closeModal('modal-google-oauth');
  const role = forceRole || currentRole;

  let users = getDB('carx_users', []);
  let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!foundUser) {
    foundUser = {
      id: 'usr_oauth_' + Date.now(),
      name,
      email,
      password: 'oauth_token_authenticated',
      phone: '+91 98000 00000',
      role,
      kycId: 'OAUTH-KYC-' + Math.floor(100000 + Math.random() * 900000),
      licenseNo: 'DL-GOOG-' + Math.floor(100000 + Math.random() * 900000)
    };
    if (role === 'agency') {
      foundUser.agencyId = 'agency_apex';
      foundUser.agencyName = 'Apex Velocity Rentals';
    }
    users.push(foundUser);
    setDB('carx_users', users);
  }

  // Create session in cache
  const sessionToken = 'OAUTH-TOK-' + Math.random().toString(36).substring(2, 12).toUpperCase();
  setCache('carx_active_session', {
    token: sessionToken,
    user: foundUser,
    loggedAt: new Date().toISOString()
  });

  currentUser = foundUser;
  currentRole = foundUser.role;

  showToast('Google OAuth Verified', `Authenticated as ${name} via Google Identity Services.`, 'success');
  routeToDashboard(foundUser.role);
}

function quickDemoLogin(targetRole) {
  if (targetRole === 'customer') {
    fillCreds('user@carx.com', 'pass123', 'customer');
  } else {
    fillCreds('apex@carx.com', 'admin123', 'agency');
  }
  document.getElementById('form-login').dispatchEvent(new Event('submit', { cancelable: true }));
}

function logout() {
  clearCache('carx_active_session');
  currentUser = null;
  showToast('Logged Out', 'Active session cache cleared. Returning to Gateway.', 'info');
  routeToAuthGateway();
}

// ==============================================================================
// 3. SPA ROUTING & NAVIGATION CONTROLLER
// ==============================================================================

function routeToAuthGateway() {
  document.getElementById('view-auth').classList.remove('hidden');
  document.getElementById('view-customer').classList.add('hidden');
  document.getElementById('view-agency').classList.add('hidden');
  renderNavigation();
}

function routeToDashboard(role) {
  document.getElementById('view-auth').classList.add('hidden');
  
  if (role === 'customer') {
    document.getElementById('view-customer').classList.remove('hidden');
    document.getElementById('view-agency').classList.add('hidden');
    initCustomerPortal();
  } else {
    document.getElementById('view-customer').classList.add('hidden');
    document.getElementById('view-agency').classList.remove('hidden');
    renderAgencyDashboard();
  }
  renderNavigation();
}

function navigateToDashboard() {
  if (!currentUser) {
    routeToAuthGateway();
    return;
  }
  if (currentUser.role === 'customer') {
    // Hide all subviews and show dashboard hub
    const subviews = document.querySelectorAll('.subview-section');
    subviews.forEach(s => s.classList.add('hidden'));
    document.getElementById('subview-vehicles').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    switchAgencyTab('fleet');
  }
}

function renderNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navActions = document.getElementById('nav-actions');

  if (!currentUser) {
    navMenu.innerHTML = '';
    navActions.innerHTML = `
      <button type="button" class="btn-primary" onclick="routeToAuthGateway()">
        Sign In / Register
      </button>
    `;
    return;
  }

  // User is logged in
  if (currentUser.role === 'customer') {
    navMenu.innerHTML = `
      <button type="button" class="nav-link active" onclick="openCustomerWorkflow('vehicles')">Browse Fleet</button>
      <button type="button" class="nav-link" onclick="openCustomerWorkflow('booking')">Book Ride</button>
      <button type="button" class="nav-link" onclick="openCustomerWorkflow('rides')">My Bookings</button>
      <button type="button" class="nav-link" onclick="openCustomerWorkflow('cancellation')">Refunds</button>
      <button type="button" class="nav-link" onclick="openCustomerWorkflow('feedback')">Reviews</button>
    `;
  } else {
    navMenu.innerHTML = `
      <button type="button" class="nav-link active" onclick="switchAgencyTab('fleet')">Fleet Ops</button>
      <button type="button" class="nav-link" onclick="switchAgencyTab('drivers')">Drivers</button>
      <button type="button" class="nav-link" onclick="switchAgencyTab('bookings')">Bookings & Refunds</button>
      <button type="button" class="nav-link" onclick="switchAgencyTab('reviews')">Feedback</button>
    `;
  }

  navActions.innerHTML = `
    <div class="user-profile-badge">
      <div class="user-avatar ${currentUser.role === 'agency' ? 'agency' : ''}">
        ${currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
      </div>
      <div class="user-details">
        <span class="user-name">${currentUser.name}</span>
        <span class="user-role-label">${currentUser.role === 'agency' ? (currentUser.agencyName || 'Agency Admin') : 'Customer'}</span>
      </div>
    </div>
    <button type="button" class="btn-logout" onclick="logout()" title="Logout and clear Cache Memory">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      Logout
    </button>
  `;
}

// ==============================================================================
// 4. CUSTOMER PORTAL & WORKFLOW MODULES
// ==============================================================================

function initCustomerPortal() {
  document.getElementById('cust-welcome-title').textContent = `Welcome, ${currentUser.name}`;
  
  const cachedSession = getCache('carx_active_session');
  if (cachedSession) {
    document.getElementById('cust-session-key').textContent = cachedSession.token.substring(0, 14) + '...';
  }

  // Pre-fill user KYC values in booking form if available
  if (currentUser.licenseNo) {
    document.getElementById('book-license-no').value = currentUser.licenseNo;
  }
  if (currentUser.kycId) {
    document.getElementById('book-doc-id').value = currentUser.kycId;
  }

  // Set default booking dates (tomorrow to day after)
  const pDate = new Date(Date.now() + 24 * 3600 * 1000);
  const rDate = new Date(Date.now() + 72 * 3600 * 1000);
  
  const pad = n => String(n).padStart(2, '0');
  const formatDateTime = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  
  document.getElementById('book-pickup-datetime').value = formatDateTime(pDate);
  document.getElementById('book-return-datetime').value = formatDateTime(rDate);

  // Load Agency list in filters and vehicle select
  View_agency_list();

  // Load Vehicles
  View_Vehicle_List();

  // Populate Booking vehicle options
  populateBookingVehicleDropdown();

  // Update ride count indicator
  updateActiveRidesCounter();

  // Show vehicles subview initially
  openCustomerWorkflow('vehicles');
}

function openCustomerWorkflow(workflowName) {
  const subviews = {
    vehicles: document.getElementById('subview-vehicles'),
    booking: document.getElementById('subview-booking'),
    rides: document.getElementById('subview-rides'),
    cancellation: document.getElementById('subview-cancellation'),
    feedback: document.getElementById('subview-feedback')
  };

  Object.keys(subviews).forEach(key => {
    if (key === workflowName) {
      subviews[key].classList.remove('hidden');
    } else {
      subviews[key].classList.add('hidden');
    }
  });

  // Action triggers
  if (workflowName === 'vehicles') {
    View_Vehicle_List();
  } else if (workflowName === 'booking') {
    recalculateFare();
  } else if (workflowName === 'rides') {
    View_Ride_Status();
  } else if (workflowName === 'cancellation') {
    initCancellationPage();
  } else if (workflowName === 'feedback') {
    initFeedbackPage();
  }

  window.scrollTo({ top: 380, behavior: 'smooth' });
}

// ------------------------------------------------------------------------------
// WORKFLOW 1: Browse Available Vehicles (View_agency_list & View_Vehicle_List)
// ------------------------------------------------------------------------------

function View_agency_list() {
  const agencies = getDB('carx_agencies', []);
  const filterSelect = document.getElementById('filter-agency');
  
  if (filterSelect) {
    const currentVal = filterSelect.value;
    filterSelect.innerHTML = '<option value="ALL">All Rental Agencies</option>';
    agencies.forEach(agency => {
      const opt = document.createElement('option');
      opt.value = agency.id;
      opt.textContent = `${agency.name} (★ ${agency.rating})`;
      filterSelect.appendChild(opt);
    });
    filterSelect.value = currentVal || 'ALL';
  }
}

function View_Vehicle_List() {
  const vehicles = getDB('carx_vehicles', []);
  const grid = document.getElementById('vehicles-grid');
  if (!grid) return;

  const agencyFilter = document.getElementById('filter-agency').value;
  const typeFilter = document.getElementById('filter-type').value;
  const statusFilter = document.getElementById('filter-status').value;
  const maxPrice = parseFloat(document.getElementById('filter-price-range').value);
  const searchTerm = (document.getElementById('filter-search').value || '').trim().toLowerCase();

  const filtered = vehicles.filter(v => {
    if (agencyFilter !== 'ALL' && v.agencyId !== agencyFilter) return false;
    if (typeFilter !== 'ALL' && v.category !== typeFilter) return false;
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (v.dailyRate > maxPrice) return false;
    if (searchTerm) {
      const matchModel = v.model.toLowerCase().includes(searchTerm);
      const matchRc = v.rcNo.toLowerCase().includes(searchTerm);
      const matchAgency = v.agencyName.toLowerCase().includes(searchTerm);
      if (!matchModel && !matchRc && !matchAgency) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--slate-700);">No vehicles matching your filter criteria</p>
        <p style="font-size: 0.85rem; color: var(--slate-400); margin-top: 0.25rem;">Try adjusting the price slider or resetting agency / category filters.</p>
        <button type="button" class="btn-secondary mt-3" onclick="resetVehicleFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(v => {
    const isAvailable = v.status === 'Available';
    const badgeClass = isAvailable ? 'badge-available' : (v.status === 'Booked' ? 'badge-booked' : 'badge-maintenance');
    
    return `
      <div class="vehicle-card">
        <div class="vehicle-media">
          <img src="${v.image}" alt="${v.model}" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'">
          <div class="vehicle-media-badges">
            <span class="category-tag">${v.category}</span>
            <span class="badge ${badgeClass}">${v.status}</span>
          </div>
        </div>
        <div class="vehicle-body">
          <div class="vehicle-header-row">
            <div>
              <h4 class="vehicle-model">${v.model}</h4>
              <span class="vehicle-rc">RC: ${v.rcNo}</span>
            </div>
            <div class="rating-badge">
              <span>★</span>
              <span>${v.rating}</span>
              <small style="color: var(--slate-400);">(${v.reviewCount || 0})</small>
            </div>
          </div>

          <div class="vehicle-agency-name">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            ${v.agencyName}
          </div>

          <div class="vehicle-specs-row">
            <span class="spec-pill">⛽ ${v.fuel}</span>
            <span class="spec-pill">⚙️ ${v.transmission}</span>
            <span class="spec-pill">👥 ${v.seats} Seats</span>
          </div>

          <div class="vehicle-footer-row">
            <div class="rate-box">
              <span class="rate-amount">$${v.dailyRate}</span>
              <span class="rate-sub">per 24 hrs</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn-secondary" onclick="viewVehicleDetails('${v.id}')">
                Details
              </button>
              ${isAvailable 
                ? `<button type="button" class="btn-primary" onclick="initiateVehicleBooking('${v.id}')">
                     Book Now
                   </button>`
                : `<button type="button" class="btn-outline" disabled style="opacity: 0.6; cursor: not-allowed;">
                     Reserved
                   </button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function applyVehicleFilters() {
  View_Vehicle_List();
}

function updatePriceSlider(val) {
  document.getElementById('filter-price-val').textContent = val;
  applyVehicleFilters();
}

function resetVehicleFilters() {
  document.getElementById('filter-agency').value = 'ALL';
  document.getElementById('filter-type').value = 'ALL';
  document.getElementById('filter-status').value = 'ALL';
  document.getElementById('filter-price-range').value = 150;
  document.getElementById('filter-price-val').textContent = '150';
  document.getElementById('filter-search').value = '';
  applyVehicleFilters();
}

function viewVehicleDetails(vehicleId) {
  const vehicles = getDB('carx_vehicles', []);
  const v = vehicles.find(item => item.id === vehicleId);
  if (!v) return;

  const drivers = getDB('carx_drivers', []).filter(d => d.agencyId === v.agencyId);
  const driverNames = drivers.length > 0 
    ? drivers.map(d => `${d.name} (${d.phone})`).join(', ')
    : 'Agency certified chauffeurs available upon request';

  const reviews = getDB('carx_reviews', []).filter(r => r.vehicleId === v.id);

  const modalBody = document.getElementById('mvd-body');
  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
      <div>
        <img src="${v.image}" alt="${v.model}" style="width: 100%; border-radius: var(--radius-md); max-height: 260px; object-fit: cover;">
        <h4 style="font-size: 1.3rem; font-weight: 800; margin-top: 1rem; color: var(--slate-900);">${v.model}</h4>
        <p style="font-size: 0.85rem; color: var(--slate-600); margin-top: 0.35rem;">${v.description}</p>

        <div style="margin-top: 1rem; background: var(--slate-50); padding: 0.85rem; border-radius: var(--radius-md);">
          <strong style="font-size: 0.8rem; color: var(--slate-500); text-transform: uppercase;">Available Agency Drivers</strong>
          <p style="font-size: 0.85rem; color: var(--slate-800); margin-top: 0.25rem;">${driverNames}</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--slate-200); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--slate-500);">Registration RC No</span>
            <strong style="font-family: monospace;">${v.rcNo}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--slate-200); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--slate-500);">Agency Operator</span>
            <strong>${v.agencyName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--slate-200); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--slate-500);">Category</span>
            <strong>${v.category}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--slate-200); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--slate-500);">Specs</span>
            <strong>${v.fuel} | ${v.transmission} | ${v.seats} Seats</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--slate-200); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--slate-500);">Daily Rental Rate</span>
            <strong style="color: var(--blue-600); font-size: 1.1rem;">$${v.dailyRate} / day</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 0.85rem; color: var(--slate-500);">Customer Rating</span>
            <strong style="color: #b45309;">★ ${v.rating} (${v.reviewCount || 0} reviews)</strong>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          ${v.status === 'Available'
            ? `<button type="button" class="btn-primary btn-block btn-lg" onclick="closeModal('modal-vehicle-details'); initiateVehicleBooking('${v.id}')">
                 Proceed to Book this Vehicle
               </button>`
            : `<button type="button" class="btn-secondary btn-block" disabled>Vehicle is Currently Booked</button>`
          }
        </div>
      </div>
    </div>
  `;

  openModal('modal-vehicle-details');
}

// ------------------------------------------------------------------------------
// WORKFLOW 2: Booking & Document Verification System (Book_Vehicle)
// ------------------------------------------------------------------------------

function populateBookingVehicleDropdown() {
  const vehicles = getDB('carx_vehicles', []);
  const select = document.getElementById('book-vehicle-select');
  if (!select) return;

  select.innerHTML = '';
  vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.model} (${v.rcNo}) - $${v.dailyRate}/day [${v.status}]`;
    if (v.status !== 'Available') {
      opt.textContent += ' - (Reserved)';
    }
    select.appendChild(opt);
  });
}

function initiateVehicleBooking(vehicleId) {
  openCustomerWorkflow('booking');
  const select = document.getElementById('book-vehicle-select');
  if (select) {
    select.value = vehicleId;
    onBookingVehicleChange();
  }
}

function onBookingVehicleChange() {
  recalculateFare();
}

function toggleDriverOption(option) {
  const cards = document.querySelectorAll('.radio-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.value === option) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  const rowDriver = document.getElementById('row-driver-fee');
  if (rowDriver) {
    rowDriver.style.display = option === 'agency' ? 'flex' : 'none';
  }

  recalculateFare();
}

function handleDocUploadPreview(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedDocDataUrl = e.target.result;
    document.getElementById('doc-preview-img').src = uploadedDocDataUrl;
    document.getElementById('doc-file-name').textContent = file.name;
    document.getElementById('dropzone-empty').classList.add('hidden');
    document.getElementById('doc-preview-container').classList.remove('hidden');

    showToast('KYC Document Processed', 'Client preview rendered and auto-verified for simulated compliance.', 'success');
  };
  reader.readAsDataURL(file);
}

function clearDocUpload() {
  uploadedDocDataUrl = null;
  document.getElementById('book-doc-file').value = '';
  document.getElementById('dropzone-empty').classList.remove('hidden');
  document.getElementById('doc-preview-container').classList.add('hidden');
}

function recalculateFare() {
  const select = document.getElementById('book-vehicle-select');
  if (!select || !select.value) return;

  const vehicles = getDB('carx_vehicles', []);
  const vehicle = vehicles.find(v => v.id === select.value);
  if (!vehicle) return;

  // Render vehicle preview sidebar
  const previewBox = document.getElementById('selected-vehicle-preview');
  if (previewBox) {
    previewBox.innerHTML = `
      <img src="${vehicle.image}" alt="${vehicle.model}" style="width: 100%; height: 130px; object-fit: cover; border-radius: var(--radius-md);">
      <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--slate-900); margin-top: 0.65rem;">${vehicle.model}</h4>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem;">
        <span style="font-family: monospace; font-size: 0.775rem; background: var(--slate-100); padding: 2px 6px; border-radius: 4px;">RC: ${vehicle.rcNo}</span>
        <span style="font-size: 0.775rem; color: var(--slate-500);">${vehicle.agencyName}</span>
      </div>
    `;
  }

  // Calculate rental duration in days
  const pickupVal = document.getElementById('book-pickup-datetime').value;
  const returnVal = document.getElementById('book-return-datetime').value;

  let days = 1;
  if (pickupVal && returnVal) {
    const pTime = new Date(pickupVal).getTime();
    const rTime = new Date(returnVal).getTime();
    const diffHours = (rTime - pTime) / (3600 * 1000);
    days = Math.max(1, Math.ceil(diffHours / 24));
  }

  const driverRadio = document.querySelector('input[name="driver-option"]:checked');
  const hasAgencyDriver = driverRadio && driverRadio.value === 'agency';

  const dailyRate = vehicle.dailyRate;
  const baseFare = dailyRate * days;
  const driverFee = hasAgencyDriver ? (25 * days) : 0;
  const securityDeposit = 100;
  const taxAmount = parseFloat(((baseFare + driverFee) * 0.12).toFixed(2));
  const totalPayable = parseFloat((baseFare + driverFee + securityDeposit + taxAmount).toFixed(2));

  // Update UI Elements
  document.getElementById('calc-daily-rate').textContent = `$${dailyRate} / day`;
  document.getElementById('calc-duration').textContent = `${days} Day${days > 1 ? 's' : ''}`;
  document.getElementById('calc-base-fare').textContent = `$${baseFare.toFixed(2)}`;
  document.getElementById('calc-driver-fee').textContent = `$${driverFee.toFixed(2)}`;
  document.getElementById('calc-tax').textContent = `$${taxAmount.toFixed(2)}`;
  document.getElementById('calc-total-payable').textContent = `$${totalPayable.toFixed(2)}`;

  // Store in draft
  currentDraftBooking = {
    vehicle,
    days,
    baseFare,
    driverFee,
    securityDeposit,
    taxAmount,
    totalPayable,
    pickupLocation: document.getElementById('book-location').value,
    pickupDateTime: pickupVal,
    returnDateTime: returnVal,
    driverOption: hasAgencyDriver ? 'agency' : 'self',
    licenseNo: document.getElementById('book-license-no').value.trim(),
    kycDocId: document.getElementById('book-doc-id').value.trim()
  };
}

// Triggered when clicking "Proceed to Secure Checkout & Payment" or calling Book_Vehicle()
function Book_Vehicle(vehicleId) {
  if (vehicleId) {
    initiateVehicleBooking(vehicleId);
  } else {
    proceedToPaymentModal();
  }
}

function proceedToPaymentModal() {
  recalculateFare();

  const licenseNo = document.getElementById('book-license-no').value.trim();
  const kycDocId = document.getElementById('book-doc-id').value.trim();

  if (!licenseNo) {
    showToast('Missing Field', 'Please provide a valid Driving License Number for KYC verification.', 'error');
    document.getElementById('book-license-no').focus();
    return;
  }
  if (!kycDocId) {
    showToast('Missing Field', 'Please provide your KYC Document ID (Passport or National ID).', 'error');
    document.getElementById('book-doc-id').focus();
    return;
  }

  // Update draft with fresh inputs
  currentDraftBooking.licenseNo = licenseNo;
  currentDraftBooking.kycDocId = kycDocId;

  // Check if vehicle is still available in DB
  const vehicles = getDB('carx_vehicles', []);
  const freshV = vehicles.find(v => v.id === currentDraftBooking.vehicle.id);
  if (freshV && freshV.status !== 'Available') {
    showToast('Vehicle Unavailable', 'This vehicle is currently marked as Booked or under Maintenance.', 'error');
    return;
  }

  // Setup payment modal
  document.getElementById('gw-amount-display').textContent = `$${currentDraftBooking.totalPayable.toFixed(2)}`;
  document.getElementById('gw-ref-display').textContent = `Booking Ref: ${currentDraftBooking.vehicle.model} (${currentDraftBooking.vehicle.rcNo})`;

  openModal('modal-payment-gateway');
}

// ------------------------------------------------------------------------------
// WORKFLOW 3: Payment Gateway Simulation & Ticket Generation (Payment_Process & Generate_ticket)
// ------------------------------------------------------------------------------

function switchPayMethod(method) {
  const tabs = document.querySelectorAll('.pay-tab');
  tabs.forEach(t => {
    if (t.dataset.method === method) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  document.getElementById('pay-panel-card').classList.toggle('hidden', method !== 'card');
  document.getElementById('pay-panel-upi').classList.toggle('hidden', method !== 'upi');
  document.getElementById('pay-panel-net').classList.toggle('hidden', method !== 'net');
}

function Payment_Process() {
  const btn = document.getElementById('btn-execute-pay');
  const simResult = document.querySelector('input[name="pay-sim-result"]:checked').value;

  btn.disabled = true;
  btn.textContent = 'Contacting Banking Network...';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Authorize & Complete Payment';

    if (simResult === 'failure') {
      showToast(
        'Payment Transaction Declined',
        'Simulated Gateway Failure: Insufficient funds or card issuer timeout. Main Database state unchanged.',
        'error'
      );
      return;
    }

    // Payment Successful!
    closeModal('modal-payment-gateway');
    Generate_ticket();
  }, 900);
}

function Generate_ticket() {
  if (!currentDraftBooking || !currentUser) {
    showToast('Error', 'Missing booking or session state.', 'error');
    return;
  }

  const bookingId = 'CARX-BK-' + Math.floor(1000 + Math.random() * 9000);
  const nowIso = new Date().toISOString();

  // Find agency driver if driver option was requested
  let assignedDriver = null;
  if (currentDraftBooking.driverOption === 'agency') {
    const drivers = getDB('carx_drivers', []);
    assignedDriver = drivers.find(d => d.agencyId === currentDraftBooking.vehicle.agencyId && d.status === 'Available');
    if (!assignedDriver) {
      // Pick any driver from agency or create assignment
      assignedDriver = drivers.find(d => d.agencyId === currentDraftBooking.vehicle.agencyId) || drivers[0];
    }
  }

  // Create official booking record
  const newBooking = {
    bookingId,
    customerId: currentUser.id,
    customerName: currentUser.name,
    customerPhone: currentUser.phone,
    customerEmail: currentUser.email,
    vehicleId: currentDraftBooking.vehicle.id,
    vehicleModel: currentDraftBooking.vehicle.model,
    vehicleRc: currentDraftBooking.vehicle.rcNo,
    agencyId: currentDraftBooking.vehicle.agencyId,
    agencyName: currentDraftBooking.vehicle.agencyName,
    pickupLocation: currentDraftBooking.pickupLocation,
    pickupDateTime: currentDraftBooking.pickupDateTime,
    returnDateTime: currentDraftBooking.returnDateTime,
    rentalDays: currentDraftBooking.days,
    driverOption: currentDraftBooking.driverOption,
    assignedDriverId: assignedDriver ? assignedDriver.id : null,
    assignedDriverName: assignedDriver ? `${assignedDriver.name} (${assignedDriver.phone})` : null,
    licenseNo: currentDraftBooking.licenseNo,
    kycDocId: currentDraftBooking.kycDocId,
    kycStatus: 'Verified',
    baseFare: currentDraftBooking.baseFare,
    driverFee: currentDraftBooking.driverFee,
    securityDeposit: currentDraftBooking.securityDeposit,
    taxAmount: currentDraftBooking.taxAmount,
    totalPaid: currentDraftBooking.totalPayable,
    paymentMethod: 'CarX Simulated Payment',
    paymentStatus: 'Paid',
    bookingStatus: 'Active',
    createdAt: nowIso,
    cancellationDetails: null
  };

  // 1. Save Booking to Main Database (localStorage)
  const bookings = getDB('carx_bookings', []);
  bookings.unshift(newBooking);
  setDB('carx_bookings', bookings);

  // 2. Update Vehicle Status in Main Database: Available -> Booked
  const vehicles = getDB('carx_vehicles', []);
  const vIndex = vehicles.findIndex(v => v.id === currentDraftBooking.vehicle.id);
  if (vIndex !== -1) {
    vehicles[vIndex].status = 'Booked';
    setDB('carx_vehicles', vehicles);
  }

  // 3. Update Driver Status to Assigned if driver was chosen
  if (assignedDriver) {
    const drivers = getDB('carx_drivers', []);
    const dIndex = drivers.findIndex(d => d.id === assignedDriver.id);
    if (dIndex !== -1) {
      drivers[dIndex].status = 'Assigned';
      drivers[dIndex].assignedBookingId = bookingId;
      setDB('carx_drivers', drivers);
    }
  }

  // 4. Update Agency Revenue KPI
  const agencies = getDB('carx_agencies', []);
  const agIndex = agencies.findIndex(a => a.id === currentDraftBooking.vehicle.agencyId);
  if (agIndex !== -1) {
    agencies[agIndex].totalRevenue = (agencies[agIndex].totalRevenue || 0) + currentDraftBooking.totalPayable;
    setDB('carx_agencies', agencies);
  }

  // 5. Trigger Contact_User notification
  Contact_User(newBooking, assignedDriver);

  // 6. Render Printable Digital Ticket Modal
  renderPrintableTicket(newBooking);
  openModal('modal-booking-ticket');

  showToast('Booking Confirmed!', `Booking ID ${bookingId} registered to Main Database. Vehicle marked as Booked.`, 'success');

  // Refresh lists
  View_Vehicle_List();
  populateBookingVehicleDropdown();
  updateActiveRidesCounter();
}

function Contact_User(booking, driver) {
  const driverText = driver 
    ? `Assigned Chauffeur: ${driver.name} (${driver.phone})`
    : `Self-Drive Handover: Physical keys will be presented at ${booking.pickupLocation} upon verifying License ${booking.licenseNo}.`;

  const notifs = getDB('carx_notifications', []);
  const notifObj = {
    id: 'notif_' + Date.now(),
    targetUserId: booking.customerId,
    title: `Pickup Instructions for ${booking.bookingId}`,
    message: `Agency ${booking.agencyName} has prepared your vehicle ${booking.vehicleModel} (${booking.vehicleRc}). ${driverText}`,
    timestamp: new Date().toISOString(),
    read: false
  };
  notifs.unshift(notifObj);
  setDB('carx_notifications', notifs);

  // Also show inline toast
  showToast(
    'Agency Contact Dispatch (Contact_User)',
    `Handover instructions sent: ${driverText}`,
    'info'
  );
}

function renderPrintableTicket(b) {
  const container = document.getElementById('printable-ticket-content');
  if (!container) return;

  const formatDate = str => new Date(str).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  container.innerHTML = `
    <div class="ticket-header-band">
      <div>
        <div class="ticket-brand">CarX Mobility</div>
        <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Official Rental Pass & Acknowledgement Receipt</div>
      </div>
      <span class="ticket-badge">CONFIRMED & VERIFIED</span>
    </div>

    <div class="ticket-body">
      <div>
        <h3 class="ticket-car-model">${b.vehicleModel}</h3>
        <span class="ticket-rc-chip">REGISTRATION RC: ${b.vehicleRc}</span>

        <div class="ticket-grid">
          <div class="t-item">
            <label>Customer Name</label>
            <span>${b.customerName}</span>
          </div>
          <div class="t-item">
            <label>Agency Provider</label>
            <span>${b.agencyName}</span>
          </div>
          <div class="t-item">
            <label>Pickup Time</label>
            <span>${formatDate(b.pickupDateTime)}</span>
          </div>
          <div class="t-item">
            <label>Return Time</label>
            <span>${formatDate(b.returnDateTime)}</span>
          </div>
          <div class="t-item">
            <label>Handover Hub</label>
            <span>${b.pickupLocation}</span>
          </div>
          <div class="t-item">
            <label>Driver Mode</label>
            <span>${b.driverOption === 'agency' ? 'Agency Chauffeur (' + (b.assignedDriverName || 'Assigned') + ')' : 'Self-Drive Verified'}</span>
          </div>
          <div class="t-item">
            <label>KYC ID / License</label>
            <span>${b.kycDocId} / ${b.licenseNo}</span>
          </div>
          <div class="t-item">
            <label>Security Deposit</label>
            <span style="color: var(--emerald-600);">$${b.securityDeposit.toFixed(2)} (Refundable)</span>
          </div>
        </div>
      </div>

      <div class="ticket-stub">
        <div>
          <span style="font-size: 0.7rem; color: var(--slate-400); text-transform: uppercase; font-weight: 700;">Digital Boarding ID</span>
          <div class="stub-booking-id">${b.bookingId}</div>
        </div>
        <div class="stub-qr"></div>
        <div>
          <span style="font-size: 0.7rem; color: var(--slate-400);">Total Paid</span>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--slate-900);">$${b.totalPaid.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------------
// WORKFLOW 4: Active Ride Status, Cancellation & Time-Based Refund (View_Ride_Status)
// ------------------------------------------------------------------------------

let currentRideFilter = 'ALL';

function filterRides(status) {
  currentRideFilter = status;
  const tabs = document.querySelectorAll('.status-tab');
  tabs.forEach(t => {
    if (t.textContent.includes(status) || (status === 'ALL' && t.textContent.includes('All'))) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });
  View_Ride_Status();
}

function View_Ride_Status() {
  if (!currentUser) return;
  const allBookings = getDB('carx_bookings', []);
  const myBookings = allBookings.filter(b => b.customerId === currentUser.id);
  const container = document.getElementById('rides-list-container');
  if (!container) return;

  const filtered = myBookings.filter(b => {
    if (currentRideFilter === 'ALL') return true;
    return b.bookingStatus === currentRideFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--slate-700);">No reservations in this status category</p>
        <p style="font-size: 0.85rem; color: var(--slate-400); margin-top: 0.25rem;">Browse our available vehicles to schedule your next adventure.</p>
        <button type="button" class="btn-primary mt-3" onclick="openCustomerWorkflow('vehicles')">Browse Vehicles</button>
      </div>
    `;
    return;
  }

  const vehicles = getDB('carx_vehicles', []);

  container.innerHTML = filtered.map(b => {
    const v = vehicles.find(item => item.id === b.vehicleId) || { image: '' };
    const isActive = b.bookingStatus === 'Active';
    const isCompleted = b.bookingStatus === 'Completed';
    const isCancelled = b.bookingStatus === 'Cancelled';

    let badgeClass = 'badge-available';
    if (isCompleted) badgeClass = 'badge-completed';
    if (isCancelled) badgeClass = 'badge-cancelled';

    const pDate = new Date(b.pickupDateTime).toLocaleString();
    const rDate = new Date(b.returnDateTime).toLocaleString();

    return `
      <div class="ride-card">
        <img class="ride-car-thumb" src="${v.image}" alt="${b.vehicleModel}" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'">
        
        <div class="ride-details">
          <div class="ride-top-meta">
            <span class="booking-code">${b.bookingId}</span>
            <span class="badge ${badgeClass}">${b.bookingStatus}</span>
            <span style="font-size: 0.775rem; color: var(--slate-400);">${b.agencyName}</span>
          </div>

          <h3 class="ride-car-title">${b.vehicleModel}</h3>
          
          <div class="ride-itinerary">
            <div><strong>Pickup:</strong> ${pDate} at ${b.pickupLocation}</div>
            <div><strong>Return:</strong> ${rDate} (${b.rentalDays} Days)</div>
            <div><strong>Driver:</strong> ${b.driverOption === 'agency' ? (b.assignedDriverName || 'Agency Driver') : 'Self-Drive'} | <strong>Paid:</strong> $${b.totalPaid.toFixed(2)}</div>
          </div>
        </div>

        <div class="ride-actions">
          <button type="button" class="btn-secondary" onclick="viewExistingTicket('${b.bookingId}')">
            🖨️ View / Print Ticket
          </button>
          
          ${isActive ? `
            <button type="button" class="btn-primary" onclick="markRideReturned('${b.bookingId}')">
              Mark Ride Returned
            </button>
            <button type="button" class="btn-danger" onclick="navigateToCancelRide('${b.bookingId}')">
              Cancel Ride & Refund
            </button>
          ` : ''}

          ${isCompleted ? `
            <button type="button" class="btn-outline" onclick="navigateToReviewRide('${b.bookingId}')">
              ★ Write Review
            </button>
          ` : ''}

          ${isCancelled ? `
            <span style="font-size: 0.75rem; color: var(--rose-600); font-weight: 700;">
              Refund: $${b.cancellationDetails ? b.cancellationDetails.netRefundAmount.toFixed(2) : 'Processed'}
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function viewExistingTicket(bookingId) {
  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  renderPrintableTicket(b);
  openModal('modal-booking-ticket');
}

function markRideReturned(bookingId) {
  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  if (confirm(`Confirm return of vehicle ${b.vehicleModel} for Booking ${b.bookingId}? Refundable security deposit ($${b.securityDeposit.toFixed(2)}) will be credited to customer.`)) {
    // 1. Mark booking completed
    b.bookingStatus = 'Completed';
    setDB('carx_bookings', bookings);

    // 2. Reset vehicle status back to Available
    const vehicles = getDB('carx_vehicles', []);
    const v = vehicles.find(item => item.id === b.vehicleId);
    if (v) {
      v.status = 'Available';
      setDB('carx_vehicles', vehicles);
    }

    // 3. Free driver if assigned
    if (b.assignedDriverId) {
      const drivers = getDB('carx_drivers', []);
      const d = drivers.find(item => item.id === b.assignedDriverId);
      if (d) {
        d.status = 'Available';
        d.assignedBookingId = null;
        setDB('carx_drivers', drivers);
      }
    }

    showToast(
      'Ride Returned Successfully',
      `Deposit of $${b.securityDeposit.toFixed(2)} refunded. Vehicle ${b.vehicleRc} marked Available. Please leave a review!`,
      'success'
    );

    View_Ride_Status();
    updateActiveRidesCounter();

    // Prompt user to write feedback
    setTimeout(() => {
      openCustomerWorkflow('feedback');
    }, 1200);
  }
}

function updateActiveRidesCounter() {
  if (!currentUser) return;
  const bookings = getDB('carx_bookings', []);
  const activeCount = bookings.filter(b => b.customerId === currentUser.id && b.bookingStatus === 'Active').length;
  const badge = document.getElementById('active-rides-counter');
  if (badge) badge.textContent = activeCount;
}

// ------------------------------------------------------------------------------
// CANCELLATION & TIME-BASED REFUND SYSTEM (Cancel Ride Page)
// ------------------------------------------------------------------------------

function Cancel_Ride_Page() {
  openCustomerWorkflow('cancellation');
}

function Cancel_Ride(bookingId) {
  navigateToCancelRide(bookingId);
}

function navigateToCancelRide(bookingId) {
  openCustomerWorkflow('cancellation');
  const select = document.getElementById('cancel-booking-select');
  if (select) {
    select.value = bookingId;
    onCancelBookingSelected();
  }
}

function initCancellationPage() {
  if (!currentUser) return;
  const bookings = getDB('carx_bookings', []);
  const activeBookings = bookings.filter(b => b.customerId === currentUser.id && b.bookingStatus === 'Active');
  
  const select = document.getElementById('cancel-booking-select');
  select.innerHTML = '<option value="">-- Choose Active Booking ID --</option>';

  activeBookings.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.bookingId;
    opt.textContent = `${b.bookingId} - ${b.vehicleModel} (${b.vehicleRc})`;
    select.appendChild(opt);
  });

  document.getElementById('cancellation-ack-card').innerHTML = `
    <div class="ack-placeholder">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
      <p>When you authorize a cancellation, the formal <strong>Cancellation Acknowledgement Receipt</strong> will be generated here and logged to the Main Database.</p>
    </div>
  `;

  document.getElementById('assessment-empty').classList.remove('hidden');
  document.getElementById('assessment-details').classList.add('hidden');
  document.getElementById('btn-confirm-cancel').disabled = true;

  if (activeBookings.length > 0) {
    select.value = activeBookings[0].bookingId;
    onCancelBookingSelected();
  }
}

function simulateTimeRemaining(hours) {
  simulatedRemainingHours = hours;
  onCancelBookingSelected();
  if (hours !== null) {
    showToast('Simulation Applied', `Tested scenario: ${hours} hours before pickup. Dynamic refund updated.`, 'info');
  } else {
    showToast('Real Time Restored', 'Calculated using actual system clock.', 'info');
  }
}

function onCancelBookingSelected() {
  const select = document.getElementById('cancel-booking-select');
  const bookingId = select.value;
  const emptyBox = document.getElementById('assessment-empty');
  const detailsBox = document.getElementById('assessment-details');
  const btnConfirm = document.getElementById('btn-confirm-cancel');

  if (!bookingId) {
    emptyBox.classList.remove('hidden');
    detailsBox.classList.add('hidden');
    btnConfirm.disabled = true;
    return;
  }

  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  // Calculate hours remaining before pickup
  const pickupTime = new Date(b.pickupDateTime).getTime();
  const currentTime = Date.now();
  
  let hoursRemaining = (pickupTime - currentTime) / (3600 * 1000);
  if (simulatedRemainingHours !== null) {
    hoursRemaining = simulatedRemainingHours;
  }

  // Determine Refund Tier:
  // >24 hours: 90% refund (10% deduction)
  // 6 - 24 hours: 50% refund (50% deduction)
  // <6 hours: 20% refund (80% deduction)
  let tierName = '';
  let refundPercent = 0;
  let deductionPercent = 0;
  let tierBadgeClass = '';

  if (hoursRemaining > 24) {
    tierName = 'Tier 1 (>24 Hours Before Pickup)';
    refundPercent = 90;
    deductionPercent = 10;
    tierBadgeClass = 'badge-available';
  } else if (hoursRemaining >= 6 && hoursRemaining <= 24) {
    tierName = 'Tier 2 (6 to 24 Hours Before Pickup)';
    refundPercent = 50;
    deductionPercent = 50;
    tierBadgeClass = 'badge-booked';
  } else {
    tierName = 'Tier 3 (<6 Hours Before Pickup)';
    refundPercent = 20;
    deductionPercent = 80;
    tierBadgeClass = 'badge-cancelled';
  }

  // Calculation: Refund applies to rental fare; security deposit is always 100% refunded
  const rentalFarePaid = b.totalPaid - b.securityDeposit;
  const deductionAmount = parseFloat((rentalFarePaid * (deductionPercent / 100)).toFixed(2));
  const fareRefund = parseFloat((rentalFarePaid - deductionAmount).toFixed(2));
  const netRefund = parseFloat((fareRefund + b.securityDeposit).toFixed(2));

  emptyBox.classList.add('hidden');
  detailsBox.classList.remove('hidden');
  btnConfirm.disabled = false;

  detailsBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
      <span class="badge ${tierBadgeClass}">${tierName}</span>
      <span style="font-family: monospace; font-size: 0.8rem; font-weight: 700; color: var(--slate-700);">
        ${hoursRemaining >= 0 ? hoursRemaining.toFixed(1) + ' hrs to pickup' : 'Trip in-progress'}
      </span>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem;">
      <div style="display: flex; justify-content: space-between;">
        <span style="color: var(--slate-500);">Gross Amount Paid:</span>
        <strong>$${b.totalPaid.toFixed(2)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: var(--slate-500);">Rental Fare:</span>
        <span>$${rentalFarePaid.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; color: var(--rose-600);">
        <span>Short Notice Retention (${deductionPercent}%):</span>
        <strong>-$${deductionAmount.toFixed(2)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; color: var(--emerald-600);">
        <span>Security Deposit (100% Refundable):</span>
        <strong>+$${b.securityDeposit.toFixed(2)}</strong>
      </div>
      <div style="border-top: 1px dashed var(--slate-300); margin: 0.35rem 0;"></div>
      <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 800;">
        <span style="color: var(--slate-900);">Net Refund to Original Payment:</span>
        <span style="color: var(--emerald-600);">$${netRefund.toFixed(2)}</span>
      </div>
    </div>
  `;

  // Attach calculation payload to button for execution
  btnConfirm.dataset.bookingId = b.bookingId;
  btnConfirm.dataset.tier = tierName;
  btnConfirm.dataset.deductionPercent = deductionPercent;
  btnConfirm.dataset.deductionAmount = deductionAmount;
  btnConfirm.dataset.netRefund = netRefund;
  btnConfirm.dataset.hours = hoursRemaining.toFixed(1);
}

function executeCancellation() {
  const btn = document.getElementById('btn-confirm-cancel');
  const bookingId = btn.dataset.bookingId;
  if (!bookingId) return;

  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  const netRefund = parseFloat(btn.dataset.netRefund);
  const deductionAmount = parseFloat(btn.dataset.deductionAmount);
  const tier = btn.dataset.tier;
  const hours = btn.dataset.hours;
  const cancelTimestamp = new Date().toISOString();

  // 1. Update Booking state
  b.bookingStatus = 'Cancelled';
  b.paymentStatus = 'Refunded';
  b.cancellationDetails = {
    cancelledAt: cancelTimestamp,
    hoursBeforePickup: hours,
    tier,
    deductionPercentage: btn.dataset.deductionPercent,
    deductionFee: deductionAmount,
    netRefundAmount: netRefund,
    refundStatus: 'Credited to Original Source'
  };
  setDB('carx_bookings', bookings);

  // 2. Automatically Reset Vehicle Status in Main Database back to Available
  const vehicles = getDB('carx_vehicles', []);
  const v = vehicles.find(item => item.id === b.vehicleId);
  if (v) {
    v.status = 'Available';
    setDB('carx_vehicles', vehicles);
  }

  // 3. Free driver if assigned
  if (b.assignedDriverId) {
    const drivers = getDB('carx_drivers', []);
    const d = drivers.find(item => item.id === b.assignedDriverId);
    if (d) {
      d.status = 'Available';
      d.assignedBookingId = null;
      setDB('carx_drivers', drivers);
    }
  }

  // 4. Notify Agency Manager in Main Database
  const notifs = getDB('carx_notifications', []);
  notifs.unshift({
    id: 'notif_cancel_' + Date.now(),
    targetAgencyId: b.agencyId,
    title: `Booking Cancelled & Vehicle Restored: ${b.bookingId}`,
    message: `Customer ${b.customerName} cancelled reservation for ${b.vehicleModel} (${b.vehicleRc}). Net refund of $${netRefund.toFixed(2)} authorized. Vehicle is now Available.`,
    timestamp: cancelTimestamp,
    read: false
  });
  setDB('carx_notifications', notifs);

  // 5. Render Separate Cancellation Acknowledgement Card
  const ackContainer = document.getElementById('cancellation-ack-card');
  ackContainer.innerHTML = `
    <div class="cancellation-receipt-rendered">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h4 class="ack-title">Cancellation Acknowledgement</h4>
          <span style="font-size: 0.75rem; color: var(--rose-600); font-weight: 700; text-transform: uppercase;">Reference: CARX-CNCL-${b.bookingId.split('-')[2]}</span>
        </div>
        <span class="badge badge-cancelled">Refund Initiated</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; font-size: 0.85rem;">
        <div>
          <label style="font-size: 0.7rem; color: var(--slate-500); text-transform: uppercase; font-weight: 700;">Booking ID</label>
          <div style="font-family: monospace; font-weight: 700;">${b.bookingId}</div>
        </div>
        <div>
          <label style="font-size: 0.7rem; color: var(--slate-500); text-transform: uppercase; font-weight: 700;">Cancellation Time</label>
          <div>${new Date(cancelTimestamp).toLocaleTimeString()}</div>
        </div>
        <div>
          <label style="font-size: 0.7rem; color: var(--slate-500); text-transform: uppercase; font-weight: 700;">Applied Tier</label>
          <div style="font-weight: 600;">${tier}</div>
        </div>
        <div>
          <label style="font-size: 0.7rem; color: var(--slate-500); text-transform: uppercase; font-weight: 700;">Vehicle Status</label>
          <div style="color: var(--emerald-600); font-weight: 700;">Restored to Available</div>
        </div>
      </div>

      <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--rose-200); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; color: var(--slate-800);">Net Refund Credited:</span>
        <span style="font-size: 1.4rem; font-weight: 800; color: var(--emerald-600);">$${netRefund.toFixed(2)}</span>
      </div>
      <p style="font-size: 0.725rem; color: var(--slate-500); margin-top: 0.5rem;">The refund has been queued to your original payment method. Agency Manager has been notified automatically.</p>
    </div>
  `;

  showToast(
    'Cancellation Authorized',
    `Booking ${bookingId} cancelled. Refund of $${netRefund.toFixed(2)} initiated. Vehicle restored to Available.`,
    'success'
  );

  updateActiveRidesCounter();
  View_Vehicle_List();
}

// ------------------------------------------------------------------------------
// WORKFLOW 5: Reviews & Feedback System (Feedback)
// ------------------------------------------------------------------------------

let selectedStarRating = 5;

function initFeedbackPage() {
  if (!currentUser) return;
  const bookings = getDB('carx_bookings', []);
  const completed = bookings.filter(b => b.customerId === currentUser.id && b.bookingStatus === 'Completed');

  const select = document.getElementById('feedback-booking-select');
  select.innerHTML = '<option value="">-- Select Completed Ride --</option>';

  completed.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.bookingId;
    opt.textContent = `${b.bookingId} - ${b.vehicleModel} (${b.vehicleRc})`;
    select.appendChild(opt);
  });

  if (completed.length > 0) {
    select.value = completed[0].bookingId;
    onFeedbackBookingSelected();
  }

  setRating(5);
  renderCustomerReviewsFeed();
}

function navigateToReviewRide(bookingId) {
  openCustomerWorkflow('feedback');
  const select = document.getElementById('feedback-booking-select');
  if (select) {
    select.value = bookingId;
    onFeedbackBookingSelected();
  }
}

function onFeedbackBookingSelected() {
  const select = document.getElementById('feedback-booking-select');
  const bookingId = select.value;
  const metaBox = document.getElementById('feedback-ride-meta');

  if (!bookingId) {
    metaBox.classList.add('hidden');
    return;
  }

  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  metaBox.classList.remove('hidden');
  metaBox.innerHTML = `
    <div style="background: var(--blue-50); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--blue-100); font-size: 0.85rem;">
      <strong>Reviewing Vehicle:</strong> ${b.vehicleModel} (${b.vehicleRc}) | <strong>Agency:</strong> ${b.agencyName}
    </div>
  `;
}

function setRating(val) {
  selectedStarRating = val;
  const stars = document.querySelectorAll('#star-rating-stars .star');
  stars.forEach(s => {
    const sVal = parseInt(s.dataset.val, 10);
    if (sVal <= val) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  const textMap = {
    1: '1 Star - Needs Substantial Improvement',
    2: '2 Stars - Below Expectations',
    3: '3 Stars - Acceptable Service',
    4: '4 Stars - Great Experience',
    5: '5 Stars - Exceptional Experience'
  };
  document.getElementById('rating-text').textContent = textMap[val] || '';
}

function Feedback() {
  const select = document.getElementById('feedback-booking-select');
  const bookingId = select.value;

  if (!bookingId) {
    showToast('Selection Required', 'Please select a completed ride to review.', 'error');
    return;
  }

  const comments = document.getElementById('fb-comments').value.trim();
  if (!comments) {
    showToast('Feedback Required', 'Please write a brief comment describing your experience.', 'error');
    document.getElementById('fb-comments').focus();
    return;
  }

  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  const condition = document.getElementById('fb-vehicle-condition').value;
  const service = document.getElementById('fb-agency-service').value;

  const newReview = {
    reviewId: 'rev_' + Date.now(),
    bookingId: b.bookingId,
    vehicleId: b.vehicleId,
    vehicleModel: b.vehicleModel,
    vehicleRc: b.vehicleRc,
    agencyId: b.agencyId,
    authorName: currentUser.name,
    rating: selectedStarRating,
    condition,
    service,
    comment: comments,
    createdAt: new Date().toISOString()
  };

  // 1. Save Review to Main Database (localStorage)
  const reviews = getDB('carx_reviews', []);
  reviews.unshift(newReview);
  setDB('carx_reviews', reviews);

  // 2. Dynamically Recalculate Vehicle's Average Rating
  const vehicles = getDB('carx_vehicles', []);
  const vIndex = vehicles.findIndex(v => v.id === b.vehicleId);
  if (vIndex !== -1) {
    const vehicleReviews = reviews.filter(r => r.vehicleId === b.vehicleId);
    const sumRatings = vehicleReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sumRatings / vehicleReviews.length).toFixed(1));

    vehicles[vIndex].rating = avg;
    vehicles[vIndex].reviewCount = vehicleReviews.length;
    setDB('carx_vehicles', vehicles);
  }

  // 3. Dynamically Recalculate Agency's Average Rating
  const agencies = getDB('carx_agencies', []);
  const agIndex = agencies.findIndex(a => a.id === b.agencyId);
  if (agIndex !== -1) {
    const agencyReviews = reviews.filter(r => r.agencyId === b.agencyId);
    const sumRatings = agencyReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sumRatings / agencyReviews.length).toFixed(1));

    agencies[agIndex].rating = avg;
    agencies[agIndex].totalReviews = agencyReviews.length;
    setDB('carx_agencies', agencies);
  }

  showToast(
    'Review Submitted',
    `Thank you! Vehicle and Agency ratings dynamically updated in the Main Database.`,
    'success'
  );

  document.getElementById('fb-comments').value = '';
  renderCustomerReviewsFeed();
  View_Vehicle_List();
}

function renderCustomerReviewsFeed() {
  const reviews = getDB('carx_reviews', []);
  const feed = document.getElementById('customer-reviews-feed');
  if (!feed) return;

  if (reviews.length === 0) {
    feed.innerHTML = '<p class="text-muted">No reviews submitted yet.</p>';
    return;
  }

  feed.innerHTML = reviews.map(r => `
    <div class="review-item-card">
      <div class="review-top">
        <span class="review-author">${r.authorName}</span>
        <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <div style="font-size: 0.775rem; color: var(--slate-500); margin-bottom: 0.35rem;">
        ${r.vehicleModel} (${r.vehicleRc})
      </div>
      <p class="review-body">${r.comment}</p>
      <div class="review-tags">
        <span class="review-tag">Condition: ${r.condition.split(' - ')[0]}</span>
        <span class="review-tag">Service: ${r.service.split(' - ')[0]}</span>
      </div>
    </div>
  `).join('');
}

// ==============================================================================
// 5. AGENCY MANAGER PORTAL (FLEET, DRIVERS, BOOKINGS, FEEDBACK)
// ==============================================================================

function renderAgencyDashboard() {
  if (!currentUser || currentUser.role !== 'agency') return;

  const agencyId = currentUser.agencyId || 'agency_apex';
  const agencies = getDB('carx_agencies', []);
  const agency = agencies.find(a => a.id === agencyId) || { name: 'Apex Velocity Rentals', rating: 4.8 };

  document.getElementById('agency-welcome-title').textContent = `${agency.name} Command`;
  document.getElementById('agency-welcome-sub').textContent = `Operating Hub: ${agency.hub || 'Metro Operational Center'} | Certified Fleets & Bookings`;

  Agency_Feedback();
  renderAgencyFleetTable();
  renderAgencyDriversTable();
  renderAgencyBookingsTable();
  View_Feedback();
}

function switchAgencyTab(tabKey) {
  const tabs = document.querySelectorAll('.agency-tab');
  tabs.forEach(t => {
    if (t.dataset.tab === tabKey) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const panels = {
    fleet: document.getElementById('agency-panel-fleet'),
    drivers: document.getElementById('agency-panel-drivers'),
    bookings: document.getElementById('agency-panel-bookings'),
    reviews: document.getElementById('agency-panel-reviews')
  };

  Object.keys(panels).forEach(key => {
    if (key === tabKey) {
      panels[key].classList.remove('hidden');
    } else {
      panels[key].classList.add('hidden');
    }
  });

  if (tabKey === 'fleet') renderAgencyFleetTable();
  if (tabKey === 'drivers') renderAgencyDriversTable();
  if (tabKey === 'bookings') renderAgencyBookingsTable();
  if (tabKey === 'reviews') View_Feedback();
}

// ------------------------------------------------------------------------------
// PANEL 1: Fleet Management (Add_Vehicles & Update_Vehicles)
// ------------------------------------------------------------------------------

function renderAgencyFleetTable() {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const vehicles = getDB('carx_vehicles', []).filter(v => v.agencyId === agencyId);
  const tbody = document.getElementById('agency-fleet-tbody');
  if (!tbody) return;

  const search = (document.getElementById('agency-fleet-search').value || '').trim().toLowerCase();
  const filtered = vehicles.filter(v => {
    if (!search) return true;
    return v.model.toLowerCase().includes(search) || v.rcNo.toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--slate-400); padding: 2rem;">No vehicles found for this fleet.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    let badgeClass = 'badge-available';
    if (v.status === 'Booked') badgeClass = 'badge-booked';
    if (v.status === 'Maintenance') badgeClass = 'badge-maintenance';

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${v.image}" style="width: 44px; height: 32px; border-radius: 4px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'">
            <div>
              <strong style="color: var(--slate-900); font-size: 0.9rem;">${v.model}</strong>
              <div style="font-size: 0.75rem; color: var(--slate-500);">${v.fuel} | ${v.transmission}</div>
            </div>
          </div>
        </td>
        <td><span style="font-family: monospace; font-weight: 700;">${v.rcNo}</span></td>
        <td><span class="badge badge-verified">${v.category}</span></td>
        <td><strong style="color: var(--blue-600);">$${v.dailyRate}</strong> / day</td>
        <td><strong style="color: #b45309;">★ ${v.rating}</strong></td>
        <td>
          <select style="padding: 2px 6px; font-size: 0.75rem; width: auto;" onchange="Update_Vehicles('${v.id}', { status: this.value })">
            <option value="Available" ${v.status === 'Available' ? 'selected' : ''}>Available</option>
            <option value="Booked" ${v.status === 'Booked' ? 'selected' : ''}>Booked</option>
            <option value="Maintenance" ${v.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
          </select>
        </td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="btn-table-sm" onclick="openEditVehicleModal('${v.id}')">Edit Rate</button>
            <button type="button" class="btn-table-sm" style="color: var(--rose-600);" onclick="deleteVehicle('${v.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddVehicleModal() {
  document.getElementById('veh-modal-title').textContent = 'Add Vehicle to Fleet (Add_Vehicles)';
  document.getElementById('mv-id').value = '';
  document.getElementById('mv-model').value = '';
  document.getElementById('mv-rc').value = '';
  document.getElementById('mv-rate').value = 60;
  document.getElementById('mv-category').value = 'SUV';
  document.getElementById('mv-status').value = 'Available';
  document.getElementById('btn-save-vehicle').textContent = 'Save Vehicle to Main Database';

  openModal('modal-vehicle-form');
}

function openEditVehicleModal(vehicleId) {
  const vehicles = getDB('carx_vehicles', []);
  const v = vehicles.find(item => item.id === vehicleId);
  if (!v) return;

  document.getElementById('veh-modal-title').textContent = 'Edit Vehicle Rate & Info (Update_Vehicles)';
  document.getElementById('mv-id').value = v.id;
  document.getElementById('mv-model').value = v.model;
  document.getElementById('mv-rc').value = v.rcNo;
  document.getElementById('mv-rate').value = v.dailyRate;
  document.getElementById('mv-category').value = v.category;
  document.getElementById('mv-fuel').value = v.fuel;
  document.getElementById('mv-trans').value = v.transmission;
  document.getElementById('mv-seats').value = v.seats;
  document.getElementById('mv-status').value = v.status;
  document.getElementById('mv-image').value = v.image;
  document.getElementById('btn-save-vehicle').textContent = 'Update Vehicle in Database';

  openModal('modal-vehicle-form');
}

function handleSaveVehicle(e) {
  e.preventDefault();
  const id = document.getElementById('mv-id').value;
  const model = document.getElementById('mv-model').value.trim();
  const rcNo = document.getElementById('mv-rc').value.trim().toUpperCase();
  const category = document.getElementById('mv-category').value;
  const dailyRate = parseFloat(document.getElementById('mv-rate').value);
  const fuel = document.getElementById('mv-fuel').value;
  const transmission = document.getElementById('mv-trans').value;
  const seats = parseInt(document.getElementById('mv-seats').value, 10);
  const status = document.getElementById('mv-status').value;
  const image = document.getElementById('mv-image').value.trim() || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  if (!id) {
    // Add_Vehicles
    Add_Vehicles({
      model,
      rcNo,
      category,
      dailyRate,
      fuel,
      transmission,
      seats,
      status,
      image
    });
  } else {
    // Update_Vehicles
    Update_Vehicles(id, {
      model,
      rcNo,
      category,
      dailyRate,
      fuel,
      transmission,
      seats,
      status,
      image
    });
  }

  closeModal('modal-vehicle-form');
}

function Add_Vehicles(data) {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const agencies = getDB('carx_agencies', []);
  const ag = agencies.find(a => a.id === agencyId) || { name: 'Apex Velocity Rentals' };

  const vehicles = getDB('carx_vehicles', []);
  const newVehicle = {
    id: 'veh_' + Date.now(),
    agencyId,
    agencyName: ag.name,
    rating: 5.0,
    reviewCount: 0,
    description: `${data.model} managed by ${ag.name}.`,
    ...data
  };

  vehicles.push(newVehicle);
  setDB('carx_vehicles', vehicles);

  showToast('Vehicle Added (Add_Vehicles)', `${data.model} (${data.rcNo}) saved to fleet database.`, 'success');
  renderAgencyFleetTable();
  Agency_Feedback();
}

function Update_Vehicles(vehicleId, updates) {
  const vehicles = getDB('carx_vehicles', []);
  const index = vehicles.findIndex(v => v.id === vehicleId);
  if (index === -1) return;

  vehicles[index] = { ...vehicles[index], ...updates };
  setDB('carx_vehicles', vehicles);

  showToast('Fleet Updated (Update_Vehicles)', `Changes for ${vehicles[index].model} persisted to database.`, 'info');
  renderAgencyFleetTable();
}

function deleteVehicle(vehicleId) {
  if (confirm('Delete this vehicle from your agency fleet in the Main Database?')) {
    let vehicles = getDB('carx_vehicles', []);
    vehicles = vehicles.filter(v => v.id !== vehicleId);
    setDB('carx_vehicles', vehicles);

    showToast('Vehicle Removed', 'Vehicle purged from database.', 'info');
    renderAgencyFleetTable();
    Agency_Feedback();
  }
}

// ------------------------------------------------------------------------------
// PANEL 2: Driver Management (Add_Drivers & Update_Drivers)
// ------------------------------------------------------------------------------

function renderAgencyDriversTable() {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const drivers = getDB('carx_drivers', []).filter(d => d.agencyId === agencyId);
  const tbody = document.getElementById('agency-drivers-tbody');
  if (!tbody) return;

  if (drivers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--slate-400); padding: 2rem;">No drivers registered under this agency.</td></tr>`;
    return;
  }

  tbody.innerHTML = drivers.map(d => `
    <tr>
      <td><strong style="color: var(--slate-900);">${d.name}</strong></td>
      <td><span style="font-family: monospace;">${d.licenseNo}</span></td>
      <td>${d.phone}</td>
      <td>
        <select style="padding: 2px 6px; font-size: 0.75rem; width: auto;" onchange="Update_Drivers('${d.id}', { status: this.value })">
          <option value="Available" ${d.status === 'Available' ? 'selected' : ''}>Available</option>
          <option value="Assigned" ${d.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
          <option value="Off-Duty" ${d.status === 'Off-Duty' ? 'selected' : ''}>Off-Duty</option>
        </select>
      </td>
      <td>${d.assignedBookingId ? `<span class="badge badge-verified">${d.assignedBookingId}</span>` : '<span style="color: var(--slate-400);">None</span>'}</td>
      <td>
        <button type="button" class="btn-table-sm" style="color: var(--rose-600);" onclick="deleteDriver('${d.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddDriverModal() {
  document.getElementById('md-name').value = '';
  document.getElementById('md-license').value = '';
  document.getElementById('md-phone').value = '';
  document.getElementById('md-status').value = 'Available';

  openModal('modal-driver-form');
}

function handleSaveDriver(e) {
  e.preventDefault();
  const name = document.getElementById('md-name').value.trim();
  const licenseNo = document.getElementById('md-license').value.trim();
  const phone = document.getElementById('md-phone').value.trim();
  const status = document.getElementById('md-status').value;

  Add_Drivers({ name, licenseNo, phone, status });
  closeModal('modal-driver-form');
}

function Add_Drivers(data) {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const drivers = getDB('carx_drivers', []);

  const newDriver = {
    id: 'drv_' + Date.now(),
    agencyId,
    assignedBookingId: null,
    rating: 5.0,
    ...data
  };

  drivers.push(newDriver);
  setDB('carx_drivers', drivers);

  showToast('Driver Registered (Add_Drivers)', `${data.name} added to agency roster.`, 'success');
  renderAgencyDriversTable();
}

function Update_Drivers(driverId, updates) {
  const drivers = getDB('carx_drivers', []);
  const index = drivers.findIndex(d => d.id === driverId);
  if (index === -1) return;

  drivers[index] = { ...drivers[index], ...updates };
  setDB('carx_drivers', drivers);

  showToast('Driver Updated (Update_Drivers)', `Status changed for ${drivers[index].name}.`, 'info');
  renderAgencyDriversTable();
}

function deleteDriver(driverId) {
  if (confirm('Remove this driver from the agency roster?')) {
    let drivers = getDB('carx_drivers', []);
    drivers = drivers.filter(d => d.id !== driverId);
    setDB('carx_drivers', drivers);

    showToast('Driver Removed', 'Roster updated in database.', 'info');
    renderAgencyDriversTable();
  }
}

// ------------------------------------------------------------------------------
// PANEL 3: Bookings, Acknowledgements & Refund Monitor
// ------------------------------------------------------------------------------

function renderAgencyBookingsTable() {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const bookings = getDB('carx_bookings', []).filter(b => b.agencyId === agencyId);
  const tbody = document.getElementById('agency-bookings-tbody');
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--slate-400); padding: 2rem;">No incoming reservations logged for this agency.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    let statusBadge = 'badge-available';
    if (b.bookingStatus === 'Completed') statusBadge = 'badge-completed';
    if (b.bookingStatus === 'Cancelled') statusBadge = 'badge-cancelled';

    return `
      <tr>
        <td><strong style="font-family: monospace; color: var(--blue-600);">${b.bookingId}</strong></td>
        <td>
          <div style="font-weight: 700; color: var(--slate-900);">${b.customerName}</div>
          <div style="font-size: 0.75rem; color: var(--slate-500);">${b.customerPhone}</div>
        </td>
        <td>
          <div>${b.vehicleModel}</div>
          <span style="font-family: monospace; font-size: 0.75rem; background: var(--slate-100); padding: 1px 4px; border-radius: 3px;">${b.vehicleRc}</span>
        </td>
        <td style="font-size: 0.8rem;">
          <div>${new Date(b.pickupDateTime).toLocaleDateString()}</div>
          <div style="color: var(--slate-400);">to ${new Date(b.returnDateTime).toLocaleDateString()}</div>
        </td>
        <td><span class="badge ${b.driverOption === 'agency' ? 'badge-verified' : 'badge-available'}">${b.driverOption === 'agency' ? 'Chauffeur' : 'Self-Drive'}</span></td>
        <td><span class="badge badge-verified">✓ Verified</span></td>
        <td>
          <strong>$${b.totalPaid.toFixed(2)}</strong>
          <div style="font-size: 0.75rem; color: ${b.paymentStatus === 'Refunded' ? 'var(--rose-600)' : 'var(--emerald-600)'};">${b.paymentStatus}</div>
        </td>
        <td><span class="badge ${statusBadge}">${b.bookingStatus}</span></td>
        <td>
          <button type="button" class="btn-table-sm" onclick="openContactUserModal('${b.bookingId}')">
            Contact_User
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

let activeContactBooking = null;

function openContactUserModal(bookingId) {
  const bookings = getDB('carx_bookings', []);
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  activeContactBooking = b;
  document.getElementById('contact-cust-name').value = `${b.customerName} (${b.customerPhone})`;
  document.getElementById('contact-booking-id').value = b.bookingId;

  const drivers = getDB('carx_drivers', []).filter(d => d.agencyId === b.agencyId);
  const select = document.getElementById('contact-driver-select');
  select.innerHTML = '<option value="">-- No Driver Assignment (Keys Only) --</option>';

  drivers.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.phone}) [${d.status}]`;
    if (b.assignedDriverId === d.id) opt.selected = true;
    select.appendChild(opt);
  });

  openModal('modal-contact-user');
}

function submitContactUser() {
  if (!activeContactBooking) return;

  const driverSelect = document.getElementById('contact-driver-select');
  const message = document.getElementById('contact-message').value.trim();
  const driverId = driverSelect.value;

  let assignedDriver = null;
  if (driverId) {
    const drivers = getDB('carx_drivers', []);
    assignedDriver = drivers.find(d => d.id === driverId);
  }

  // Notify customer
  const notifs = getDB('carx_notifications', []);
  notifs.unshift({
    id: 'notif_dispatch_' + Date.now(),
    targetUserId: activeContactBooking.customerId,
    title: `Agency Update for ${activeContactBooking.bookingId}`,
    message: `${message} ${assignedDriver ? `Assigned Driver: ${assignedDriver.name} (${assignedDriver.phone})` : ''}`,
    timestamp: new Date().toISOString(),
    read: false
  });
  setDB('carx_notifications', notifs);

  closeModal('modal-contact-user');
  showToast(
    'Contact Transmitted (Contact_User)',
    `Handover instructions and driver assignment transmitted to ${activeContactBooking.customerName}.`,
    'success'
  );
}

// ------------------------------------------------------------------------------
// PANEL 4: Agency Feedback & Ratings (View_Feedback & Agency_Feedback)
// ------------------------------------------------------------------------------

function Agency_Feedback() {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const vehicles = getDB('carx_vehicles', []).filter(v => v.agencyId === agencyId);
  const bookings = getDB('carx_bookings', []).filter(b => b.agencyId === agencyId);
  const reviews = getDB('carx_reviews', []).filter(r => r.agencyId === agencyId);
  const agencies = getDB('carx_agencies', []);
  const ag = agencies.find(a => a.id === agencyId) || { rating: 4.8, totalRevenue: 0 };

  const totalFleet = vehicles.length;
  const activeBookings = bookings.filter(b => b.bookingStatus === 'Active').length;
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.totalPaid, 0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : ag.rating;

  // Update KPI displays
  document.getElementById('kpi-total-fleet').textContent = totalFleet;
  document.getElementById('kpi-active-bookings').textContent = activeBookings;
  document.getElementById('kpi-gross-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
  document.getElementById('kpi-agency-rating').textContent = `${avgRating} / 5.0`;
}

function View_Feedback() {
  const agencyId = currentUser.agencyId || 'agency_apex';
  const reviews = getDB('carx_reviews', []).filter(r => r.agencyId === agencyId);
  const feed = document.getElementById('agency-reviews-feed');
  if (!feed) return;

  if (reviews.length === 0) {
    feed.innerHTML = '<p style="text-align: center; color: var(--slate-400); padding: 2rem;">No customer reviews submitted yet for this fleet.</p>';
    return;
  }

  feed.innerHTML = reviews.map(r => `
    <div class="review-item-card">
      <div class="review-top">
        <span class="review-author">${r.authorName} on Booking ${r.bookingId}</span>
        <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--slate-700); margin-bottom: 0.25rem;">
        ${r.vehicleModel} (RC: ${r.vehicleRc})
      </div>
      <p class="review-body">${r.comment}</p>
      <div class="review-tags">
        <span class="review-tag">Vehicle: ${r.condition}</span>
        <span class="review-tag">Staff: ${r.service}</span>
      </div>
    </div>
  `).join('');
}

// ==============================================================================
// 6. MODAL & TOAST UTILITY HELPERS
// ==============================================================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// Close modal on background click
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});

function showToast(title, message, type = 'info') {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  stack.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 250);
  }, 4200);
}

// Initialize Application on Window DOM Load
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
