// ========================================
// UNDANGAN DIGITAL - MAIN JAVASCRIPT
// Versi Google Sheets Backend (FINAL FIX)
// ========================================

// ===== DATA DEFAULT (FALLBACK SAJA) =====
const DEFAULT_DATA = {
  nama_acara: "Haflah At Tasyakur Likhtitam Al Qur'an wal Kutub ke-XII",
  subtitle: "We Invite You To",
  nama_tamu: "Bapak/Ibu/Saudara/i",
  desc_cover: "Tanpa Mengurangi Rasa Hormat, Kami Mengundang Bapak/Ibu/Saudara/i untuk Hadir di Acara Kami.",
  foto_sampul: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/upload/galery/1680314176.jpeg",
  foto_akhir: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/upload/galery/1680314192.jpeg",
  akhir_kata: "Merupakan Suatu Kebahagiaan dan Kehormatan bagi Kami, Apabila Bapak/Ibu/Saudara/i, Berkenan Hadir di Acara kami",
  ucapan_pembuka: "<p><strong>بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيْ</strong></p><p>ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ</p><p>Dengan memohon ridho Allah SWT., kami keluarga besar Pondok Pesantren Al Husna bermaksud untuk menyelenggarakan Haflah At Tasyakur Likhtitam Al Qur'an wal Kutub ke-XII.</p>",
  doa: "لجنة حفله التشكر لاختتام القران والكتب",
  deskripsi_acara: "Haflah attasyakur likhtitam AlQur'an wal kutub merupakan kegiatan akhiruddirosah pondok pesantren Al Husna payaman yang dilaksanakan setiap dua tahun sekali sebagai wujud syukur kepada Allah swt.",
  hari_acara: "Senin, 08 Mei 2023",
  tanggal_acara: "2023-05-08",
  waktu_acara: "Pukul 18:00 WIB Sampai Selesai",
  lokasi_acara: "Halaman Pondok Pesantren Al Husna",
  pembicara: "KH. Thoifur Mawardi",
  ucapan_penutup: "Besar harapan kami apabila Bapak/Ibu/Saudara/i berkenan untuk menghadiri acara tersebut. Demikian pemberitahuan yang dapat kami sampaikan, atas perhatiannya kami ucapkan terimakasih.",
  link_maps: "https://goo.gl/maps/hovfxnkdwJH4WVDc9",
  embed_maps: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3956.318819741475!2d110.2257257147759!3d-7.42992749463963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMjUnNDcuNyJTIDExMMKwMTMnNDAuNSJF!5e0!3m2!1sid!2sid!4v1680313757205!5m2!1sid!2sid",
  musik_url: "https://media.indoinvite.com/2db3bf1e16cd47a08843bb881e39cce7:indoinvite-staging/indoinvite-staging/indoinvite-staging/nikah/upload/25426/suara_ucapan.mp3",
  musik_alt: "",
  autoplay: true,
  watermark: "@ysiroo",
  animasi_ucapan: true,
  countdown: true,
  gallery: [],
  timeline: [],
  ucapan: []
};

// ===== FALLBACK MUSIC =====
const MUSIC_FALLBACKS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
];

// ===== STATE =====
let DATA = {};
let isDataLoaded = false;

// ===== UTILITY =====
function safeGet(id) {
  return document.getElementById(id);
}

// ===== LOAD DATA (DARI API / CACHE / DEFAULT) =====
async function loadData() {
  // 1. Coba dari API (Google Sheets)
  const apiData = await apiFetchAll();

  if (apiData) {
    // Deep merge dengan default untuk field yang mungkin belum ada
    DATA = deepMerge(DEFAULT_DATA, apiData);
  } else {
    // 2. Fallback ke default
    DATA = deepMerge({}, DEFAULT_DATA);
  }

  isDataLoaded = true;
}

