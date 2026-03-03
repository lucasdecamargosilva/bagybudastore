// Initial State & Data Management
let clients = JSON.parse(localStorage.getItem('quantic_clients')) || [
    { id: 1, name: 'Lucas Decamargo', company: 'Quantic Labs', email: 'lucas@quantic.com', phone: '(11) 98765-4321', plan: 'Enterprise', status: 'Ativo', date: '2026-01-15', website: 'https://quantic.com' },
    { id: 2, name: 'Ana Oliveira', company: 'Fashion Hub', email: 'ana@fashion.com', phone: '(11) 91234-5678', plan: 'Pro', status: 'Ativo', date: '2026-02-10', website: 'https://fashionhub.com.br' },
    { id: 3, name: 'Ricardo Santos', company: 'Fit Store', email: 'ricardo@fitstore.com', phone: '(11) 93333-2222', plan: 'Start', status: 'Pendente', date: '2026-02-28', website: 'https://fitstore.com' }
];

// Elements
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const clientTableBody = document.getElementById('client-table-body');
const clientForm = document.getElementById('client-form');
const statTotalClients = document.getElementById('stat-total-clients');
const clientModal = document.getElementById('client-modal');

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        if (viewId) switchView(viewId);
    });
});

function switchView(viewId) {
    // Update Sidebar
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewId) {
            item.classList.add('active');
        }
    });

    // Update Main Content
    views.forEach(view => {
        view.classList.remove('active');
        if (view.id === viewId) {
            view.classList.add('active');
        }
    });

    if (viewId === 'clients') renderClients();
    if (viewId === 'dashboard') updateStats();
}

// Filter Logic
function setFilter(range, btn) {
    // Update active class
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    console.log(`Filtering dashboard by: ${range}`);
    // In a real app, this would trigger a data refresh for the dashboard
}

// Client Management Logic
function renderClients() {
    clientTableBody.innerHTML = '';

    clients.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(client => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = (e) => {
            if (!e.target.closest('button')) showClientDetails(client.id);
        };

        const statusClass = client.status === 'Ativo' ? 'status-active' :
            client.status === 'Pendente' ? 'status-pending' : 'status-inactive';

        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${client.name}</div>
                <div style="color: var(--text-dim); font-size: 12px;">${client.email}</div>
            </td>
            <td>${client.company}</td>
            <td><span style="opacity: 0.8;">${client.plan}</span></td>
            <td><span class="status-badge ${statusClass}">${client.status}</span></td>
            <td style="color: var(--text-dim);">${formatDate(client.date)}</td>
            <td>
                <div style="display: flex; gap: 10px;">
                    <button onclick="deleteClient(${client.id})" style="background: none; border: none; color: var(--text-dim); cursor: pointer;"><i class="fas fa-trash"></i></button>
                    <button onclick="showClientDetails(${client.id})" style="background: none; border: none; color: var(--text-dim); cursor: pointer;"><i class="fas fa-eye"></i></button>
                </div>
            </td>
        `;
        clientTableBody.appendChild(tr);
    });
}

function showClientDetails(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    document.getElementById('modal-name').innerText = client.name;
    document.getElementById('modal-company').innerText = client.company;
    document.getElementById('modal-email').innerText = client.email;
    document.getElementById('modal-phone').innerText = client.phone;
    document.getElementById('modal-plan').innerText = client.plan;
    document.getElementById('modal-status').innerText = client.status;
    document.getElementById('modal-date').innerText = formatDate(client.date);

    const websiteLink = document.getElementById('modal-website');
    websiteLink.innerText = client.website || 'Não informado';
    websiteLink.href = client.website || '#';

    // Status classes
    const statusBadge = document.getElementById('modal-status');
    statusBadge.className = 'status-badge ' + (client.status === 'Ativo' ? 'status-active' : 'status-pending');

    clientModal.classList.add('active');
}

function closeModal() {
    clientModal.classList.remove('active');
}

// Close modal on click outside
window.onclick = (event) => {
    if (event.target == clientModal) closeModal();
};

function addClient(event) {
    event.preventDefault();

    const newClient = {
        id: Date.now(),
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        plan: document.getElementById('plan').value,
        status: document.getElementById('status').value,
        website: document.getElementById('website').value,
        date: new Date().toISOString().split('T')[0]
    };

    clients.push(newClient);
    saveData();

    // Show success & redirect
    alert('Cliente cadastrado com sucesso!');
    clientForm.reset();
    switchView('clients');
}

function deleteClient(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        clients = clients.filter(c => c.id !== id);
        saveData();
        renderClients();
        updateStats();
    }
}

function updateStats() {
    if (statTotalClients) statTotalClients.innerText = clients.length;
}

function saveData() {
    localStorage.setItem('quantic_clients', JSON.stringify(clients));
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('pt-BR', options);
}

// Event Listeners
if (clientForm) clientForm.addEventListener('submit', addClient);

// Init
window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderClients();
});
