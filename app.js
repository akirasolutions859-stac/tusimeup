/**
 * Tulsi Makeup, Fitness Studio & Nail Art Academy
 * Application Script & State Management Engine
 */

// ==========================================================================
// DEFAULT SEED DATA & SITE CONFIG
// ==========================================================================
const DEFAULT_COURSES = [
    { id: "makeup-1", name: "Basic Makeup (1 Month)", category: "makeup", duration: "1 Month" },
    { id: "makeup-2", name: "Basic to Advanced Makeup (2 Months)", category: "makeup", duration: "2 Months" },
    { id: "nails-1", name: "Basic Nail Art Course", category: "nails", duration: "3 Weeks" },
    { id: "nails-2", name: "Advanced Nail Course", category: "nails", duration: "6 Weeks" },
    { id: "beautician-1", name: "Beautician Course (1.5 Months)", category: "beautician", duration: "1.5 Months" }
];

const DEFAULT_SETTINGS = {
    heroTagline: "LEARN • GLOW • EMPOWER",
    heroTitle: "Tulsi Makeup Studio & Fitness",
    heroDesc: "Launch a highly profitable career in beauty therapies, professional makeup, and advanced nail art. Gain 100% practical training, certifications, and dedicated placement support at Kolkata's leading beauty studio.",
    primaryGold: "#f43f5e",
    secondaryRose: "#e04f80",
    primaryFont: "'Montserrat', sans-serif",
    showFaq: true,
    metaTitle: "Tulsi Makeup, Fitness Studio & Nail Art Academy",
    metaDesc: "Master the art of beauty, makeup, and nail art at Garia, Kolkata's premier academy. Offers expert beautician, basic/advanced makeup, and nail courses."
};

const DEFAULT_BOOKINGS = [
    {
        id: "b-1",
        dateCreated: "2026-07-09T14:32:00.000Z",
        name: "Ananya Sen",
        phone: "9830012345",
        course: "Basic to Advanced Makeup (2 Months)",
        startDate: "2026-08-01",
        notes: "Interested in morning batches.",
        status: "approved"
    },
    {
        id: "b-2",
        dateCreated: "2026-07-10T09:15:00.000Z",
        name: "Debasree Paul",
        phone: "7003418902",
        course: "Advanced Nail Course",
        startDate: "2026-07-25",
        notes: "Do you provide weekend batches?",
        status: "pending"
    }
];

const DEFAULT_MESSAGES = [
    {
        id: "m-1",
        dateCreated: "2026-07-09T16:45:00.000Z",
        name: "Pooja Banerjee",
        phone: "8100345678",
        subject: "Fee Details",
        message: "Hello, could you please email me the detailed course fee breakdown for the Beautician course? Thank you."
    }
];

// ==========================================================================
// CORE STATE CONTROLLER
// ==========================================================================
class AppState {
    constructor() {
        this.settings = this.loadData("tulsi_settings_v4", DEFAULT_SETTINGS);
        this.bookings = this.loadData("tulsi_bookings", DEFAULT_BOOKINGS);
        this.messages = this.loadData("tulsi_messages", DEFAULT_MESSAGES);
        this.theme = localStorage.getItem("tulsi_theme") || "dark";
    }

    loadData(key, fallback) {
        const stored = localStorage.getItem(key);
        if (!stored) {
            this.saveData(key, fallback);
            return JSON.parse(JSON.stringify(fallback));
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return JSON.parse(JSON.stringify(fallback));
        }
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveData("tulsi_settings_v4", this.settings);
        this.applySettingsToDOM();
    }

    addBooking(booking) {
        const newBooking = {
            id: "b-" + Date.now(),
            dateCreated: new Date().toISOString(),
            status: "pending",
            ...booking
        };
        this.bookings.push(newBooking);
        this.saveData("tulsi_bookings", this.bookings);
        return newBooking;
    }