// ===== RENDER DATA KE HALAMAN =====
function renderData() {
  // Cover
  const elNamaAcaraCover = safeGet('display-nama-acara-cover');
  if (elNamaAcaraCover) elNamaAcaraCover.textContent = DATA.nama_acara || '';

  // Nama Tamu (dari URL ?kpd= atau localStorage)
  const elNamaTamu = safeGet('display-nama-tamu');
  if (elNamaTamu) {
    const urlParams = new URLSearchParams(window.location.search);
    const kpd = urlParams.get('kpd');
    if (kpd) {
      elNamaTamu.textContent = decodeURIComponent(kpd);
      try { localStorage.setItem('nama_tamu', decodeURIComponent(kpd)); } catch(e) {}
    } else {
      let saved = '';
      try { saved = localStorage.getItem('nama_tamu') || ''; } catch(e) {}
      elNamaTamu.textContent = saved || DATA.nama_tamu || '';
    }
  }

  // Header
  const elNamaAcaraHeader = safeGet('display-nama-acara-header');
  if (elNamaAcaraHeader) elNamaAcaraHeader.textContent = DATA.nama_acara || '';

  // Ucapan Pembuka (HTML allowed - trusted admin content only)
  const elUcapanPembuka = safeGet('display-ucapan-pembuka');
  if (elUcapanPembuka) elUcapanPembuka.innerHTML = DATA.ucapan_pembuka || '';

  // Foto Sampul
  const fotoSampul = document.querySelector('.foto-sampul');
  if (fotoSampul && DATA.foto_sampul) {
    fotoSampul.style.backgroundImage = "url('" + DATA.foto_sampul + "')";
  }

  // Doa
  const elDoa = safeGet('display-doa');
  if (elDoa) elDoa.textContent = DATA.doa || '';

  // Deskripsi Acara
  const elDeskripsi = safeGet('display-deskripsi-acara');
  if (elDeskripsi) elDeskripsi.textContent = DATA.deskripsi_acara || '';

  // Badge
  const elNamaAcaraBadge = safeGet('display-nama-acara-badge');
  if (elNamaAcaraBadge) elNamaAcaraBadge.textContent = DATA.nama_acara || '';

  // Tanggal
  const elHariAcara = safeGet('display-tanggal-acara');
  if (elHariAcara) elHariAcara.textContent = DATA.hari_acara || '';

  // Waktu
  const elWaktuAcara = safeGet('display-waktu-acara');
  if (elWaktuAcara) elWaktuAcara.textContent = DATA.waktu_acara || '';

  // Lokasi + Pembicara
  const elLokasi = safeGet('display-lokasi-acara');
  if (elLokasi) {
    elLokasi.innerHTML = escapeHtml(DATA.lokasi_acara || '') +
      '<br>Pembicara : <span id="display-pembicara">' +
      escapeHtml(DATA.pembicara || '') + '</span>';
  }

  // Maps
  const elLinkMaps = safeGet('link-maps');
  if (elLinkMaps) elLinkMaps.href = DATA.link_maps || '#';

  const elEmbedMaps = safeGet('embed-maps');
  if (elEmbedMaps && DATA.embed_maps) elEmbedMaps.src = DATA.embed_maps;

  // Ucapan Penutup
  const elUcapanPenutup = safeGet('display-ucapan-penutup');
  if (elUcapanPenutup) elUcapanPenutup.textContent = DATA.ucapan_penutup || '';

  // Foto Akhir
  const fotoAkhir = document.querySelector('.foto-sampul-akhir');
  if (fotoAkhir && DATA.foto_akhir) {
    fotoAkhir.style.backgroundImage = "url('" + DATA.foto_akhir + "')";
  }

  // Nama Acara Akhir
  const elNamaAcaraAkhir = safeGet('display-nama-acara-akhir');
  if (elNamaAcaraAkhir) elNamaAcaraAkhir.textContent = DATA.nama_acara || '';

  // Akhir Kata
  const elAkhirKata = safeGet('display-akhir-kata');
  if (elAkhirKata) elAkhirKata.textContent = DATA.akhir_kata || '';

  // Watermark
  const elWatermark = document.querySelector('.watermark');
  if (elWatermark) {
    elWatermark.innerHTML = '<span id="icon-at" class="icon-at">@</span>' +
      escapeHtml(DATA.watermark || 'ysiroo').replace('@', '');
    attachIconAtListener();
  }

  // Audio
  setupAudio();

  // Render dynamic sections
  renderGallery();
  renderTimeline();
  renderUcapanList();
}

