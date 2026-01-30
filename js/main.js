// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Set today's date for booking inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if(input.getAttribute('min') === 'today') {
            input.min = new Date().toISOString().split('T')[0];
            input.value = new Date().toISOString().split('T')[0];
        }
    });

    // Initialize auth mode if on login page
    if(document.getElementById('authForm')) {
        initializeAuth();
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Service selection handler
function selectService(service) {
    localStorage.setItem('selectedService', service);
    window.location.href = 'booking.html';
}

// Time slot selection
function selectTime(element) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        if (!slot.disabled) slot.classList.remove('selected');
    });
    element.classList.add('selected');
    document.getElementById('selectedTime').value = element.textContent;
}

// Update professionals dropdown based on service
function updateProfessionals(service) {
    const professionals = {
        'haircut': [
            {value: 'emma-davis', text: 'Emma Davis - Stylist'},
            {value: 'michael-chen', text: 'Michael Chen - Barber'},
            {value: 'sarah-colorist', text: 'Sarah Johnson - Colorist'}
        ],
        'doctor': [
            {value: 'dr-sarah', text: 'Dr. Sarah Johnson - GP'},
            {value: 'dr-michael', text: 'Dr. Michael Lee - Specialist'},
            {value: 'dr-emily', text: 'Dr. Emily Brown - Pediatrician'}
        ],
        'consultation': [
            {value: 'john-smith', text: 'John Smith - Business Coach'},
            {value: 'lisa-wong', text: 'Lisa Wong - Career Advisor'},
            {value: 'david-miller', text: 'David Miller - Consultant'}
        ],
        'repair': [
            {value: 'tech-tom', text: 'Tom Wilson - Technician'},
            {value: 'repair-rob', text: 'Rob Johnson - Specialist'}
        ],
        'training': [
            {value: 'coach-cathy', text: 'Cathy Johnson - Fitness Coach'},
            {value: 'trainer-tim', text: 'Tim Davis - Personal Trainer'}
        ],
        'spa': [
            {value: 'spa-sarah', text: 'Sarah Lee - Massage Therapist'},
            {value: 'wellness-wendy', text: 'Wendy Park - Esthetician'}
        ]
    };
    
    const select = document.getElementById('professional');
    if(!select) return;
    
    select.innerHTML = '<option value="">Select a professional...</option>';
    
    const options = professionals[service] || professionals['haircut'];
    options.forEach(pro => {
        const option = document.createElement('option');
        option.value = pro.value;
        option.textContent = pro.text;
        select.appendChild(option);
    });
}

// Handle booking form
function handleBooking(event) {
    event.preventDefault();
    
    const service = document.querySelector('input[name="service"]:checked')?.value || 'Service';
    const date = document.getElementById('bookingDate')?.value;
    const time = document.getElementById('selectedTime')?.value;
    const professional = document.getElementById('professional')?.value;
    
    if (!time) {
        alert('Please select a time slot');
        return;
    }
    
    // Update modal content
    const modalService = document.getElementById('modalService');
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');
    const modalProfessional = document.getElementById('modalProfessional');
    
    if(modalService) modalService.textContent = service.charAt(0).toUpperCase() + service.slice(1);
    if(modalDate) modalDate.textContent = date || 'Not specified';
    if(modalTime) modalTime.textContent = time;
    if(modalProfessional) modalProfessional.textContent = professional || 'Not specified';
    
    // Show modal
    const modal = document.getElementById('successModal');
    if(modal) modal.classList.add('show');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if(modal) modal.classList.remove('show');
    window.location.href = 'index.html';
}

// Contact form handler
function handleContact(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
    event.target.reset();
}

// ================= AUTHENTICATION SYSTEM =================

let currentRole = 'customer';
let isRegisterMode = false;

function initializeAuth() {
    // Check if there's a role pre-selected
    const preselectedRole = localStorage.getItem('preselectedRole');
    if(preselectedRole) {
        switchRole(preselectedRole);
        localStorage.removeItem('preselectedRole');
    }
}