    updateBookingStatus(id, status) {
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
            booking.status = status;
            this.saveData("tulsi_bookings", this.bookings);
        }
    }

    deleteBooking(id) {
        this.bookings = this.bookings.filter(b => b.id !== id);
        this.saveData("tulsi_bookings", this.bookings);
    }

    clearBookings() {
        this.bookings = [];
        this.saveData("tulsi_bookings", this.bookings);
    }

    addMessage(msg) {
        const newMsg = {
            id: "m-" + Date.now(),
            dateCreated: new Date().toISOString(),
            ...msg
        };
        this.messages.push(newMsg);
        this.saveData("tulsi_messages", this.messages);
        return newMsg;
    }

    deleteMessage(id) {
        this.messages = this.messages.filter(m => m.id !== id);
        this.saveData("tulsi_messages", this.messages);
    }

    clearMessages() {
        this.messages = [];
        this.saveData("tulsi_messages", this.messages);
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem("tulsi_theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }

    resetAllData() {
        localStorage.removeItem("tulsi_settings_v4");
        localStorage.removeItem("tulsi_bookings");
        localStorage.removeItem("tulsi_messages");
        
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        this.bookings = JSON.parse(JSON.stringify(DEFAULT_BOOKINGS));
        this.messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
        
        this.saveData("tulsi_settings_v4", this.settings);
        this.saveData("tulsi_bookings", this.bookings);
        this.saveData("tulsi_messages", this.messages);
        
        this.applySettingsToDOM();
    }

    applySettingsToDOM() {
        // Hero CMS elements
        const tagline = document.getElementById("cms-hero-tagline");
        const title = document.getElementById("cms-hero-title");
        const desc = document.getElementById("cms-hero-desc");
        
        if (tagline) tagline.textContent = this.settings.heroTagline;
        if (title) title.textContent = this.settings.heroTitle;
        if (desc) desc.textContent = this.settings.heroDesc;

        // Custom styling variable binding
        document.documentElement.style.setProperty("--primary-gold", this.settings.primaryGold);
        document.documentElement.style.setProperty("--secondary-rose", this.settings.secondaryRose);
        document.documentElement.style.setProperty("--font-body", this.settings.primaryFont);

        // Visibility Toggles
        const faqSection = document.querySelector(".faq-section");
        if (faqSection) {
            faqSection.style.display = this.settings.showFaq ? "block" : "none";
        }

        // SEO tags
        document.title = this.settings.metaTitle;
        const metaDescTag = document.querySelector('meta[name="description"]');
        if (metaDescTag) {
            metaDescTag.setAttribute("content", this.settings.metaDesc);
        }
    }
}

// Instantiate state
const state = new AppState();

// ==========================================================================
// TOAST MESSAGING NOTIFICATION ENGINE
// ==========================================================================
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Auto dismiss
    const dismissTimeout = setTimeout(() => {
        toast.style.animation = "toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards";
        setTimeout(() => toast.remove(), 300);
    }, 4000);

    // Manual close
    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(dismissTimeout);
        toast.remove();
    });
}