// ===== SETUP AUDIO =====
function setupAudio() {
  const audio = safeGet('audio-bg');
  if (!audio) return;

  audio.volume = 0.5;
  const musicUrl = DATA.musik_url;

  if (musicUrl) {
    audio.innerHTML = '';
    const source = document.createElement('source');
    source.src = musicUrl;
    source.type = guessAudioType(musicUrl);
    audio.appendChild(source);

    MUSIC_FALLBACKS.forEach(function(url) {
      const fs = document.createElement('source');
      fs.src = url;
      fs.type = 'audio/mpeg';
      audio.appendChild(fs);
    });

    audio.load();
  }

  audio.addEventListener('error', function() {
    console.warn('Audio error, trying fallback...');
    loadFallbackMusic(audio);
  }, true);
}

function guessAudioType(url) {
  if (!url) return 'audio/mpeg';
  const lower = url.toLowerCase();
  if (lower.includes('.ogg')) return 'audio/ogg';
  if (lower.includes('.wav')) return 'audio/wav';
  if (lower.includes('.m4a')) return 'audio/mp4';
  if (lower.includes('.aac')) return 'audio/aac';
  return 'audio/mpeg';
}

function loadFallbackMusic(audio) {
  if (!audio) return;
  audio.innerHTML = '';
  MUSIC_FALLBACKS.forEach(function(url) {
    const s = document.createElement('source');
    s.src = url;
    s.type = 'audio/mpeg';
    audio.appendChild(s);
  });
  audio.load();
}

// ===== RENDER GALLERY (XSS SAFE) =====
function renderGallery() {
  const container = safeGet('gallery-container');
  if (!container) return;

  if (!DATA.gallery || DATA.gallery.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#fff;grid-column:1/-1;">Belum ada foto</p>';
    return;
  }

  container.innerHTML = DATA.gallery.map(function(item, i) {
    if (!item || !item.url) return '';
    return '<div class="gallery-item" data-aos="fade-up" data-aos-delay="' + (i * 100) + '">' +
      '<img src="' + escapeHtml(item.url) + '" alt="' + escapeHtml(item.caption || 'Foto') +
      '" loading="lazy" onerror="this.style.display=\'none\'">' +
      (item.caption ? '<div class="caption">' + escapeHtml(item.caption) + '</div>' : '') +
      '</div>';
  }).join('');
}

// ===== RENDER TIMELINE (XSS SAFE) =====
function renderTimeline() {
  const container = safeGet('timeline-container');
  if (!container) return;

  if (!DATA.timeline || DATA.timeline.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#fff;">Belum ada susunan acara</p>';
    return;
  }

  container.innerHTML = DATA.timeline.map(function(item, i) {
    if (!item) return '';
    return '<div class="timeline-item" data-aos="fade-up" data-aos-delay="' + (i * 100) + '">' +
      '<div class="timeline-content">' +
      '<div class="timeline-waktu">' + escapeHtml(item.waktu || '') + '</div>' +
      '<div class="timeline-acara">' + escapeHtml(item.acara || '') + '</div>' +
      '</div></div>';
  }).join('');
}

// ===== RENDER UCAPAN (XSS SAFE) =====
function renderUcapanList() {
  const container = safeGet('box-ucapan');
  if (!container) return;

  const list = DATA.ucapan || [];
  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Belum ada ucapan. Jadilah yang pertama!</p>';
    return;
  }

  container.innerHTML = list.map(function(u, i) {
    if (!u) return '';
    const isHadir = u.ket_hadir == '1';
    return '<div class="ucapan-item" data-aos="fade-up" data-aos-delay="' + (i * 50) + '">' +
      '<div class="nama">' + escapeHtml(u.nama || 'Anonim') +
      ' <span class="badge-hadir ' + (isHadir ? 'hadir' : 'tidak-hadir') + '">' +
      (isHadir ? '✓ Hadir' : '✗ Tidak Hadir') + '</span>' +
      (u.jumlah && isHadir ? '<small style="color:#999;margin-left:5px;">(' + escapeHtml(u.jumlah) + ' orang)</small>' : '') +
      '</div>' +
      '<div class="tanggal">' + escapeHtml(u.tanggal || '') + '</div>' +
      '<div class="isi">' + escapeHtml(u.ucapan || '') + '</div>' +
      '</div>';
  }).join('');
}

