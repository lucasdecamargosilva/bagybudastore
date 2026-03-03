// Initial State & Data Management
const PLAN_VALUES = {
    'Starter': 97,
    'Inicial': 197,
    'Médio': 397,
    'Premium': 797
};

let clients = JSON.parse(localStorage.getItem('quantic_clients')) || [
    { id: 1, name: 'Lucas Decamargo', company: 'Quantic Labs', email: 'lucas@quantic.com', phone: '(11) 98765-4321', plan: 'Premium', status: 'Ativo', date: '2026-01-15', lastPayment: '2026-03-01', website: 'https://quantic.com' },
    { id: 2, name: 'Ana Oliveira', company: 'Fashion Hub', email: 'ana@fashion.com', phone: '(11) 91234-5678', plan: 'Médio', status: 'Ativo', date: '2026-02-10', lastPayment: '2026-03-01', website: 'https://fashionhub.com.br' },
    { id: 3, name: 'Ricardo Santos', company: 'Fit Store', email: 'ricardo@fitstore.com', phone: '(11) 93333-2222', plan: 'Starter', status: 'Teste Gratuito', date: '2026-02-28', lastPayment: '-', website: 'https://fitstore.com' }
];

// Elements
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const clientTableBody = document.getElementById('client-table-body');
const clientForm = document.getElementById('client-form');
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
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewId) item.classList.add('active');
    });
    views.forEach(view => {
        view.classList.remove('active');
        if (view.id === viewId) view.classList.add('active');
    });
    if (viewId === 'clients') renderClients();
    if (viewId === 'dashboard') { updateStats(); renderDashboardClients(); }
}

// Filter Logic
function setFilter(range, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Render dashboard client table
function renderDashboardClients() {
    const tbody = document.getElementById('dashboard-client-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    clients.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(client => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = (e) => { if (!e.target.closest('button')) showClientDetails(client.id); };

        const statusClass = client.status === 'Ativo' ? 'status-active' :
            client.status === 'Teste Gratuito' ? 'status-pending' : 'status-inactive';

        const monthlyValue = PLAN_VALUES[client.plan] ? `R$ ${PLAN_VALUES[client.plan].toLocaleString('pt-BR')}` : '-';

        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${client.name}</div>
                <div style="color: var(--text-dim); font-size: 12px;">${client.email}</div>
            </td>
            <td>${client.company}</td>
            <td><span style="opacity: 0.85;">${client.plan}</span></td>
            <td style="color: var(--success); font-weight: 600;">${monthlyValue}</td>
            <td style="color: var(--text-dim);">${client.lastPayment && client.lastPayment !== '-' ? formatDate(client.lastPayment) : '—'}</td>
            <td><span class="status-badge ${statusClass}">${client.status}</span></td>
            <td>
                <div style="display: flex; gap: 10px;">
                    <button onclick="deleteClient(${client.id})" style="background: none; border: none; color: var(--text-dim); cursor: pointer;"><i class="fas fa-trash"></i></button>
                    <button onclick="showClientDetails(${client.id})" style="background: none; border: none; color: var(--text-dim); cursor: pointer;"><i class="fas fa-eye"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Clients section table
function renderClients() {
    if (!clientTableBody) return;
    clientTableBody.innerHTML = '';

    clients.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(client => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = (e) => { if (!e.target.closest('button')) showClientDetails(client.id); };

        const statusClass = client.status === 'Ativo' ? 'status-active' :
            client.status === 'Teste Gratuito' ? 'status-pending' : 'status-inactive';

        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${client.name}</div>
                <div style="color: var(--text-dim); font-size: 12px;">${client.email}</div>
            </td>
            <td>${client.company}</td>
            <td><span style="opacity: 0.85;">${client.plan}</span></td>
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

    const statusBadge = document.getElementById('modal-status');
    statusBadge.className = 'status-badge ' + (client.status === 'Ativo' ? 'status-active' :
        client.status === 'Teste Gratuito' ? 'status-pending' : 'status-inactive');

    clientModal.classList.add('active');
}

function openRegistrationModal() {
    const regModal = document.getElementById('registration-modal');
    if (regModal) regModal.classList.add('active');
}

function closeRegistrationModal() {
    const regModal = document.getElementById('registration-modal');
    if (regModal) regModal.classList.remove('active');
    document.getElementById('client-form')?.reset();
}

function closeModal() {
    clientModal.classList.remove('active');
}

window.onclick = (event) => {
    if (event.target == clientModal) closeModal();
    if (event.target == document.getElementById('registration-modal')) closeRegistrationModal();
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
        date: new Date().toISOString().split('T')[0],
        lastPayment: '-'
    };

    clients.push(newClient);
    saveData();
    closeRegistrationModal();
    updateStats();
    renderDashboardClients();
}

function deleteClient(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        clients = clients.filter(c => c.id !== id);
        saveData();
        renderClients();
        renderDashboardClients();
        updateStats();
    }
}

function updateStats() {
    const activeClients = clients.filter(c => c.status === 'Ativo');
    const activeCount = activeClients.length;
    const totalMRR = activeClients.reduce((sum, c) => sum + (PLAN_VALUES[c.plan] || 0), 0);
    const growth = activeCount > 0 ? '12%' : '0%';

    setText('stat-active-clients', activeCount);
    setText('stat-total-mrr', `R$ ${totalMRR.toLocaleString('pt-BR')}`);
    setText('stat-growth', growth);

    // Package breakdown
    ['Starter', 'Inicial', 'Médio', 'Premium'].forEach(plan => {
        const key = plan.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const planClients = clients.filter(c => c.plan === plan && c.status === 'Ativo');
        const count = planClients.length;
        const total = count * (PLAN_VALUES[plan] || 0);
        setText(`pkg-${key}-count`, count);
        setText(`pkg-${key}-total`, `R$ ${total.toLocaleString('pt-BR')}`);
    });
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function saveData() {
    localStorage.setItem('quantic_clients', JSON.stringify(clients));
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('pt-BR', options);
}

if (clientForm) clientForm.addEventListener('submit', addClient);

window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderDashboardClients();
});


