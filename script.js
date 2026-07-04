function getData() {
    const raw = localStorage.getItem('siperpus_data');
    return raw ? JSON.parse(raw) : [];
}

function saveData(data) {
    localStorage.setItem('siperpus_data', JSON.stringify(data));
}

function formatTanggal (dateStr) {
    if (!dateStr) return '-';
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(dateStr);
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

function hitungHari (tglPinjam, tglKembali) {
    const start = new Date(tglPinjam);
    const end = new Date(tglKembali);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + " hari";
}

function initForm() {
    const form = document.querySelector('.form-card');
    if (!form) return;

    const urlParams = new URLSearchParams (window.location.search);
    const editId = urlParams.get('edit');
    let editMode = false;

    if (editId) {
        const data = getData();
        const itemToEdit = data.find(function(item) { return item.id == editId; });

        if (itemToEdit) {
            editMode = true;
            document.getElementById('nama').value = itemToEdit.nama || '';
            document.getElementById('nim').value = itemToEdit.nim || '';
            document.getElementById('email').value = itemToEdit.email || '';
            document.getElementById('buku').value = itemToEdit.buku || '';
            document.getElementById('tglPinjam').value = itemToEdit.tglPinjam || '';
            document.getElementById('tglKembali').value = itemToEdit.tglKembali || '';
            document.getElementById('catatan').value = itemToEdit.catatan || '';

            const btnSubmit = form.querySelector('button[type="submit"]');
            if (btnSubmit) btnSubmit.innerText = '✏️ Simpan Perubahan';
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const nim = document.getElementById('nim').value.trim(); 
        const email = document.getElementById('email').value.trim();
        const buku = document.getElementById('buku').value;
        const tglPinjam = document.getElementById('tglPinjam').value; 
        const tglKembali = document.getElementById('tglKembali').value;
        const catatan = document.getElementById('catatan').value.trim();

        if (isNaN(nim)) {
            alert('❌ Error: NIM harus berupa angka!');
            return;
        }
        if (tglKembali < tglPinjam) {
            alert('❌ Error: Tanggal kembali tidak boleh lebih cepat dari tanggal pinjam!');
            return;
        }

        const data = getData();

        if (editMode) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == editId) {
                    data[i].nama = nama;
                    data[i].nim = nim;
                    data[i].email = email;
                    data[i].buku = buku;
                    data[i].tglPinjam = tglPinjam;
                    data[i].tglKembali = tglKembali;
                    data[i].catatan = catatan;
                    break;
                }
            }
        } else {
            const newItem = {
                id: Date.now(),
                nama: nama,
                nim: nim,
                email: email,
                buku: buku,
                tglPinjam: tglPinjam,
                tglKembali: tglKembali,
                catatan: catatan,
                status: '⏳ Diproses'
            };
            data.push(newItem);
        }

        saveData(data);
        alert(editMode ? '✅ Data peminjaman berhasil diperbarui!' : '✅ Pengajuan berhasil dikirim!');
        window.location.href = 'riwayat.html';
    });
} 
function initRiwayat() {
    const tbody = document.querySelector('.table-container table tbody');
    const theadTr = document.querySelector('.table-container table thead tr');

    if (!tbody) return;
    if (theadTr && theadTr.children.length === 5) {
        const thAksi = document.createElement('th');
        thAksi.innerText = 'Aksi';
        theadTr.appendChild(thAksi);
    }

    renderTable();

    function getJudulBuku(value) {
        const bukuMap = {
            'ptfi': 'Pengantar Teknik Industri',
            'tlp': 'Tata Letak Pabrik',
            'dpw': 'Dasar Pemrograman Web',
            'bd': 'Basis Data Relasional',
            'sp': 'Struktur Data dan Pemrograman'
        };
        return bukuMap[value] || value;
    }

    function renderTable() {
        const data = getData();
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Belum ada riwayat pengajuan layanan. Silakan ajukan layanan terlebih dahulu.</td></tr>';
            return;
        }

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const tr = document.createElement('tr');

            tr.innerHTML =
                '<td>' + formatTanggal(item.tglPinjam) + '</td>' +
                '<td>Peminjaman</td>' +
                '<td>' + getJudulBuku(item.buku) + '</td>' +
                '<td>' + hitungHari(item.tglPinjam, item.tglKembali) + '</td>' +
                '<td><span class="status pending">' + item.status + '</span></td>' +
                '<td>' +
                    '<button class="btn-edit" data-id="' + item.id + '" style="background:none; border:none; color:#2563eb; cursor:pointer; margin-right:8px; font-weight:bold;">Edit</button>' +
                    '<button class="btn-hapus" data-id="' + item.id + '" style="background:none; border:none; color:#dc2626; cursor:pointer; font-weight:bold;">Hapus</button>' +
                '</td>';

            tbody.appendChild(tr);
        }

        const btnEdit = document.querySelectorAll('.btn-edit');
        btnEdit.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                window.location.href = 'layanan.html?edit=' + id;
            });
        });

        const btnHapus = document.querySelectorAll('.btn-hapus');
        btnHapus.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = Number(this.getAttribute('data-id'));
                if (confirm('Apakah kamu yakin ingin menghapus data ini?')) {
                    let data = getData();
                    data = data.filter(function(item) { return item.id !== id; });
                    saveData(data);
                    renderTable();
                }
            });
        });
    }
}

function initStatistik() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const data = getData();
    const totalPeminjaman = data.length;
    const targetStats = [28, totalPeminjaman, 0];

    statNumbers.forEach((stat, index) => {
        let current = 0;
        const target = targetStats[index];

        if (target === 0) {
            stat.innerText = "0";
            return;
        }

        const increment = Math.max(1, Math.ceil(target / 20));
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.innerText = current;
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initForm();
    initRiwayat();
    initStatistik();
}); // test aldo