// ===== COUNTDOWN (FIX: Berhenti saat selesai) =====
function startCountdown() {
  if (DATA.countdown === false) {
    const el = safeGet('countdown');
    if (el) el.style.display = 'none';
    return;
  }

  let targetDate;
  if (DATA.tanggal_acara) {
    const parts = DATA.tanggal_acara.split('-');
    if (parts.length === 3) {
      let hours = 18, minutes = 0;
      if (DATA.waktu_acara) {
        const m = DATA.waktu_acara.match(/(\d{1,2}):(\d{2})/);
        if (m) { hours = parseInt(m[1]); minutes = parseInt(m[2]); }
      }
      targetDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), hours, minutes, 0);
    }
  }

  if (!targetDate || isNaN(targetDate.getTime())) {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
  }

  const intervalId = setInterval(function() {
    const daysEl = safeGet('days');
    const hoursEl = safeGet('hours');
    const minutesEl = safeGet('minutes');
    const secondsEl = safeGet('seconds');
    if (!daysEl) return;

    const distance = targetDate.getTime() - Date.now();

    if (distance < 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      clearInterval(intervalId); // ← BERHENTI
      return;
    }

    daysEl.textContent = Math.floor(distance / 86400000);
    hoursEl.textContent = Math.floor((distance % 86400000) / 3600000);
    minutesEl.textContent = Math.floor((distance % 3600000) / 60000);
    secondsEl.textContent = Math.floor((distance % 60000) / 1000);
  }, 1000);
}

// ===== FORM UCAPAN (FIX: Kirim ke API) =====
function initFormUcapan() {
  const form = safeGet('form-ucapan');
  if (!form) return;

  const kehadiranSelect = safeGet('input-kehadiran');
  const jumlahGroup = safeGet('jumlah-group');

  if (kehadiranSelect) {
    kehadiranSelect.addEventListener('change', function() {
      if (jumlahGroup) {
        jumlahGroup.style.display = (this.value === '1') ? 'block' : 'none';
      }
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const inputNama = safeGet('input-nama');
    const inputUcapan = safeGet('input-ucapan');
    const inputKehadiran = safeGet('input-kehadiran');
    const inputJumlah = safeGet('input-jumlah');

    if (!inputNama || !inputUcapan || !inputKehadiran) return;

    const nama = inputNama.value.trim();
    const ucapan = inputUcapan.value.trim();
    const ket_hadir = inputKehadiran.value;
    const jumlah = inputJumlah ? inputJumlah.value : '1';

    if (!nama || !ucapan || !ket_hadir) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    const newUcapan = {
      nama: nama,
      ucapan: ucapan,
      ket_hadir: ket_hadir,
      jumlah: ket_hadir === '1' ? jumlah : '0',
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    };

    // Tambah ke data lokal (instant feedback)
    if (!DATA.ucapan) DATA.ucapan = [];
    DATA.ucapan.unshift(newUcapan);
    renderUcapanList();
    if (typeof AOS !== 'undefined' && AOS.refresh) AOS.refresh();

    // Kirim ke API di background (fire & forget)
    apiAddUcapan(newUcapan).then(function(ok) {
      if (ok) console.log('✓ Ucapan tersimpan ke server');
      else console.warn('⚠ Ucapan hanya tersimpan lokal');
    });

    // Update cache
    try {
      localStorage.setItem(API_CONFIG.cacheKey, JSON.stringify(DATA));
    } catch(e) {}

    // Reset form
    form.reset();
    if (jumlahGroup) jumlahGroup.style.display = 'none';

    // Animasi
    showAnimasiUcapan(newUcapan);

    // Feedback tombol
    const btn = form.querySelector('.btn-kirim');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Terkirim!';
      btn.style.background = '#27ae60';
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.background = '';
      }, 2000);
    }
  });
}

