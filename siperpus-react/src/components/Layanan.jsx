import { useState, useEffect } from 'react';

export default function Layanan({ dataBuku, dataRiwayat, setDataRiwayat, dataEditRiwayat, setDataEditRiwayat, setHalamanAktif, pemicuNotifikasi }) {
  const kondisiAwal = { nama: '', nim: '', email: '', judulBuku: '', tglPinjam: '', tglKembali: '', catatan: '' };
  const [form, setForm] = useState(kondisiAwal);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dataEditRiwayat) {
      setForm(dataEditRiwayat);
      pemicuNotifikasi(' Data riwayat dimuat kembali ke formulir pengajuan.');
      setErrors({});
    }
  }, [dataEditRiwayat]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let pesanErrorBaru = {};
    let valid = true;

    if (!form.nama) { pesanErrorBaru.nama = 'Nama lengkap wajib diisi'; valid = false; }

    if (!form.nim) {
      pesanErrorBaru.nim = 'NIM wajib diisi'; valid = false;
    } else if (form.nim.length !== 9 || isNaN(form.nim)) {
      pesanErrorBaru.nim = 'NIM harus berisi tepat 9 digit angka'; valid = false;
    }

    if (!form.email) { pesanErrorBaru.email = 'Email wajib diisi'; valid = false; }
    if (!form.judulBuku) { pesanErrorBaru.judulBuku = 'Pilih buku yang ingin dipinjam'; valid = false; }
    if (!form.tglPinjam) { pesanErrorBaru.tglPinjam = 'Tanggal peminjaman wajib diisi'; valid = false; }


    if (!form.tglKembali) {
      pesanErrorBaru.tglKembali = 'Tanggal kembali wajib diisi';
      valid = false;
    } else if (form.tglPinjam && form.tglKembali < form.tglPinjam) {
      pesanErrorBaru.tglKembali = 'Tidak boleh sebelum tanggal pinjam';
      valid = false;
    }

    if (!valid) {
      setErrors(pesanErrorBaru);
      pemicuNotifikasi(' Mohon periksa kembali kolom yang ditandai merah!', 'bahaya');
      return;
    }

    if (dataEditRiwayat) {
      setDataRiwayat(dataRiwayat.map(r => r.id === form.id ? form : r));
      pemicuNotifikasi(' Berhasil: Perubahan riwayat peminjaman mahasiswa telah diperbarui!');
      setDataEditRiwayat(null);
    } else {
      const dataBaru = {
        ...form,
        id: Date.now(),
        tanggalForm: new Date().toLocaleDateString('id-ID'),
        status: 'Aktif'
      };
      setDataRiwayat([dataBaru, ...dataRiwayat]);
      pemicuNotifikasi(' Sukses: Permohonan peminjaman buku perpustakaan berhasil diajukan!');
    }

    setForm(kondisiAwal);
    setErrors({});
    setHalamanAktif('Riwayat');
  };

  return (
    <section className="form-section animate-fade-in-up">
      <h1 className="section-title">{dataEditRiwayat ? 'Modifikasi Pengajuan' : 'Form Peminjaman Buku'}</h1>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <fieldset className="mb-0 h-full">
            <legend>Data Peminjam</legend>
            <div className="form-group">
              <label>Nama Lengkap <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={`form-control ${errors.nama ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
              />
              {errors.nama && <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1"> {errors.nama}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="form-group mb-0">
                <label>NIM <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={form.nim}
                  onChange={(e) => handleChange('nim', e.target.value)}
                  placeholder="Contoh: 123456789"
                  maxLength="9"
                  className={`form-control ${errors.nim ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
                />
                <div className="text-slate-400 text-xs mt-1 mb-1">
                  {form.nim.length}/9 digit
                </div>
                {errors.nim && <p className="text-rose-500 text-xs font-medium flex items-center gap-1"> {errors.nim}</p>}
              </div>

              <div className="form-group mb-0">
                <label>Email <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@mahasiswa"
                  className={`form-control ${errors.email ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
                />
                {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1"> {errors.email}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="mb-0 h-full flex flex-col">
            <legend>Detail Peminjaman</legend>
            <div className="form-group">
              <label>Pilih Buku <span className="text-rose-500">*</span></label>
              <select
                value={form.judulBuku}
                onChange={(e) => handleChange('judulBuku', e.target.value)}
                className={`form-control ${errors.judulBuku ? 'border-rose-400 focus:border-rose-500 bg-rose-50 text-rose-500' : ''}`}
              >
                <option value="">— Pilih Judul Buku —</option>
                {dataBuku.map(b => {
                  const jumlahDipinjam = dataRiwayat.filter(
                    r => r.judulBuku === b.judul && r.status !== 'Selesai'
                  ).length;
                  const sisaBuku = Number(b.jumlah) - jumlahDipinjam;
                  const isSedangEditBukuIni = dataEditRiwayat && dataEditRiwayat.judulBuku === b.judul;
                  const isHabis = sisaBuku <= 0 && !isSedangEditBukuIni;

                  return (
                    <option 
                      key={b.id} 
                      value={b.judul} 
                      disabled={isHabis}
                      className={isHabis ? 'text-slate-400 bg-slate-50' : ''}
                    >
                      {b.judul} {isHabis ? '(Stok Habis)' : `(Sisa: ${isSedangEditBukuIni ? sisaBuku + 1 : sisaBuku} Eks)`}
                    </option>
                  );
                })}
              </select>
              {errors.judulBuku && <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1"> {errors.judulBuku}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="form-group mb-0">
                <label>Tanggal Peminjaman <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  value={form.tglPinjam}
                  onChange={(e) => handleChange('tglPinjam', e.target.value)}
                  className={`form-control ${errors.tglPinjam ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
                />
                {errors.tglPinjam && <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1"> {errors.tglPinjam}</p>}
              </div>

              <div className="form-group mb-0">
                <label>Tanggal Kembali <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  min={form.tglPinjam || ''}
                  value={form.tglKembali}
                  onChange={(e) => handleChange('tglKembali', e.target.value)}
                  className={`form-control ${errors.tglKembali ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
                />
                {errors.tglKembali && <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1"> {errors.tglKembali}</p>}
              </div>
            </div>

            <div className="form-group mt-4 flex-1 flex flex-col">
              <label>Catatan (opsional)</label>
              <textarea
                value={form.catatan}
                onChange={(e) => handleChange('catatan', e.target.value)}
                placeholder="Tuliskan catatan atau alasan peminjaman..."
                className="form-control flex-1 resize-none"
              ></textarea>
            </div>
          </fieldset>
        </div> 

        <div className="flex gap-4 mt-8 md:max-w-md md:mx-auto">
          <button type="button" onClick={() => { setForm(kondisiAwal); setDataEditRiwayat(null); setErrors({}); }} className="btn btn-outline flex-1 text-center">
            Reset Formulir
          </button>
          <button type="submit" className="btn btn-primary flex-1 text-center">
            {dataEditRiwayat ? 'Simpan Perubahan' : 'Kirim Permohonan'}
          </button>
        </div>
      </form>
    </section>
  );
}