function switchRole(role) {
    currentRole = role;
    
    const customerTab = document.getElementById('customer-tab');
    const professionalTab = document.getElementById('professional-tab');
    const businessField = document.getElementById('businessField');
    const serviceField = document.getElementById('serviceField');
    
    // Update tab styles
    if (role === 'customer') {
        customerTab?.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
        customerTab?.classList.remove('text-gray-600');
        professionalTab?.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
        professionalTab?.classList.add('text-gray-600');
        
        // Hide business fields
        if(businessField) businessField.classList.add('hidden');
        if(serviceField) serviceField.classList.add('hidden');
        document.getElementById('businessName')?.removeAttribute('required');
        document.getElementById('serviceCategory')?.removeAttribute('required');
    } else {
        professionalTab?.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
        professionalTab?.classList.remove('text-gray-600');
        customerTab?.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
        customerTab?.classList.add('text-gray-600');
        
        // Show business fields if in register mode
        if(isRegisterMode) {
            if(businessField) businessField.classList.remove('hidden');
            if(serviceField) serviceField.classList.remove('hidden');
            document.getElementById('businessName')?.setAttribute('required', 'required');
            document.getElementById('serviceCategory')?.setAttribute('required', 'required');
        }
    }
    
    updateAuthText();
}

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    
    const nameField = document.getElementById('nameField');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const businessField = document.getElementById('businessField');
    const serviceField = document.getElementById('serviceField');
    const loginExtras = document.getElementById('loginExtras');
    const submitBtn = document.getElementById('submitBtn');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleText = document.getElementById('toggleText');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    
    if (isRegisterMode) {
        // Switch to Register Mode
        nameField?.classList.remove('hidden');
        confirmPasswordField?.classList.remove('hidden');
        loginExtras?.classList.add('hidden');
        
        document.getElementById('fullName')?.setAttribute('required', 'required');
        document.getElementById('confirmPassword')?.setAttribute('required', 'required');
        
        // Show business fields if professional
        if(currentRole === 'professional') {
            businessField?.classList.remove('hidden');
            serviceField?.classList.remove('hidden');
            document.getElementById('businessName')?.setAttribute('required', 'required');
            document.getElementById('serviceCategory')?.setAttribute('required', 'required');
        }
        
        if(submitBtn) submitBtn.textContent = 'Create Account';
        if(toggleBtn) toggleBtn.textContent = 'Already have an account? Sign in';
        if(toggleText) toggleText.textContent = 'Already registered?';
        if(authTitle) authTitle.textContent = 'Create Account';
        if(authSubtitle) authSubtitle.textContent = `Join as ${currentRole === 'professional' ? 'a Service Professional' : 'a Customer'}`;
    } else {
        // Switch to Login Mode
        nameField?.classList.add('hidden');
        confirmPasswordField?.classList.add('hidden');
        businessField?.classList.add('hidden');
        serviceField?.classList.add('hidden');
        loginExtras?.classList.remove('hidden');
        
        document.getElementById('fullName')?.removeAttribute('required');
        document.getElementById('confirmPassword')?.removeAttribute('required');
        document.getElementById('businessName')?.removeAttribute('required');
        document.getElementById('serviceCategory')?.removeAttribute('required');
        
        if(submitBtn) submitBtn.textContent = 'Sign in';
        if(toggleBtn) toggleBtn.textContent = 'Create new account';
        if(toggleText) toggleText.textContent = "Don't have an account?";
        if(authTitle) authTitle.textContent = 'Welcome back';
        if(authSubtitle) authSubtitle.textContent = 'Sign in to your account';
    }
}

function updateAuthText() {
    const authSubtitle = document.getElementById('authSubtitle');
    if(authSubtitle && isRegisterMode) {
        authSubtitle.textContent = `Join as ${currentRole === 'professional' ? 'a Service Professional' : 'a Customer'}`;
    }
}

function handleAuth(event) {
    event.preventDefault();
    
    const email = document.getElementById('email')?.value;
    const role = currentRole;
    
    if(isRegisterMode) {
        // Handle Registration
        const fullName = document.getElementById('fullName')?.value;
        const businessName = document.getElementById('businessName')?.value;
        const serviceCategory = document.getElementById('serviceCategory')?.value;
        
        // Simulate storing user data
        const userData = {
            email,
            fullName,
            role,
            businessName: role === 'professional' ? businessName : null,
            serviceCategory: role === 'professional' ? serviceCategory : null,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        alert(`Account created successfully!\n\nRole: ${role.charAt(0).toUpperCase() + role.slice(1)}\n${role === 'professional' ? 'Business: ' + businessName : ''}\n\nRedirecting to dashboard...`);
        
        window.location.href = 'dashboard.html';
    } else {
        // Handle Login
        // Simulate login
        localStorage.setItem('currentUser', JSON.stringify({email, role}));
        
        if(role === 'professional') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'services.html';
        }
    }
}

// Pre-select role from other pages
function selectRoleAndRedirect(role) {
    localStorage.setItem('preselectedRole', role);
    window.location.href = 'login.html';
}