// ===== ANIMASI UCAPAN =====
function showAnimasiUcapan(ucapanData) {
  if (!ucapanData || DATA.animasi_ucapan === false) return;

  const animasi = safeGet('animasi-ucapan');
  const animNama = safeGet('anim-nama');
  const animUcapan = safeGet('anim-ucapan');
  if (!animasi || !animNama || !animUcapan) return;

  animNama.textContent = ucapanData.nama || '';
  animUcapan.textContent = ucapanData.ucapan || '';
  animasi.classList.add('show');

  setTimeout(function() { animasi.classList.remove('show'); }, 5000);
}

function startAutoAnimasiUcapan() {
  if (DATA.animasi_ucapan === false) return;
  if (!DATA.ucapan || DATA.ucapan.length === 0) return;

  setInterval(function() {
    if (DATA.ucapan && DATA.ucapan.length > 0) {
      const idx = Math.floor(Math.random() * DATA.ucapan.length);
      showAnimasiUcapan(DATA.ucapan[idx]);
    }
  }, 8000);
}

// ===== AUDIO CONTROL =====
let isMusicPlaying = false;

function toggleMusic() {
  const audio = safeGet('audio-bg');
  const btn = safeGet('btn-music');
  if (!audio) return;

  if (audio.paused) {
    const p = audio.play();
    if (p !== undefined) {
      p.then(function() {
        isMusicPlaying = true;
        if (btn) {
          btn.innerHTML = '<i class="fa fa-pause"></i>';
          btn.classList.add('active');
        }
      }).catch(function() {
        showAutoplayHint();
      });
    }
  } else {
    audio.pause();
    isMusicPlaying = false;
    if (btn) {
      btn.innerHTML = '<i class="fa fa-music"></i>';
      btn.classList.remove('active');
    }
  }
}

function showAutoplayHint() {
  const hint = document.createElement('div');
  hint.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);' +
    'background:rgba(10,135,142,0.95);color:white;padding:12px 20px;border-radius:25px;' +
    'z-index:9999;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.2);' +
    'animation:fadeInUp 0.5s ease;';
  hint.innerHTML = '🎵 Klik icon musik untuk mengaktifkan suara';
  document.body.appendChild(hint);
  setTimeout(function() {
    hint.style.opacity = '0';
    hint.style.transition = 'opacity 0.5s';
    setTimeout(function() { hint.remove(); }, 500);
  }, 4000);
}

function initAudio() {
  const audio = safeGet('audio-bg');
  if (!audio) return;

  if (DATA.autoplay !== false) {
    const btnBuka = safeGet('btn-buka-undangan');
    if (btnBuka) {
      btnBuka.addEventListener('click', function() {
        setTimeout(function() {
          const p = audio.play();
          if (p !== undefined) {
            p.then(function() {
              isMusicPlaying = true;
              const btn = safeGet('btn-music');
              if (btn) {
                btn.innerHTML = '<i class="fa fa-pause"></i>';
                btn.classList.add('active');
              }
            }).catch(function() {
              showAutoplayHint();
            });
          }
        }, 800);
      });
    }
  }
}

// ===== COVER / BUKA UNDANGAN (FIX FINAL: HAPUS TOTAL DARI DOM) =====
function initCover() {
  const btnBuka = safeGet('btn-buka-undangan');
  const cover = safeGet('cover');
  const fixMenu = safeGet('fix-menu');
  if (!btnBuka || !cover) return;

  btnBuka.addEventListener('click', function() {
    // 1. Tambahkan class untuk animasi fade out
    cover.classList.add('cover-opened');
    
    // 2. HAPUS TOTAL elemen cover setelah animasi selesai (1 detik)
    setTimeout(function() {
      if (cover.parentNode) {
        cover.parentNode.removeChild(cover);
      }
    }, 1000);

    // 3. Tampilkan floating menu
    if (fixMenu) fixMenu.style.display = 'flex';

    // 4. HAPUS TOTAL loading screen dari DOM
    const loading = safeGet('loading-screen');
    if (loading) {
      loading.classList.add('hidden');
      setTimeout(function() {
        if (loading.parentNode) loading.remove();
      }, 500); 
    }

    // 5. Init AOS HANYA SEKALI, setelah cover mulai hilang
    setTimeout(function() {
      if (typeof AOS !== 'undefined' && AOS.init) {
        AOS.init({ 
          duration: 1000, 
          once: true, 
          offset: 50 
        });
        // Force refresh AOS agar langsung mendeteksi elemen di layar
        setTimeout(function() {
          if (typeof AOS !== 'undefined' && AOS.refresh) {
            AOS.refresh();
          }
        }, 100);
      }
    }, 1200);

    // 6. Jalankan animasi ucapan floating setelah 3 detik
    setTimeout(startAutoAnimasiUcapan, 3000);
  });
}

