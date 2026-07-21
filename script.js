// Initialize
const addPersonForm = document.getElementById('addPersonForm');
const markAttendanceForm = document.getElementById('markAttendanceForm');
const personSelect = document.getElementById('personSelect');
const attendanceLevel = document.getElementById('attendanceLevel');
const attendanceStream = document.getElementById('attendanceStream');
const filterLevel = document.getElementById('filterLevel');
const filterStream = document.getElementById('filterStream');
const manageLevelSelect = document.getElementById('manageLevelSelect');
const filterDate = document.getElementById('filterDate');
const filterStatus = document.getElementById('filterStatus');
const recordsTable = document.getElementById('recordsTable');
const membersList = document.getElementById('membersList');
const membersPanel = document.getElementById('membersPanel');
const toggleMembersBtn = document.getElementById('toggleMembersBtn');
const printBtn = document.getElementById('printBtn');
const printHeader = document.getElementById('printHeader');

const today = new Date().toISOString().split('T')[0];
document.getElementById('attendanceDate').value = today;
filterDate.value = today;

const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
if (!isAdmin) {
    window.location.href = 'login.html';
}

let people = JSON.parse(localStorage.getItem('people')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || [];

addPersonForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('personName').value.trim();
    const role = document.getElementById('personRole').value.trim();
    const level = document.getElementById('personLevel').value.trim();
    const stream = document.getElementById('personStream').value.trim();

    if (!level) {
        alert('Please select a level.');
        return;
    }

    if (!stream) {
        alert('Please select a stream.');
        return;
    }

    const person = {
        id: Date.now(),
        name: name,
        role: role || 'N/A',
        level: level,
        stream: stream,
        dateAdded: new Date().toLocaleDateString()
    };

    people.push(person);
    localStorage.setItem('people', JSON.stringify(people));
    addPersonForm.reset();
    updateSelects();
    renderMembers();
    renderRecords();
});

markAttendanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const level = attendanceLevel.value.trim();
    const personId = parseInt(personSelect.value);
    const date = document.getElementById('attendanceDate').value;
    const status = document.getElementById('attendanceStatus').value;

    if (!level) {
        alert('Please select a level before choosing a person.');
        return;
    }

    if (!personId) {
        alert('Please select a person.');
        return;
    }

    const existingRecord = attendance.find(
        a => a.personId === personId && a.date === date
    );

    if (existingRecord) {
        existingRecord.status = status;
    } else {
        attendance.push({
            id: Date.now(),
            personId: personId,
            date: date,
            status: status,
            timestamp: new Date().toLocaleString()
        });
    }

    localStorage.setItem('attendance', JSON.stringify(attendance));
    markAttendanceForm.reset();
    document.getElementById('attendanceDate').value = today;
    renderRecords();
});

function updateSelects() {
    personSelect.innerHTML = '<option value="">-- Choose a person --</option>';
    attendanceLevel.innerHTML = '<option value="">-- Select Level --</option>';
    filterLevel.innerHTML = '<option value="">All Levels</option>';

    const levelStreamCombos = new Set();

    people.forEach(person => {
        if (person.level && person.stream) {
            levelStreamCombos.add(`${person.level}|${person.stream}`);
        }
    });

    Array.from(levelStreamCombos)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .forEach(combo => {
            const [level, stream] = combo.split('|');
            const displayText = `${level} ${stream}`;
            
            const option = document.createElement('option');
            option.value = combo;
            option.textContent = displayText;
            attendanceLevel.appendChild(option);

            const option2 = document.createElement('option');
            option2.value = level;
            option2.textContent = level;
            filterLevel.appendChild(option2);
        });

    // Remove duplicates from filterLevel
    const filterLevelOptions = Array.from(filterLevel.querySelectorAll('option'));
    const seenLevels = new Set(['']); // Start with the "All Levels" option
    filterLevelOptions.forEach(opt => {
        if (seenLevels.has(opt.value)) {
            opt.remove();
        } else {
            seenLevels.add(opt.value);
        }
    });

    // Populate manageLevelSelect with level+stream combinations
    manageLevelSelect.innerHTML = '<option value="">-- Select Level --</option>';
    Array.from(levelStreamCombos)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .forEach(combo => {
            const [level, stream] = combo.split('|');
            const displayText = `${level} ${stream}`;
            const option = document.createElement('option');
            option.value = combo;
            option.textContent = displayText;
            manageLevelSelect.appendChild(option);
        });

    populatePersonSelect();
    renderMembers();
}