// ==========================================================================
// DYNAMIC COMPONENT LOGIC (NAVBAR, TABS, FAQ)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Apply default loaded CMS settings
    state.applySettingsToDOM();
    document.documentElement.setAttribute("data-theme", state.theme);

    // Sticky header class trigger
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Dynamic nav highlight based on scroll position
        const sections = document.querySelectorAll("section[id]");
        let currentSec = "";
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            if (window.scrollY >= secTop) {
                currentSec = sec.getAttribute("id");
            }
        });
        
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSec}`) {
                link.classList.add("active");
            }
        });
    });

    // Mobile nav toggle drawer
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            mobileToggle.classList.toggle("active");
        });

        // Close drawer clicking links
        navMenu.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                mobileToggle.classList.remove("active");
            });
        });
    }

    // Theme toggle switch button
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const nextTheme = state.theme === "dark" ? "light" : "dark";
            state.setTheme(nextTheme);
            showToast(`Theme switched to ${nextTheme} mode.`);
        });
    }

    // Courses section tabs are now statically stacked in fixed positions.

    // Preset course selected via button
    const enrollPresetBtns = document.querySelectorAll(".enroll-btn-preset");
    const courseSelect = document.getElementById("bookingCourse");
    enrollPresetBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const courseName = btn.dataset.course;
            if (courseSelect && courseName) {
                // Find and select the matching option
                for (let i = 0; i < courseSelect.options.length; i++) {
                    if (courseSelect.options[i].value === courseName) {
                        courseSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });

    // FAQ items accordion
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(q => {
        q.addEventListener("click", () => {
            const parent = q.parentElement;
            const isActive = parent.classList.contains("active");
            
            // Close all
            document.querySelectorAll(".faq-item").forEach(item => item.classList.remove("active"));
            
            if (!isActive) {
                parent.classList.add("active");
            }
        });
    });

    // ==========================================================================
    // FORMS SUBMISSION SUB-SYSTEM
    // ==========================================================================
    const bookingForm = document.getElementById("bookingForm");
    const formSuccessOverlay = document.getElementById("formSuccessOverlay");
    const resetBookingBtn = document.getElementById("resetBookingBtn");

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById("bookingName").value,
                phone: document.getElementById("bookingPhone").value,
                course: document.getElementById("bookingCourse").value,
                startDate: document.getElementById("bookingDate").value,
                notes: document.getElementById("bookingMessage").value
            };

            // Save to state
            state.addBooking(data);
            
            // Show custom success screen overlay
            if (formSuccessOverlay) {
                formSuccessOverlay.classList.add("active");
            }
            showToast("Enrollment application submitted!");
            bookingForm.reset();
            
            // Refresh admin tables
            renderBookingsTable();
        });
    }

    if (resetBookingBtn && formSuccessOverlay) {
        resetBookingBtn.addEventListener("click", () => {
            formSuccessOverlay.classList.remove("active");
        });
    }

    const contactForm = document.getElementById("contactForm");
    const contactSuccessOverlay = document.getElementById("contactSuccessOverlay");
    const resetContactBtn = document.getElementById("resetContactBtn");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById("contactName").value,
                phone: document.getElementById("contactPhone").value,
                subject: document.getElementById("contactSubject").value,
                message: document.getElementById("contactMsg").value
            };

            state.addMessage(data);
            
            if (contactSuccessOverlay) {
                contactSuccessOverlay.classList.add("active");
            }
            showToast("Inquiry message sent successfully!");
            contactForm.reset();

            // Refresh admin tables
            renderMessagesTable();
        });
    }

    if (resetContactBtn && contactSuccessOverlay) {
        resetContactBtn.addEventListener("click", () => {
            contactSuccessOverlay.classList.remove("active");
        });
    }

    // ==========================================================================
    // PORTAL ADMIN DASHBOARD MODAL & AUTH
    // ==========================================================================
    const adminPanelBtn = document.getElementById("adminPanelBtn");
    const footerAdminLink = document.getElementById("footerAdminLink");
    const adminModal = document.getElementById("adminModal");
    const adminAuthPanel = document.getElementById("adminAuthPanel");
    const adminMainPanel = document.getElementById("adminMainPanel");
    
    const adminLoginForm = document.getElementById("adminLoginForm");
    const authErrorMsg = document.getElementById("authErrorMsg");
    const closeAdminAuthBtn = document.getElementById("closeAdminAuthBtn");
    const closeAdminMainBtn = document.getElementById("closeAdminMainBtn");

    function openAdminPortal() {
        adminModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Disable background scrolling
        
        // Auto check if already logged in this session
        if (sessionStorage.getItem("tulsi_admin_logged") === "true") {
            showAdminDashboard();
        } else {
            showAdminAuth();
        }
    }

    function closeAdminPortal() {
        adminModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    function showAdminAuth() {
        adminAuthPanel.style.display = "block";
        adminMainPanel.style.display = "none";
        authErrorMsg.style.display = "none";
        adminLoginForm.reset();
    }

    function showAdminDashboard() {
        adminAuthPanel.style.display = "none";
        adminMainPanel.style.display = "flex";
        
        // Pre-fill CMS forms with current state
        fillCmsFormValues();
        renderBookingsTable();
        renderMessagesTable();
    }

    if (adminPanelBtn) adminPanelBtn.addEventListener("click", openAdminPortal);
    if (footerAdminLink) footerAdminLink.addEventListener("click", (e) => { e.preventDefault(); openAdminPortal(); });
    if (closeAdminAuthBtn) closeAdminAuthBtn.addEventListener("click", closeAdminPortal);
    if (closeAdminMainBtn) closeAdminMainBtn.addEventListener("click", closeAdminPortal);

    // Auth submit handler
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const password = document.getElementById("adminPass").value;
            if (password === "admin123") {
                sessionStorage.setItem("tulsi_admin_logged", "true");
                showAdminDashboard();
                showToast("Admin authenticated successfully.");
            } else {
                authErrorMsg.style.display = "block";
            }
        });
    }

    // Admin Sidebar Panel Tabs toggling
    const adminTabBtns = document.querySelectorAll(".admin-tab-btn");
    const adminTabPanels = document.querySelectorAll(".admin-tab-panel");
    
    adminTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            adminTabBtns.forEach(b => b.classList.remove("active"));
            adminTabPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const panelId = "panel-" + btn.dataset.adminTab;
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.classList.add("active");
            }
        });
    });

    // Fill CMS form input structures
    function fillCmsFormValues() {
        // Tab 1 text
        document.getElementById("cmsHeroTaglineInput").value = state.settings.heroTagline;
        document.getElementById("cmsHeroTitleInput").value = state.settings.heroTitle;
        document.getElementById("cmsHeroDescInput").value = state.settings.heroDesc;

        // Tab 4 Styling presets
        document.getElementById("primaryGoldColorPicker").value = state.settings.primaryGold;
        document.querySelector("#primaryGoldColorPicker + .color-picker-hex").textContent = state.settings.primaryGold;
        
        document.getElementById("secondaryRoseColorPicker").value = state.settings.secondaryRose;
        document.querySelector("#secondaryRoseColorPicker + .color-picker-hex").textContent = state.settings.secondaryRose;

        document.getElementById("bodyFontFamilySelect").value = state.settings.primaryFont;
        document.getElementById("faqVisibilityCheckbox").checked = state.settings.showFaq;

        // Tab 5 SEO
        document.getElementById("seoTitleInput").value = state.settings.metaTitle;
        document.getElementById("seoDescInput").value = state.settings.metaDesc;
    }

    // Color picker Hex text updates
    const colorPickers = document.querySelectorAll('.color-picker-wrapper input[type="color"]');
    colorPickers.forEach(picker => {
        picker.addEventListener("input", (e) => {
            const hexSpan = picker.nextElementSibling;
            if (hexSpan) hexSpan.textContent = e.target.value;
        });
    });

    // Reset default academy settings
    const resetCmsDataBtn = document.getElementById("resetCmsDataBtn");
    if (resetCmsDataBtn) {
        resetCmsDataBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to revert all text configurations, style changes, and mock records to installation defaults?")) {
                state.resetAllData();
                fillCmsFormValues();
                showToast("All databases reverted to default installation assets.");
            }
        });
    }

    // Save Text CMS alterations
    const cmsTextForm = document.getElementById("cmsTextForm");
    if (cmsTextForm) {
        cmsTextForm.addEventListener("submit", (e) => {
            e.preventDefault();
            state.updateSettings({
                heroTagline: document.getElementById("cmsHeroTaglineInput").value,
                heroTitle: document.getElementById("cmsHeroTitleInput").value,
                heroDesc: document.getElementById("cmsHeroDescInput").value
            });
            showToast("Content copy updated on live pages.");
        });
    }

    // Save style theme updates
    const themeCustomizerForm = document.getElementById("themeCustomizerForm");
    if (themeCustomizerForm) {
        themeCustomizerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            state.updateSettings({
                primaryGold: document.getElementById("primaryGoldColorPicker").value,
                secondaryRose: document.getElementById("secondaryRoseColorPicker").value,
                primaryFont: document.getElementById("bodyFontFamilySelect").value,
                showFaq: document.getElementById("faqVisibilityCheckbox").checked
            });
            showToast("Design system updates applied to CSS variables.");
        });
    }

    // Save SEO metadata tweaks
    const seoConfigForm = document.getElementById("seoConfigForm");
    if (seoConfigForm) {
        seoConfigForm.addEventListener("submit", (e) => {
            e.preventDefault();
            state.updateSettings({
                metaTitle: document.getElementById("seoTitleInput").value,
                metaDesc: document.getElementById("seoDescInput").value
            });
            showToast("Search Engine optimization meta tags updated.");
        });
    }

    // ==========================================================================
    // DYNAMIC TABLES RENDERING SYSTEM (CMS VIEWERS)
    // ==========================================================================
    function renderBookingsTable() {
        const tbody = document.getElementById("bookingsTableBody");
        if (!tbody) return;

        if (state.bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:var(--text-tertiary);">No registration records found.</td></tr>`;
            return;
        }

        // Sort descending by date submitted
        const sorted = [...state.bookings].sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        tbody.innerHTML = sorted.map(b => {
            const dateStr = new Date(b.dateCreated).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            });
            
            const actionBtn = b.status === "pending" 
                ? `<button class="btn btn-outline btn-sm approve-booking-btn" data-id="${b.id}" style="color:#22c55e; border-color:rgba(34,197,94,0.3)">Approve</button>`
                : `<span style="color:#22c55e; font-size:12px; font-weight:600;">Approved ✓</span>`;

            return `
                <tr>
                    <td>${dateStr}</td>
                    <td><strong>${b.name}</strong></td>
                    <td><a href="tel:${b.phone}" style="color:var(--primary-gold); font-weight:500;">${b.phone}</a></td>
                    <td>${b.course}</td>
                    <td>${b.startDate}</td>
                    <td><span class="badge-status ${b.status}">${b.status}</span></td>
                    <td style="display:flex; gap:8px; align-items:center;">
                        ${actionBtn}
                        <button class="btn btn-outline btn-sm delete-booking-btn" data-id="${b.id}" style="color:#ef4444; border-color:rgba(239,68,68,0.3)">Cancel</button>
                    </td>
                </tr>
            `;
        }).join("");

        // Attach action handlers
        tbody.querySelectorAll(".approve-booking-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                state.updateBookingStatus(id, "approved");
                showToast("Admission enrollment approved!");
                renderBookingsTable();
            });
        });

        tbody.querySelectorAll(".delete-booking-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                if (confirm("Are you sure you want to cancel and remove this student registration?")) {
                    state.deleteBooking(id);
                    showToast("Registration deleted.");
                    renderBookingsTable();
                }
            });
        });
    }

    function renderMessagesTable() {
        const tbody = document.getElementById("messagesTableBody");
        if (!tbody) return;

        if (state.messages.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--text-tertiary);">No inquiries found in inbox.</td></tr>`;
            return;
        }

        const sorted = [...state.messages].sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        tbody.innerHTML = sorted.map(m => {
            const dateStr = new Date(m.dateCreated).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            });

            return `
                <tr>
                    <td>${dateStr}</td>
                    <td><strong>${m.name}</strong></td>
                    <td><a href="tel:${m.phone}" style="color:var(--primary-gold); font-weight:500;">${m.phone}</a></td>
                    <td><span class="badge-status pending" style="background-color:rgba(219,39,119,0.1); color:var(--secondary-rose);">${m.subject}</span></td>
                    <td style="max-width: 250px; white-space: normal;">${m.message}</td>
                    <td>
                        <button class="btn btn-outline btn-sm delete-message-btn" data-id="${m.id}" style="color:#ef4444; border-color:rgba(239,68,68,0.3)">Delete</button>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.querySelectorAll(".delete-message-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                if (confirm("Are you sure you want to delete this message?")) {
                    state.deleteMessage(id);
                    showToast("Message deleted from database.");
                    renderMessagesTable();
                }
            });
        });
    }

    // Clear all registrations
    const clearAllBookingsBtn = document.getElementById("clearAllBookingsBtn");
    if (clearAllBookingsBtn) {
        clearAllBookingsBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete all student registration logs permanently?")) {
                state.clearBookings();
                showToast("All registration logs deleted.");
                renderBookingsTable();
            }
        });
    }

    // Clear all messages
    const clearAllMessagesBtn = document.getElementById("clearAllMessagesBtn");
    if (clearAllMessagesBtn) {
        clearAllMessagesBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to empty the inquiries inbox permanently?")) {
                state.clearMessages();
                showToast("Inbox messages deleted.");
                renderMessagesTable();
            }
        });
    }

    // ==========================================================================
    // INTERACTIVE COLOR LAB MINI-GAME ENGINE
    // ==========================================================================
    const targetBox = document.getElementById("targetColorBox");
    const userBox = document.getElementById("userColorBox");
    const gameAccuracy = document.getElementById("gameAccuracy");
    const gameRewardCard = document.getElementById("gameRewardCard");
    
    const slideRose = document.getElementById("slideRose");
    const slideMedium = document.getElementById("slideMedium");
    const slideNormal = document.getElementById("slideNormal");
    
    const valRose = document.getElementById("valRose");
    const valMedium = document.getElementById("valMedium");
    const valNormal = document.getElementById("valNormal");
    
    const checkMatchBtn = document.getElementById("checkMatchBtn");
    const nextShadeBtn = document.getElementById("nextShadeBtn");
    
    let targetRGB = { r: 0, g: 0, b: 0 };
    
    function generateTargetPink() {
        // High Red (170-255), low-mid Green (30-130), mid-high Blue (80-190) creates gorgeous pinks/roses/magentas
        targetRGB.r = Math.floor(Math.random() * (255 - 170 + 1)) + 170;
        targetRGB.g = Math.floor(Math.random() * (130 - 30 + 1)) + 30;
        targetRGB.b = Math.floor(Math.random() * (190 - 80 + 1)) + 80;
        
        targetBox.style.backgroundColor = `rgb(${targetRGB.r}, ${targetRGB.g}, ${targetRGB.b})`;
        
        resetGameSliders();
        updateUserMix();
        gameAccuracy.textContent = "0%";
        gameAccuracy.style.color = "";
        gameRewardCard.style.display = "none";
    }

    function resetGameSliders() {
        slideRose.value = 128;
        slideMedium.value = 128;
        slideNormal.value = 128;
        
        valRose.textContent = "128";
        valMedium.textContent = "128";
        valNormal.textContent = "128";
    }
    
    function updateUserMix() {
        const r = parseInt(slideRose.value);
        const g = parseInt(slideMedium.value);
        const b = parseInt(slideNormal.value);
        
        userBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    
    // Bind slider events
    [slideRose, slideMedium, slideNormal].forEach(slider => {
        slider.addEventListener("input", (e) => {
            const targetValId = "val" + slider.id.substring(5);
            const valDisplay = document.getElementById(targetValId);
            if (valDisplay) {
                valDisplay.textContent = e.target.value;
            }
            updateUserMix();
        });
    });
    
    if (checkMatchBtn) {
        checkMatchBtn.addEventListener("click", () => {
            const ru = parseInt(slideRose.value);
            const gu = parseInt(slideMedium.value);
            const bu = parseInt(slideNormal.value);
            
            const diffR = Math.abs(targetRGB.r - ru);
            const diffG = Math.abs(targetRGB.g - gu);
            const diffB = Math.abs(targetRGB.b - bu);
            
            const totalDiff = diffR + diffG + diffB;
            const accuracy = Math.max(0, 100 - (totalDiff / 765) * 100);
            const roundedAcc = Math.round(accuracy);
            
            gameAccuracy.textContent = roundedAcc + "%";
            
            if (roundedAcc >= 90) {
                gameAccuracy.style.color = "#22c55e";
                gameRewardCard.style.display = "block";
                showToast("Shade Matched! Voucher Unlocked.");
            } else if (roundedAcc >= 70) {
                gameAccuracy.style.color = "var(--primary-gold)";
                gameRewardCard.style.display = "none";
                showToast("Close! Tweak the sliders for a better match.", "info");
            } else {
                gameAccuracy.style.color = "#ef4444";
                gameRewardCard.style.display = "none";
                showToast("Color mismatch. Try again!", "error");
            }
        });
    }
    
    if (nextShadeBtn) {
        nextShadeBtn.addEventListener("click", generateTargetPink);
    }
    
    if (targetBox) {
        generateTargetPink();
    }

    // ==========================================================================
    // AUTO-ROTATING MULTI-IMAGE CAROUSEL & LIGHTBOX ZOOM ENGINE
    // ==========================================================================
    const carouselTrack = document.getElementById("carouselTrackMulti");
    const carouselCards = document.querySelectorAll(".carousel-card-item");
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    
    let currentSlideIndex = Math.max(0, carouselCards.length - getVisibleCardsCount());
    let carouselInterval = null;
    
    function getVisibleCardsCount() {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 600) return 2;
        return 1;
    }
    
    function slideCarousel() {
        if (!carouselCards.length || !carouselTrack) return;
        
        const visibleCount = getVisibleCardsCount();
        const maxIndex = carouselCards.length - visibleCount;
        
        if (currentSlideIndex > maxIndex) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = maxIndex;
        }
        
        const cardWidth = carouselCards[0].getBoundingClientRect().width;
        const gap = 24;
        const translation = currentSlideIndex * (cardWidth + gap);
        
        carouselTrack.style.transform = `translateX(-${translation}px)`;
    }
    
    // Auto-rotate moves from left to right (decrementing index)
    function nextSlide() {
        const visibleCount = getVisibleCardsCount();
        const maxIndex = carouselCards.length - visibleCount;
        
        if (currentSlideIndex <= 0) {
            currentSlideIndex = maxIndex;
        } else {
            currentSlideIndex--;
        }
        slideCarousel();
    }
    
    function startAutoRotate() {
        stopAutoRotate();
        carouselInterval = setInterval(nextSlide, 3000); // Shift slider every 3 seconds
    }
    
    function stopAutoRotate() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    
    // Lightbox click-to-zoom trigger
    carouselCards.forEach(card => {
        card.addEventListener("click", () => {
            const imgElement = card.querySelector("img");
            const captionElement = card.querySelector(".gallery-caption");
            if (imgElement && lightboxModal) {
                lightboxImg.src = imgElement.src;
                lightboxCaption.textContent = captionElement ? captionElement.textContent : "";
                
                lightboxModal.style.display = "flex";
                setTimeout(() => {
                    lightboxModal.classList.add("active");
                }, 10);
                
                stopAutoRotate(); // halt carousel while zooming
            }
        });
    });
    
    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove("active");
            setTimeout(() => {
                lightboxModal.style.display = "none";
            }, 300);
            startAutoRotate(); // resume carousel
        }
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }
    
    if (lightboxModal) {
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }
    
    // Handle responsive resize updates
    window.addEventListener("resize", () => {
        slideCarousel();
    });
    
    // Start carousel rotation
    if (carouselCards.length) {
        startAutoRotate();
    }
});
