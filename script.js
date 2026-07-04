function getData() {
    const raw = localStorage.getItem('siperpus_data');
    return raw ? JSON.parse(raw) : [];
}

function saveData(data) {
    localStorage.setItem('siperpus_data', JSON.stringify(data));
}

function formatTanggal (dateStr) {
    if (!dateStr) return '-';
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'okt', 'Nov', 'Des'];
    const d = new Date(dateStr);
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

function hitungHari (tglPinjam, tglKembali) {
    const start = new Date(tglPinjam);
    const end = new Date(tglKembali);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + "hari";
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
        const tglkembali = document.getElementById('tglKembali').value;
        const catatan = document.getElementById('catatan').value.trim();

        if (isNaN(nim)) {
            alert('❌ Error: NIM harus berupa angka!');
            return;
        }
        if (tglkembali < tglPinjam) {
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
                    data[i].tglPinjam = tglpinjam;
                    data[i].tglkembali = tglKembali;
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
                tglpinjam: tglpinjam,
                tglKembali: tglkembali,
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