function populatePersonSelect() {
    const selectedCombo = attendanceLevel.value;
    personSelect.innerHTML = '';

    if (!selectedCombo) {
        personSelect.innerHTML = '<option value="">Select a level first</option>';
        personSelect.disabled = true;
        attendanceStream.value = '';
        return;
    }

    const [selectedLevel, selectedStream] = selectedCombo.split('|');
    const filteredPeople = people.filter(p => p.level === selectedLevel && p.stream === selectedStream);
    
    if (filteredPeople.length === 0) {
        personSelect.innerHTML = '<option value="">No members in this level</option>';
        personSelect.disabled = true;
        attendanceStream.value = selectedStream;
        return;
    }

    personSelect.disabled = false;
    personSelect.innerHTML = '<option value="">-- Choose a person --</option>';
    filteredPeople.forEach(person => {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = person.name;
        personSelect.appendChild(option);
    });
    
    attendanceStream.value = selectedStream;
}

filterDate.addEventListener('change', renderRecords);
filterLevel.addEventListener('change', renderRecords);
filterStream.addEventListener('change', renderRecords);
filterStatus.addEventListener('change', renderRecords);
if (attendanceLevel) {
    attendanceLevel.addEventListener('change', populatePersonSelect);
}
if (manageLevelSelect) {
    manageLevelSelect.addEventListener('change', renderMembers);
}
if (toggleMembersBtn && membersPanel) {
    toggleMembersBtn.addEventListener('click', () => {
        membersPanel.classList.toggle('hidden');
        toggleMembersBtn.textContent = membersPanel.classList.contains('hidden')
            ? 'Show Manage Members'
            : 'Hide Manage Members';
    });
}

function renderMembers() {
    if (!membersList) return;

    const selectedCombo = manageLevelSelect ? manageLevelSelect.value : '';
    if (!selectedCombo) {
        membersList.innerHTML = '<div class="empty-state"><p>Select a level to view members.</p></div>';
        return;
    }

    const [selectedLevel, selectedStream] = selectedCombo.split('|');
    const filteredPeople = people.filter(p => p.level === selectedLevel && p.stream === selectedStream);
    if (filteredPeople.length === 0) {
        membersList.innerHTML = '<div class="empty-state"><p>No members found for this level.</p></div>';
        return;
    }

    let html = '<ul class="members-ul">';
    filteredPeople.forEach(person => {
        html += `<li>
            <strong>${person.name}</strong> (${person.level} - Stream ${person.stream}) - ${person.role}
            <button class="btn-secondary" onclick="editMember(${person.id})">Edit</button>
            <button class="btn-delete" onclick="deleteMember(${person.id})">Delete</button>
        </li>`;
    });
    html += '</ul>';
    membersList.innerHTML = html;
}

window.editMember = function(personId) {
    const person = people.find(p => p.id === personId);
    if (!person || !membersList) return;

    const levelOptions = Array.from(new Set(people.map(p => p.level))).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
    );

    let html = '<div class="member-edit-form">';
    html += `<div class="form-group"><label>Name</label><input id="editName" type="text" value="${person.name}"></div>`;
    html += `<div class="form-group"><label>Role</label><input id="editRole" type="text" value="${person.role}"></div>`;
    html += '<div class="form-group"><label>Level</label><select id="editLevel">';
    levelOptions.forEach(level => {
        html += `<option value="${level}"${level === person.level ? ' selected' : ''}>${level}</option>`;
    });
    html += '</select></div>';
    html += '<div class="form-group"><label>Stream</label><select id="editStream">';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        html += `<option value="${letter}"${letter === person.stream ? ' selected' : ''}>${letter}</option>`;
    });
    html += '</select></div>';
    html += `<button class="btn btn-primary" onclick="saveMember(${person.id})">Save</button>`;
    html += `<button class="btn btn-secondary" onclick="renderMembers()">Cancel</button>`;
    html += '</div>';

    membersList.innerHTML = html;
};

window.saveMember = function(personId) {
    const person = people.find(p => p.id === personId);
    if (!person) return;

    const name = document.getElementById('editName').value.trim();
    const role = document.getElementById('editRole').value.trim();
    const level = document.getElementById('editLevel').value;
    const stream = document.getElementById('editStream').value;

    if (!name || !level || !stream) {
        alert('Name, level, and stream cannot be empty.');
        return;
    }

    person.name = name;
    person.role = role || 'N/A';
    person.level = level;
    person.stream = stream;

    localStorage.setItem('people', JSON.stringify(people));
    updateSelects();
    renderMembers();
    renderRecords();
};