// ===== SCROLL FUNCTIONS =====
function scrollToHome() {
  const el = document.querySelector('.header-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function scrollToUcapan() {
  const el = document.querySelector('.rsvp-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function scrollToGallery() {
  const el = document.querySelector('.story-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function scrollToMap() {
  const el = document.querySelector('.acara-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function scrollToBox2() {
  const el = document.querySelector('.couple-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== ICON @ 5X KLIK → LOGIN =====
let clickCount = 0;
let clickTimer = null;

function attachIconAtListener() {
  const iconAt = safeGet('icon-at');
  if (!iconAt) return;

  iconAt.addEventListener('click', function() {
    clickCount++;
    this.classList.add('clicked');
    setTimeout(function() { iconAt.classList.remove('clicked'); }, 300);

    if (clickCount === 1) {
      clickTimer = setTimeout(function() { clickCount = 0; }, 2000);
    }

    if (clickCount >= 5) {
      clearTimeout(clickTimer);
      clickCount = 0;
      openModalLogin();
    }
  });
}

// ===== MODAL LOGIN (FIX: Validasi via API) =====
function openModalLogin() {
  const modal = safeGet('modal-login');
  if (modal) {
    modal.classList.add('active');
    const input = safeGet('input-password');
    if (input) input.focus();
  }
}

function closeModalLogin() {
  const modal = safeGet('modal-login');
  if (modal) {
    modal.classList.remove('active');
    const input = safeGet('input-password');
    if (input) input.value = '';
    const error = safeGet('login-error');
    if (error) error.textContent = '';
  }
}

async function submitLogin() {
  const input = safeGet('input-password');
  const error = safeGet('login-error');
  if (!input) return;

  const password = input.value;
  if (!password) {
    if (error) error.textContent = 'Masukkan password!';
    return;
  }

  const submitBtn = document.querySelector('.btn-submit');
  const origBtnText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) { submitBtn.textContent = 'Memverifikasi...'; submitBtn.disabled = true; }

  try {
    console.log('%c=== DEBUG LOGIN START ===', 'color: red; font-weight: bold');
    console.log('Mencoba menghubungi:', API_CONFIG.baseUrl);

    // Langsung panggil API mentah tanpa helper, supaya error aslinya KELIHATAN
    const res = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', password: password })
    });

    const textResponse = await res.text(); // Baca sebagai teks dulu
    console.log('Response mentah dari Google:\n', textResponse);

    let json;
    try {
      json = JSON.parse(textResponse); // Coba parse ke JSON
    } catch(e) {
      throw new Error('Google memblokir! Buka URL API manual di Tab Baru untuk otorisasi.');
    }

    if (submitBtn) { submitBtn.textContent = origBtnText; submitBtn.disabled = false; }

    if (json.success === true) {
      if (error) error.textContent = '';
      sessionStorage.setItem('admin_auth', 'authenticated');
      sessionStorage.setItem('admin_key', password);
      closeModalLogin();
      window.location.href = 'admin.html';
    } else {
      // Tampilkan pesan error ASLI dari server
      let errorMsg = json.error || 'Unknown error';
      if (errorMsg.includes('Google memblokir')) {
        errorMsg = 'URL API belum di-otorisasi. Lihat Console (F12) untuk cara memperbaikinya.';
      }
      if (error) error.textContent = errorMsg;
      input.value = '';
      input.focus();
    }
  } catch (err) {
    console.error('ERROR PADA FETCH:', err);
    if (submitBtn) { submitBtn.textContent = origBtnText; submitBtn.disabled = false; }
    if (error) {
      error.innerHTML = 'Gagal terhubung ke server.<br><small style="color:#666">Buka URL API di tab baru untuk izinkan akses Google.</small>';
    }
  }
}

  // Tampilkan loading state
  const submitBtn = document.querySelector('.btn-submit');
  const origBtnText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) { submitBtn.textContent = 'Memverifikasi...'; submitBtn.disabled = true; }

  // Validasi via API
  const success = await apiLogin(password);

  if (submitBtn) { submitBtn.textContent = origBtnText; submitBtn.disabled = false; }

  if (success) {
    if (error) error.textContent = '';
    // Simpan session
    sessionStorage.setItem('admin_auth', 'authenticated');
    sessionStorage.setItem('admin_key', password);
    closeModalLogin();
    window.location.href = 'admin.html';
  } else {
    if (error) error.textContent = 'Password salah!';
    input.value = '';
    input.focus();
  }
}

// ===== SCROLL SPY =====
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const menuItems = document.querySelectorAll('.menu-item');
  if (sections.length === 0 || menuItems.length === 0) return;

  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(function(section) {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id');
      }
    });
    menuItems.forEach(function(item) { item.classList.remove('active'); });
    if (current === 'cover' || current === 'header') {
      if (menuItems[0]) menuItems[0].classList.add('active');
    } else if (current === 'rsvp') {
      if (menuItems[1]) menuItems[1].classList.add('active');
    } else if (current === 'story') {
      if (menuItems[2]) menuItems[2].classList.add('active');
    } else if (current === 'acara') {
      if (menuItems[3]) menuItems[3].classList.add('active');
    }
  });
}

