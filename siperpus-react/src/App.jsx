import { useState, useEffect } from 'react';
import Katalog from './components/Katalog';
import Layanan from './components/Layanan';
import Riwayat from './components/Riwayat';

export default function App() {
  const [halamanAktif, setHalamanAktif] = useState('Beranda');
  const [dataBuku, setDataBuku] = useState([]);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [dataEditRiwayat, setDataEditRiwayat] = useState(null);
  const [notifikasi, setNotifikasi] = useState(null);

  const pemicuNotifikasi = (pesan, tipe = 'sukses') => {
    setNotifikasi({ pesan, tipe });
    setTimeout(() => setNotifikasi(null), 4000);
  };

  useEffect(() => {
    const memoriBuku = localStorage.getItem('siperpus_buku');
    const memoriRiwayat = localStorage.getItem('siperpus_riwayat');

    if (memoriBuku) {
      setDataBuku(JSON.parse(memoriBuku));
    } else {
      setDataBuku([
        { id: 1, judul: 'Pengantar Teknik Industri', penulis: 'Sritomo W.', tahun: '2015', jumlah: '12' },
        { id: 2, judul: 'Dasar Pemrograman Web', penulis: 'Joy Nasten', tahun: '2024', jumlah: '7' },
        { id: 3, judul: 'Tata Letak Pabrik', penulis: 'Sritomo W.', tahun: '2018', jumlah: '5' }
      ]);
    }

    if (memoriRiwayat) setDataRiwayat(JSON.parse(memoriRiwayat));
  }, []);

  useEffect(() => {
    localStorage.setItem('siperpus_buku', JSON.stringify(dataBuku));
  }, [dataBuku]);

  useEffect(() => {
    localStorage.setItem('siperpus_riwayat', JSON.stringify(dataRiwayat));
  }, [dataRiwayat]);

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayStr();

  const jmlTotal = dataRiwayat.length;
  const jmlSelesai = dataRiwayat.filter(r => r.status === 'Selesai').length;
  const jmlAktif = dataRiwayat.filter(r => r.status !== 'Selesai' && r.tglKembali >= todayStr).length;
  const jmlTerlambat = dataRiwayat.filter(r => r.status !== 'Selesai' && r.tglKembali < todayStr).length;

  return (
    <>
    {notifikasi && (
      <div className="fixed top-24 right-4 z-50 animate-fade-in-up flex justify-end">
        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl shadow-xl border w-max max-w-[90vw] ${
          notifikasi.tipe === 'bahaya' 
          ? 'bg-rose-50 border-rose-200 text-rose-800' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
        <span className="font-medium text-sm whitespace-nowrap">{notifikasi.pesan}</span>
        <button
          onClick={() => setNotifikasi(null)} 
          className="text-xl font-bold hover:opacity-60 transition-opacity"
        >
          &times;
        </button>
      </div>
    </div>
  )}
     
      <header className="navbar py-0 overflow-hidden">
        <div className="container-khusus navbar-inner h-full flex items-center justify-between">
          
          <button onClick={() => setHalamanAktif('Beranda')} className="logo flex items-center gap-3 h-full py-0">
            <div className="h-[48px] w-[55px] flex items-center justify-center overflow-hidden bg-white rounded-sm shadow-inner">
              <img 
                src="/logoperpusweb.png" 
                alt="Logo SIPERPUS" 
                className="h-full w-full object-cover scale-125" 
                onError={(e) => { e.target.src = "https://placehold.co/100x100/2563eb/ffffff?text=S" }} 
              />
            </div>
            <span className="font-bold text-white tracking-wide">SIPERPUS</span>
          </button>
          
          <nav>
            <ul className="nav-menu">
              <li><button onClick={() => setHalamanAktif('Beranda')} className={halamanAktif === 'Beranda' ? 'active' : ''}>Beranda</button></li>
              <li><button onClick={() => setHalamanAktif('Katalog')} className={halamanAktif === 'Katalog' ? 'active' : ''}>Katalog Buku</button></li>
              <li><button onClick={() => { setHalamanAktif('Layanan'); setDataEditRiwayat(null); }} className={halamanAktif === 'Layanan' ? 'active' : ''}>Ajukan Layanan</button></li>
              <li><button onClick={() => setHalamanAktif('Riwayat')} className={halamanAktif === 'Riwayat' ? 'active' : ''}>Riwayat</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container-khusus content-wrapper min-h-screen pb-12">
        {halamanAktif === 'Beranda' && (
          <div className="animate-fade-in-up">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 mt-1">Selamat datang di Sistem Informasi Perpustakaan</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <small className="text-slate-500 font-semibold mb-2">Total Peminjaman</small>
                <h2 className="text-3xl font-black text-slate-800 mb-3">{jmlTotal}</h2>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded w-max">Semua Data</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <small className="text-slate-500 font-semibold mb-2">Sedang Dipinjam</small>
                <h2 className="text-3xl font-black text-slate-800 mb-3">{jmlAktif}</h2>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded w-max">Status Aktif</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <small className="text-slate-500 font-semibold mb-2">Selesai Dipinjam</small>
                <h2 className="text-3xl font-black text-slate-800 mb-3">{jmlSelesai}</h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded w-max">Dikembalikan</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <small className="text-slate-500 font-semibold mb-2">Terlambat</small>
                <h2 className="text-3xl font-black text-slate-800 mb-3">{jmlTerlambat}</h2>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded w-max">Perlu tindakan</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg m-0">Peminjaman Terbaru</h3>
                <button
                  onClick={() => { setHalamanAktif('Layanan'); setDataEditRiwayat(null); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  + Tambah Peminjaman
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-blue-50 text-slate-600 text-xs uppercase tracking-wider border-b border-blue-100">
                      <th className="p-4 font-bold">Nama Mahasiswa</th>
                      <th className="p-4 font-bold">NIM</th>
                      <th className="p-4 font-bold">Judul Buku</th>
                      <th className="p-4 font-bold">Tanggal Kembali</th>
                      <th className="p-4 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRiwayat.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">
                          Belum ada data peminjaman di sistem.
                        </td>
                      </tr>
                    ) : (
                      dataRiwayat.slice(0, 5).map((row) => {
                        let badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
                        let statusText = ' Sedang Dipinjam';

                        if (row.status === 'Selesai') {
                          badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          statusText = ' Selesai';
                        } else if (row.tglKembali < todayStr) {
                          badgeClass = 'bg-rose-100 text-rose-800 border-rose-200';
                          statusText = ' Terlambat';
                        }

                        return (
                          <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition text-sm">
                            <td className="p-4 font-semibold text-slate-800">{row.nama}</td>
                            <td className="p-4 text-slate-500 font-mono text-xs">{row.nim}</td>
                            <td className="p-4 text-slate-700 font-medium">{row.judulBuku}</td>
                            <td className="p-4 text-slate-600">{row.tglKembali}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {dataRiwayat.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <button onClick={() => setHalamanAktif('Riwayat')} className="text-blue-600 hover:text-blue-800 font-bold text-sm hover:underline transition">
                    Lihat semua riwayat peminjaman &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {halamanAktif === 'Katalog' && <Katalog dataBuku={dataBuku} setDataBuku={setDataBuku} pemicuNotifikasi={pemicuNotifikasi} />}
        {halamanAktif === 'Layanan' && <Layanan dataBuku={dataBuku} dataRiwayat={dataRiwayat} setDataRiwayat={setDataRiwayat} dataEditRiwayat={dataEditRiwayat} setDataEditRiwayat={setDataEditRiwayat} setHalamanAktif={setHalamanAktif} pemicuNotifikasi={pemicuNotifikasi} />}
        {halamanAktif === 'Riwayat' && <Riwayat dataRiwayat={dataRiwayat} setDataRiwayat={setDataRiwayat} setHalamanAktif={setHalamanAktif} setDataEditRiwayat={setDataEditRiwayat} pemicuNotifikasi={pemicuNotifikasi} />}
      </main>

      <footer className="footer">
        <div className="container-khusus footer-inner">
          <div>
            <strong>SIPERPUS</strong>
            <p>Platform digital untuk manajemen perpustakaan dan peminjaman buku mahasiswa.</p>
          </div>
          <div className="footer-nav">
            <h4>Navigasi</h4>
            <ul>
              <li><button onClick={() => setHalamanAktif('Beranda')} className="hover:text-blue-400">Beranda</button></li>
              <li><button onClick={() => setHalamanAktif('Katalog')} className="hover:text-blue-400">Katalog Buku</button></li>
              <li><button onClick={() => setHalamanAktif('Layanan')} className="hover:text-blue-400">Ajukan Layanan</button></li>
              <li><button onClick={() => setHalamanAktif('Riwayat')} className="hover:text-blue-400">Riwayat</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container-khusus">
            <p>&copy; 2026 SIPERPUS - Dibuat untuk Ujian Akhir Semester Pemrograman Web</p>
          </div>
        </div>
      </footer>
    </>
  );
}