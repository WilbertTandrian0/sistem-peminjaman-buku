export default function Riwayat({ dataRiwayat, setDataRiwayat, setHalamanAktif, setDataEditRiwayat, pemicuNotifikasi }) {

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayStr();

  const handleHapus = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus arsip riwayat aktivitas ini?')) {
      setDataRiwayat(dataRiwayat.filter(r => r.id !== id));
      pemicuNotifikasi(' Data riwayat aktivitas berhasil dihapus.', 'bahaya');
    }
  };

  const handleEditRedirect = (data) => {
    setDataEditRiwayat(data);
    setHalamanAktif('Layanan');
  };

  const handleKembalikanBuku = (id) => {
    if (confirm('Konfirmasi: Tandai buku ini telah dikembalikan oleh mahasiswa?')) {
      setDataRiwayat(dataRiwayat.map(r => r.id === id ? { ...r, status: 'Selesai' } : r));
      pemicuNotifikasi(' Buku telah berhasil dikembalikan!', 'sukses');
    }
  };

  return (
    <section className="section animate-fade-in-up">
      <h1 className="section-title">Riwayat Aktivitas</h1>
      <p className="section-desc text-center">Pantau semua aktivitas peminjaman dan pengajuan layanan Mahasiswa</p>

      <div className="table-container mt-8 shadow-sm overflow-x-auto">
        <table className="custom-table w-full min-w-[900px]">
          <thead>
            <tr>
              <th>Peminjam</th>
              <th>Buku & Catatan</th>
              <th className="text-center">Tanggal</th>
              <th className="text-center">Status</th>
              <th className="text-center">Penyelesaian</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataRiwayat.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-500 font-medium bg-slate-50/40">
                  Belum ada data. {' '}
                  <button
                    onClick={() => {
                      setDataEditRiwayat(null);
                      setHalamanAktif('Layanan');
                    }}
                    className="text-blue-500 hover:text-blue-700 font-semibold hover:underline transition ml-1"
                  >
                    Tambah sekarang &rarr;
                  </button>
                </td>
              </tr>
            ) : (
              dataRiwayat.map((row) => {

                let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
                let statusText = ' Sedang Dipinjam';

                if (row.status === 'Selesai') {
                  badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  statusText = ' Selesai';
                } else if (row.tglKembali < todayStr) {
                  badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
                  statusText = ' Terlambat';
                }

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="font-bold">{row.nama}</div>
                      <div className="text-xs text-slate-500 mt-1">NIM: {row.nim}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-700">{row.judulBuku}</div>
                      {row.catatan && <div className="text-xs text-slate-500 italic mt-1">"{row.catatan}"</div>}
                    </td>
                    <td className="text-center text-sm">
                      <div>Mulai: {row.tglPinjam}</div>
                      <div className="text-blue-600 mt-1">Kembali: {row.tglKembali}</div>
                    </td>

                    <td className="text-center align-middle">
                      <span className={`inline-block whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border ${badgeClass}`}>
                        {statusText}
                        </span>
                    </td>

                    <td className="text-center">
                      {row.status === 'Selesai' ? (
                        <span className="text-emerald-600 font-bold text-sm">Tuntas</span>
                      ) : (
                        <button
                          onClick={() => handleKembalikanBuku(row.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Buku telah dikembalikan
                        </button>
                      )}
                    </td>
                    
                    <td className="text-center">
                      {row.status === 'Selesai' ? (
                        <span className="text-slate-400 font-bold text-sm"></span>
                      ) : (
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => handleEditRedirect(row)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition">Ubah</button>
                          <button onClick={() => handleHapus(row.id)} className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition">Hapus</button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}