window.deleteMember = function(personId) {
    if (!confirm('Delete this member and all attendance data?')) return;
    people = people.filter(p => p.id !== personId);
    attendance = attendance.filter(a => a.personId !== personId);
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    updateSelects();
    renderMembers();
    renderRecords();
};

function renderRecords() {
    let filtered = attendance.slice();

    if (!filterLevel.value) {
        document.getElementById('totalRecords').textContent = 0;
        document.getElementById('totalPresent').textContent = 0;
        document.getElementById('totalAbsent').textContent = 0;
        document.getElementById('totalInClass').textContent = 0;
        printHeader.innerHTML = '';
        recordsTable.innerHTML = '<div class="empty-state"><p>Select a level to view attendance records.</p></div>';
        return;
    }

    if (filterDate.value) {
        filtered = filtered.filter(a => a.date === filterDate.value);
    }

    filtered = filtered.filter(a => {
        const person = people.find(p => p.id === a.personId);
        return person && person.level === filterLevel.value;
    });

    if (filterStream.value) {
        filtered = filtered.filter(a => {
            const person = people.find(p => p.id === a.personId);
            return person && person.stream === filterStream.value;
        });
    }

    if (filterStatus.value) {
        filtered = filtered.filter(a => a.status === filterStatus.value);
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalPresent = filtered.filter(a => a.status === 'present').length;
    const totalAbsent = filtered.filter(a => a.status === 'absent').length;
    document.getElementById('totalRecords').textContent = filtered.length;
    document.getElementById('totalPresent').textContent = totalPresent;
    document.getElementById('totalAbsent').textContent = totalAbsent;

    const classCount = people.filter(p => p.level === filterLevel.value && (!filterStream.value || p.stream === filterStream.value)).length;
    document.getElementById('totalInClass').textContent = classCount;

    printHeader.innerHTML = `<div class="print-meta">
        <strong>Level:</strong> ${filterLevel.value}
        ${filterStream.value ? `<span><strong>Stream:</strong> ${filterStream.value}</span>` : ''}
    </div>`;

    if (filtered.length === 0) {
        recordsTable.innerHTML = '<div class="empty-state"><p>No attendance records found.</p></div>';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Person</th><th>Role</th><th>Level</th><th>Stream</th><th>Status</th><th>Action</th></tr></thead><tbody>';

    filtered.forEach(record => {
        const person = people.find(p => p.id === record.personId);
        const statusClass = record.status === 'present' ? 'status-present' : 'status-absent';
        const statusText = record.status.charAt(0).toUpperCase() + record.status.slice(1);

        html += `<tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${person ? person.name : 'Unknown'}</td>
            <td>${person ? person.role : 'N/A'}</td>
            <td>${person ? person.level : 'N/A'}</td>
            <td>${person ? person.stream || 'N/A' : 'N/A'}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td><button class="btn-delete" onclick="deleteRecord(${record.id})">Delete</button></td>
        </tr>`;
    });

    html += '</tbody></table>';
    recordsTable.innerHTML = html;
}

window.deleteRecord = function(recordId) {
    if (confirm('Delete this record?')) {
        attendance = attendance.filter(a => a.id !== recordId);
        localStorage.setItem('attendance', JSON.stringify(attendance));
        renderRecords();
    }
};

if (printBtn) {
    printBtn.addEventListener('click', () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        const header = printHeader.innerHTML;
        const table = recordsTable.innerHTML;
        const content = `
            <html>
                <head>
                    <title>Attendance Records</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .print-meta { margin-bottom: 20px; font-size: 14px; }
                        .print-meta span { margin-left: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        table, th, td { border: 1px solid #000; }
                        th, td { padding: 10px; text-align: left; }
                        th { background-color: #f0f0f0; font-weight: bold; }
                        .status-present { color: green; font-weight: bold; }
                        .status-absent { color: red; font-weight: bold; }
                        button { display: none; }
                    </style>
                </head>
                <body>
                    <h2>Attendance Records Report</h2>
                    ${header}
                    ${table}
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    });
}

updateSelects();
renderMembers();
renderRecords();
    