// ===== EXPOSE FUNCTIONS =====
window.scrollToHome = scrollToHome;
window.scrollToUcapan = scrollToUcapan;
window.scrollToGallery = scrollToGallery;
window.scrollToMap = scrollToMap;
window.scrollToBox2 = scrollToBox2;
window.toggleMusic = toggleMusic;
window.closeModalLogin = closeModalLogin;
window.submitLogin = submitLogin;

// ===== INIT (ASYNC) =====
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // 1. Load data dari API
    await loadData();

    // 2. Render ke halaman
    renderData();

    // 3. Init components
    startCountdown();
    initFormUcapan();
    initAudio();
    initCover();
    initScrollSpy();

    // 4. JANGAN init AOS di sini — tunggu sampai cover dibuka
    // 5. JANGAN auto-hide loading screen — tunggu klik "Buka"

    // Enter key untuk login
    const inputPassword = safeGet('input-password');
    if (inputPassword) {
      inputPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitLogin();
      });
    }

    // Safety: HAPUS loading total jika setelah 15 detik user tidak klik
    setTimeout(function() {
      const loading = safeGet('loading-screen');
      const cover = safeGet('cover');
      if (loading && !loading.classList.contains('hidden')) {
        loading.classList.add('hidden');
        if (loading.parentNode) loading.remove();
      }
      if (cover && !cover.classList.contains('cover-opened')) {
        if (cover.parentNode) cover.parentNode.removeChild(cover);
        if (typeof AOS !== 'undefined' && AOS.init) {
          AOS.init({ duration: 1000, once: true, offset: 50 });
          AOS.refresh();
        }
        const fixMenu = safeGet('fix-menu');
        if (fixMenu) fixMenu.style.display = 'flex';
      }
    }, 15000);

    console.log('%c🎉 Undangan Digital Loaded (Sheets Backend)', 'color:#0A878E;font-size:16px;font-weight:bold;');
  } catch (err) {
    console.error('Init error:', err);

    // Fallback: tetap render dengan default data
    DATA = deepMerge({}, DEFAULT_DATA);
    renderData();
    startCountdown();
    initFormUcapan();
    initAudio();
    initCover();
  }
});
