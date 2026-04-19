// ========================================
// navbar.js - Shared Navigation Bar
// ========================================
// This file dynamically creates the navbar HTML on every page.
// Include it via <script src="/js/navbar.js"> and call renderNavbar()

// Pre-computed city data for the dropdown
const CITIES = [
  { name: 'Delhi', country: 'India', flag: '🇮🇳' },
  { name: 'New York', country: 'USA', flag: '🇺🇸' },
  { name: 'London', country: 'UK', flag: '🇬🇧' },
  { name: 'Amritsar', country: 'India', flag: '🇮🇳' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { name: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { name: 'Mumbai', country: 'India', flag: '🇮🇳' }
];

// Render the navbar into the element with id="navbar"
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const user = getUser();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Build city dropdown items
  let cityItems = '';
  CITIES.forEach(city => {
    cityItems += `
      <a href="/cities.html?city=${encodeURIComponent(city.name)}" 
         class="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-3">
        <span class="text-lg">${city.flag}</span>
        <span>${city.name}</span>
        <span class="text-xs text-gray-500 ml-auto">${city.country}</span>
      </a>
    `;
  });

  // Auth buttons - show Login/Signup OR user name + Logout
  let authButtons = '';
  if (user) {
    authButtons = `
      <span class="text-cyan-700 dark:text-cyan-400 text-sm px-3 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg border border-cyan-200 dark:border-cyan-500/20">
        👤 ${user.name}
      </span>
      <button onclick="logout()" class="text-pink-600 dark:text-pink-400 text-sm px-3 py-1.5 border border-pink-200 dark:border-pink-500/30 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors">
        Logout
      </button>
    `;
  } else {
    authButtons = `
      <a href="/index.html" class="px-4 py-2 text-sm rounded-lg transition-colors
        ${currentPage === 'index.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5'}">
        Login
      </a>
      <a href="/signup.html" class="px-4 py-2 text-sm rounded-lg transition-colors
        ${currentPage === 'signup.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5'}">
        Signup
      </a>
    `;
  }

  nav.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="${user ? '/predictor.html' : '/index.html'}" class="text-cyan-600 dark:text-cyan-400 font-bold text-xl tracking-wider transition-colors duration-300" style="font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px rgba(0,240,255,0.2);">
          ⚡ EnergyPredict
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          ${user ? `
            <a href="/predictor.html" class="px-4 py-2 text-sm rounded-lg transition-colors
              ${currentPage === 'predictor.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5'}">
              Home
            </a>
          ` : ''}

          <!-- Cities Dropdown -->
          <div class="relative" id="citiesDropdown">
            <button onclick="toggleCitiesDropdown()" class="px-4 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5 transition-colors flex items-center gap-1.5
              ${currentPage === 'cities.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : ''}">
              🏙️ Cities
              <svg class="w-3.5 h-3.5 transition-transform" id="citiesArrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div id="citiesMenu" class="hidden absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-950 border border-gray-200 dark:border-cyan-500/20 rounded-xl shadow-2xl overflow-hidden z-50 transition-colors duration-300" style="animation: slideDown 0.2s ease;">
              <div class="px-4 py-2 text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700/50 transition-colors duration-300" style="font-family: 'Orbitron', sans-serif;">
                Quick City Predictions
              </div>
              ${cityItems}
            </div>
          </div>

          ${user ? `
            <a href="/dashboard.html" class="px-4 py-2 text-sm rounded-lg transition-colors
              ${currentPage === 'dashboard.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5'}">
              Dashboard
            </a>
          ` : ''}

          <a href="/about.html" class="px-4 py-2 text-sm rounded-lg transition-colors
            ${currentPage === 'about.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5'}">
            About
          </a>
          <a href="/contact.html" class="px-4 py-2 text-sm rounded-lg transition-colors
            ${currentPage === 'contact.html' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5'}">
            Contact
          </a>

          <!-- Theme Toggle -->
          <button onclick="toggleTheme()" class="p-2 ml-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/5 rounded-lg transition-colors" title="Toggle Theme">
            <!-- Sun icon for dark mode (switches to light) -->
            <svg class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.41 1.41l-.7.7a1 1 0 01-1.41-1.41l.7-.7zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.22 15.78a1 1 0 01-1.41-1.41l.7-.7a1 1 0 011.41 1.41l-.7.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 01-1.41-1.41l.7-.7a1 1 0 011.41 1.41l-.7.7zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm2.22-4.22a1 1 0 011.41 1.41l-.7.7a1 1 0 01-1.41-1.41l.7-.7zM10 5a5 5 0 100 10 5 5 0 000-10z" clip-rule="evenodd"></path>
            </svg>
            <!-- Moon icon for light mode (switches to dark) -->
            <svg class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          </button>

          <div class="ml-2 flex items-center">
            ${authButtons}
          </div>
        </div>

        <!-- Mobile menu button -->
        <button onclick="toggleMobileMenu()" class="md:hidden text-cyan-600 dark:text-cyan-400 text-2xl">☰</button>
      </div>

      <!-- Mobile Menu -->
      <div id="mobileMenu" class="hidden md:hidden pb-4 border-t border-gray-200 dark:border-gray-700/50 mt-2 pt-4 flex flex-col gap-2">
        ${user ? `<a href="/predictor.html" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-500/5">Home</a>` : ''}
        <a href="/cities.html" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-500/5">🏙️ Cities</a>
        ${user ? `<a href="/dashboard.html" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-500/5">Dashboard</a>` : ''}
        <a href="/about.html" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-500/5">About</a>
        <a href="/contact.html" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-500/5">Contact</a>
        <button onclick="toggleTheme()" class="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-500/5 text-left w-full">
          <span class="hidden dark:inline">☀️ Light Mode</span>
          <span class="inline dark:hidden">🌙 Dark Mode</span>
        </button>
        <div class="flex items-center gap-2 mt-2 px-4">${authButtons}</div>
      </div>
    </div>
  `;
}

// Toggle cities dropdown
function toggleCitiesDropdown() {
  const menu = document.getElementById('citiesMenu');
  const arrow = document.getElementById('citiesArrow');
  menu.classList.toggle('hidden');
  arrow.style.transform = menu.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

// Toggle mobile menu
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('citiesDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const menu = document.getElementById('citiesMenu');
    const arrow = document.getElementById('citiesArrow');
    if (menu && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      if (arrow) arrow.style.transform = '';
    }
  }
});

// Render navbar when page loads
document.addEventListener('DOMContentLoaded', renderNavbar);
