import { useState } from 'react';

export default function Katalog({ dataBuku, setDataBuku, pemicuNotifikasi }) {
  const kondisiAwal = { id: null, judul: '', penulis: '', tahun: '', jumlah: '' };
  const [form, setForm] = useState(kondisiAwal);
  const [kataKunci, setKataKunci] = useState('');

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSimpan = (e) => {
    e.preventDefault();

    let pesanErrorBaru = {};
    let valid = true;

    if (!form.judul) { pesanErrorBaru.judul = 'Judul buku wajib diisi'; valid = false; }
    if (!form.penulis) { pesanErrorBaru.penulis = 'Nama penulis wajib diisi'; valid = false; }


    if (!form.tahun) {
      pesanErrorBaru.tahun = 'Wajib diisi';
      valid = false;
    } else if (Number(form.tahun) < 0) {
      pesanErrorBaru.tahun = 'Tahun tidak valid';
      valid = false;
    }

    if (!form.jumlah) {
      pesanErrorBaru.jumlah = 'Wajib diisi';
      valid = false;
    } else if (Number(form.jumlah) < 0) {
      pesanErrorBaru.jumlah = 'Tidak valid';
      valid = false;
    }

    if (!valid) {
      setErrors(pesanErrorBaru);
      pemicuNotifikasi(' Mohon periksa kembali kolom yang ditandai merah!', 'bahaya');
      return;
    }

    if (form.id) {
      setDataBuku(dataBuku.map(b => b.id === form.id ? form : b));
      pemicuNotifikasi(' Data buku berhasil diperbarui di katalog!');
    } else {
      setDataBuku([...dataBuku, { ...form, id: Date.now() }]);
      pemicuNotifikasi(' Buku baru berhasil ditambahkan ke katalog!');
    }

    setForm(kondisiAwal);
    setErrors({});
  };

  const handleHapus = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini dari katalog?')) {
      setDataBuku(dataBuku.filter(b => b.id !== id));
      pemicuNotifikasi(' Buku telah dihapus dari katalog.', 'bahaya');
    }
  };

  const handleBatalEdit = () => {
    setForm(kondisiAwal);
    setErrors({});
  };

  const bukuTerfilter = dataBuku.filter(b =>
    b.judul.toLowerCase().includes(kataKunci.toLowerCase()) ||
    b.penulis.toLowerCase().includes(kataKunci.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up section pb-8">
      <h1 className="section-title">Katalog Buku</h1>
      <p className="section-desc text-center mb-5">Kelola dan jelajahi koleksi buku perpustakaan kami</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-24">
          <div className="border-b border-slate-200 pb-3 mb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {form.id ? ' Ubah Data Buku' : ' Tambah Buku Baru'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Lengkapi detail informasi buku di bawah ini.</p>
          </div>

          <form onSubmit={handleSimpan}>
            <div className="form-group mb-3">
              <label className="text-sm">Judul Buku <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Masukkan judul buku"
                value={form.judul}
                onChange={(e) => handleChange('judul', e.target.value)}
                className={`form-control py-1.5 text-sm ${errors.judul ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
              />
              {errors.judul && <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1"> {errors.judul}</p>}
            </div>

            <div className="form-group mb-3">
              <label className="text-sm">Nama Penulis <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Nama penulis buku"
                value={form.penulis}
                onChange={(e) => handleChange('penulis', e.target.value)}
                className={`form-control py-1.5 text-sm ${errors.penulis ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
              />
              {errors.penulis && <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1"> {errors.penulis}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="form-group mb-0">
                <label className="text-sm">Tahun <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  placeholder="2024"
                  value={form.tahun}
                  onChange={(e) => handleChange('tahun', e.target.value)}
                  className={`form-control py-1.5 text-sm ${errors.tahun ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
                />
                {errors.tahun && <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1"> {errors.tahun}</p>}
              </div>

              <div className="form-group mb-0">
                <label className="text-sm">Stok (Eks) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.jumlah}
                  onChange={(e) => handleChange('jumlah', e.target.value)}
                  className={`form-control py-1.5 text-sm ${errors.jumlah ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : ''}`}
                />
                {errors.jumlah && <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1"> {errors.jumlah}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button type="submit" className="btn btn-primary flex-1 text-center py-2 text-sm">
                {form.id ? 'Simpan' : 'Tambahkan'}
              </button>
              {form.id && (
                <button type="button" onClick={handleBatalEdit} className="btn btn-outline flex-1 text-center py-2 text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>


        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 mb-4 flex items-center gap-3">
            <span className="text-xl"></span>
            <input
              type="text"
              placeholder="Cari judul buku atau nama penulis di sini..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>

          <div className="table-container shadow-sm m-0 flex-1 border-slate-200">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Detail Buku</th>
                  <th className="text-center">Tahun</th>
                  <th className="text-center">Stok</th>
                  <th className="text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bukuTerfilter.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-slate-500 font-medium bg-slate-50/40">
                      Belum ada data. {' '}
                      <button
                        type="button"
                        onClick={() => {
                          setKataKunci('');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          document.querySelector('input[placeholder="Masukkan judul buku"]')?.focus();
                        }}
                        className="text-blue-500 hover:text-blue-700 font-semibold hover:underline transition ml-1"
                      >
                        Tambah sekarang &rarr;
                      </button>
                    </td>
                  </tr>
                ) : (
                  bukuTerfilter.map((buku) => (
                    <tr key={buku.id}>
                      <td>
                        <div className="font-bold text-slate-800">{buku.judul}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Penulis: {buku.penulis}</div>
                      </td>
                      <td className="text-center text-sm">{buku.tahun}</td>
                      <td className="text-center">
                        <span className={`status-badge ${Number(buku.jumlah) > 0 ? 'status-success' : 'status-pending'}`}>
                          {buku.jumlah} Eks
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setForm(buku); setErrors({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold hover:bg-blue-100 transition w-full"
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHapus(buku.id)}
                            className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-xs font-bold hover:bg-rose-100 transition w-full"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}