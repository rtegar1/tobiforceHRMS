/**
 * TOBIFORCE GLOBAL ENGINE
 * Mengelola: Menu, Keamanan, Caching, Transisi, dan Logout Premium
 */

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw46s9Pna-Qu3W2EBTkFrFbvkHYmVy_bAIa9Ktz840IvZZTKtuqadURx7kLyhtHvz06Xg/exec";
const GLOBAL_CACHE_KEY = "tobiforce_global_cache";
const CACHE_DURATION = 5 * 60 * 1000; 

// Instance Chart Global
let dashboardCharts = {};

// 1. KONFIGURASI MENU
const menuConfig = [
    { name: "Dashboard", icon: "fa-chart-pie", link: "dashboard.html", roles: ["admin", "staff"] },
    { name: "Database Staff", icon: "fa-users", link: "dataStaff.html", roles: ["admin"] },
    { name: "Laporan", icon: "fa-file-signature", link: "laporan.html", roles: ["admin", "staff"] }
];

// 2. INJEKSI CSS TRANSISI KE DALAM HALAMAN
const style = document.createElement('style');
style.innerHTML = `
    body { opacity: 0; transition: opacity 0.4s ease-in-out; }
    body.loaded { opacity: 1; }
    .nav-item-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
`;
document.head.appendChild(style);

/**
 * DASHBOARD DATA ENGINE
 */
async function getOrFetchData(forceRefresh = false) {
    const cached = localStorage.getItem(GLOBAL_CACHE_KEY);
    const now = Date.now();

    if (!forceRefresh && cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.summary.timestamp < CACHE_DURATION) return parsed;
    }

    try {
        const response = await fetch(`${WEB_APP_URL}?action=getDashboardSummary`);
        const result = await response.json();
        if (result.status === 'sukses') {
            result.summary.timestamp = Date.now();
            localStorage.setItem(GLOBAL_CACHE_KEY, JSON.stringify(result));
            return result;
        }
    } catch (err) {
        return cached ? JSON.parse(cached) : null;
    }
}

function updateDashboardUI(summary) {
    if (!summary) return;
    const elements = {
        'totalStaffCount': summary.total,
        'maleCount': summary.male,
        'femaleCount': summary.female,
        'lastSync': new Date(summary.timestamp).toLocaleTimeString('id-ID')
    };
    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }
    renderGlobalChart('genChart', 'pie', Object.keys(summary.generasi), Object.values(summary.generasi), ['#f97316', '#3b82f6', '#8b5cf6', '#94a3b8']);
    renderGlobalChart('statusChart', 'doughnut', Object.keys(summary.status), Object.values(summary.status), ['#10b981', '#f59e0b', '#ef4444', '#6366f1']);
    renderGlobalChart('jabatanChart', 'bar', Object.keys(summary.jabatan), Object.values(summary.jabatan), '#6366f1');
}

function renderGlobalChart(id, type, labels, data, colors) {
    const canvas = document.getElementById(id);
    if (!canvas || !window.Chart) return;
    if (dashboardCharts[id]) dashboardCharts[id].destroy();
    dashboardCharts[id] = new Chart(canvas.getContext('2d'), {
        type: type,
        data: {
            labels: labels,
            datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

/**
 * RENDER MENU & LOGOUT
 */
function renderDynamicMenu() {
    const navContainer = document.getElementById('dynamicNav');
    if (!navContainer) return;

    const userRole = localStorage.getItem('userRole'); 
    const currentPage = window.location.pathname.split("/").pop();
    
    let menuHTML = "";
    menuConfig.forEach(menu => {
        if (menu.roles.includes(userRole)) {
            const isActive = currentPage === menu.link;
            menuHTML += `
                <a href="${menu.link}" class="nav-item-transition flex items-center space-x-3 p-3 rounded-xl ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}">
                    <i class="fas ${menu.icon} w-5 text-center text-sm"></i>
                    <span class="font-bold text-[13px] tracking-tight">${menu.name}</span>
                </a>`;
        }
    });

    navContainer.innerHTML = `
        <div class="space-y-1">${menuHTML}</div>
        <div class="mt-8 pt-6 border-t border-slate-700/50 px-2">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Account Actions</p>
            <button onclick="logout()" class="nav-item-transition group flex items-center justify-between w-full p-3 rounded-2xl bg-rose-500/5 hover:bg-rose-600 border border-rose-500/10 hover:border-rose-500 shadow-sm transition-all duration-300">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <i class="fas fa-sign-out-alt text-xs text-rose-500 group-hover:text-white"></i>
                    </div>
                    <span class="font-bold text-[13px] text-rose-500 group-hover:text-white transition-colors">LogOut</span>
                </div>
                <i class="fas fa-chevron-right text-[10px] text-rose-500/40 group-hover:text-white"></i>
            </button>
        </div>
    `;
}

window.logout = function() {
    if (confirm("Apakah Anda yakin ingin keluar dari TobiForce?")) { 
        document.body.classList.remove('loaded');
        setTimeout(() => {
            localStorage.clear(); 
            sessionStorage.clear();
            window.location.href = "../index.html"; 
        }, 400);
    }
};

/**
 * KEAMANAN & INITIAL LOAD
 */
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = e => { if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) return false; };

document.addEventListener('DOMContentLoaded', async () => {
    // Jalankan efek fade-in
    setTimeout(() => document.body.classList.add('loaded'), 50);

    renderDynamicMenu();
    
    if (window.location.pathname.includes('dashboard.html')) {
        const data = await getOrFetchData();
        if (data) updateDashboardUI(data.summary);
    }
});