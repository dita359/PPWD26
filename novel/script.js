/* ============================================================
   WARUNG ICE CREAM - JQUERY SCRIPT
   Praktikum Pemrograman Web Dasar
   ============================================================ */

$(document).ready(function() {

    /* =====================================================
       1. DATA PRODUK
       ===================================================== */
    const produkData = [
        { id: 1, nama: 'Es Krim Cokelat', harga: 15000, kategori: 'es-krim', icon: '🍫', desc: 'Cokelat premium lembut', badge: 'Best Seller', badgeType: 'hot' },
        { id: 2, nama: 'Es Krim Strawberry', harga: 15000, kategori: 'es-krim', icon: '🍓', desc: 'Stroberi segar asli', badge: 'Favorit', badgeType: '' },
        { id: 3, nama: 'Es Krim Vanilla', harga: 13000, kategori: 'es-krim', icon: '🍦', desc: 'Vanilla klasik creamy', badge: '', badgeType: '' },
        { id: 4, nama: 'Es Krim Mangga', harga: 16000, kategori: 'es-krim', icon: '🥭', desc: 'Mangga manis tropis', badge: 'Baru', badgeType: '' },
        { id: 5, nama: 'Sundae Cokelat', harga: 25000, kategori: 'sundae', icon: '🍨', desc: 'Sundae dengan topping cokelat', badge: 'Best Seller', badgeType: 'hot' },
        { id: 6, nama: 'Sundae Keju', harga: 27000, kategori: 'sundae', icon: '🧀', desc: 'Sundae topping keju melimpah', badge: '', badgeType: '' },
        { id: 7, nama: 'Sundae Buah', harga: 28000, kategori: 'sundae', icon: '🍧', desc: 'Sundae dengan buah segar', badge: 'Favorit', badgeType: '' },
        { id: 8, nama: 'Milkshake Cokelat', harga: 20000, kategori: 'minuman', icon: '🥤', desc: 'Milkshake cokelat dingin', badge: '', badgeType: '' },
        { id: 9, nama: 'Milkshake Strawberry', harga: 20000, kategori: 'minuman', icon: '🥛', desc: 'Milkshake stroberi segar', badge: 'Baru', badgeType: '' },
        { id: 10, nama: 'Es Teh Manis', harga: 8000, kategori: 'minuman', icon: '🧊', desc: 'Es teh manis segar', badge: '', badgeType: '' },
        { id: 11, nama: 'Es Jeruk', harga: 10000, kategori: 'minuman', icon: '🍊', desc: 'Es jeruk peras asli', badge: '', badgeType: '' },
        { id: 12, nama: 'Float Ice Cream', harga: 22000, kategori: 'minuman', icon: '🍹', desc: 'Minuman soda dengan es krim', badge: 'Best Seller', badgeType: 'hot' }
    ];

    /* =====================================================
       2. STATE (Variabel Global)
       ===================================================== */
    let cart = [];               // Array keranjang belanja
    let currentFilter = 'all';   // Filter kategori aktif
    let searchKeyword = '';      // Kata kunci pencarian

    /* =====================================================
       3. FUNGSI RENDER PRODUK
       ===================================================== */
    function renderProduk() {
        const $grid = $('#produkGrid');
        $grid.empty();

        // Filter data berdasarkan kategori & pencarian
        const filtered = produkData.filter(function(p) {
            const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
            const matchSearch =
                p.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                p.desc.toLowerCase().includes(searchKeyword.toLowerCase());
            return matchKategori && matchSearch;
        });

        // Jika tidak ada hasil
        if (filtered.length === 0) {
            $grid.html(`
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #bbb;">
                    <i class="fas fa-search" style="font-size: 3.5rem; color: #ffe4ec; margin-bottom: 20px; display: block;"></i>
                    <h3 style="color: #999; font-weight: 600; margin-bottom: 8px;">Produk tidak ditemukan</h3>
                    <p style="font-size: 0.9rem;">Coba kata kunci atau kategori lain</p>
                </div>
            `);
            return;
        }

        // Render setiap produk
        filtered.forEach(function(p) {
            const badgeHtml = p.badge
                ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>`
                : '';

            const card = `
                <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
                    ${badgeHtml}
                    <div class="produk-img">${p.icon}</div>
                    <div class="produk-info">
                        <h3>${p.nama}</h3>
                        <p class="desc">${p.desc}</p>
                        <div class="produk-footer">
                            <div class="produk-price">
                                Rp ${p.harga.toLocaleString('id-ID')}
                                <small>per porsi</small>
                            </div>
                            <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $grid.append(card);
        });
    }

    /* =====================================================
       4. EVENT: FILTER KATEGORI (Navbar)
       ===================================================== */
    $('.nav-link').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');

        // Sync dengan tombol filter
        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');

        renderProduk();
    });

    /* =====================================================
       5. EVENT: FILTER KATEGORI (Tombol)
       ===================================================== */
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('cat');

        // Sync dengan menu navbar
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');

        renderProduk();
    });

    /* =====================================================
       6. EVENT: PENCARIAN REAL-TIME
       ===================================================== */
    $('#searchProduk').on('input', function() {
        searchKeyword = $(this).val();
        renderProduk();
    });

    /* =====================================================
       7. EVENT: TAMBAH KE KERANJANG
       ===================================================== */
    $(document).on('click', '.btn-add-cart', function(e) {
        e.stopPropagation();

        const id = $(this).data('id');
        const produk = produkData.find(p => p.id === id);
        if (!produk) return;

        // Cek apakah produk sudah ada di keranjang
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: produk.id,
                nama: produk.nama,
                harga: produk.harga,
                icon: produk.icon,
                qty: 1
            });
        }

        updateCartUI();
        showToast(`${produk.icon} ${produk.nama} ditambahkan!`);

        // Animasi tombol
        $(this).css('transform', 'rotate(90deg) scale(1.3)');
        setTimeout(() => $(this).css('transform', ''), 300);

        // Animasi badge
        $('#cartBadge').css('transform', 'scale(1.4)');
        setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
    });

    /* =====================================================
       8. FUNGSI UPDATE UI KERANJANG
       ===================================================== */
    function updateCartUI() {
        const $cartItems = $('#cartItems');
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        let totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

        // Update badge keranjang
        $('#cartBadge').text(totalQty);

        // Update total harga (diskon 10% jika total > Rp 100.000)
        if (totalHarga > 100000) {
            const diskon = totalHarga * 0.1;
            totalHarga -= diskon;
            $('#cartTotal').html(`
                <small style="display:block;text-align:right;text-decoration:line-through;color:#999;font-size:0.75rem;font-weight:400;">Rp ${(totalHarga + diskon).toLocaleString('id-ID')}</small>
                <small style="display:block;text-align:right;color:#2ecc71;font-size:0.75rem;font-weight:700;">Diskon 10% (-Rp ${diskon.toLocaleString('id-ID')})</small>
                Rp ${totalHarga.toLocaleString('id-ID')}
            `);
        } else {
            $('#cartTotal').text('Rp ' + totalHarga.toLocaleString('id-ID'));
        }

        // Jika kosong
        if (cart.length === 0) {
            $cartItems.html(`
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang masih kosong</p>
                    <small>Yuk pilih es krim dulu!</small>
                </div>
            `);
            return;
        }

        // Render item keranjang
        let html = '';
        cart.forEach(function(item) {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-icon">${item.icon}</div>
                    <div class="cart-item-info">
                        <h5>${item.nama}</h5>
                        <div class="price">Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</div>
                        <div class="qty-control">
                            <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        $cartItems.html(html);
    }

    /* =====================================================
       9. EVENT: KONTROL QTY (Plus/Minus)
       ===================================================== */
    $(document).on('click', '.qty-btn', function() {
        const action = $(this).data('action');
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (action === 'plus') {
            item.qty += 1;
        } else if (action === 'minus') {
            item.qty -= 1;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        updateCartUI();
    });

    /* =====================================================
       10. EVENT: HAPUS ITEM DARI KERANJANG
       ===================================================== */
    $(document).on('click', '.cart-item-remove', function() {
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (item) {
            showToast(`${item.icon} ${item.nama} dihapus dari keranjang`);
        }
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    });

    /* =====================================================
       11. EVENT: BUKA/TUTUP KERANJANG
       ===================================================== */
    $('#cartBtn').click(function() {
        $('#cartSidebar').addClass('open');
        $('#cartOverlay').fadeIn(300);
    });

    $('#cartClose, #cartOverlay').click(function() {
        $('#cartSidebar').removeClass('open');
        $('#cartOverlay').fadeOut(300);
    });

    /* =====================================================
       12. EVENT: CHECKOUT
       ===================================================== */
    // Hitung ringkasan pesanan (total setelah diskon, qty, info diskon)
    function hitungRingkasan() {
        let total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        let infoDiskon = '';
        if (total > 100000) {
            total -= total * 0.1; // diskon 10%
            infoDiskon = ' (diskon 10%)';
        }
        const qty = cart.reduce((sum, item) => sum + item.qty, 0);
        return { total, qty, infoDiskon };
    }

    // Tombol Checkout di keranjang -> buka modal form pembeli
    $('#btnCheckout').click(function() {
        if (cart.length === 0) {
            showToast('❌ Keranjang masih kosong!');
            return;
        }
        const r = hitungRingkasan();
        $('#modalSummary').html(
            `${r.qty} item · <strong>Rp ${r.total.toLocaleString('id-ID')}</strong>${r.infoDiskon}`
        );
        bukaModal();
    });

    /* =====================================================
       12b. MODAL FORM DATA PEMBELI + VALIDASI
       ===================================================== */
    function bukaModal() {
        $('#formPembeli')[0].reset();
        $('.form-group').removeClass('error valid');
        $('.form-error').text('');
        $('#modalOverlay').addClass('show');
        setTimeout(() => $('#inputNama').trigger('focus'), 100);
    }

    function tutupModal() {
        $('#modalOverlay').removeClass('show');
    }

    $('#modalClose, #btnBatal').click(tutupModal);

    // Klik area gelap di luar modal untuk menutup
    $('#modalOverlay').click(function(e) {
        if (e.target === this) tutupModal();
    });

    // Tombol ESC menutup modal
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') tutupModal();
    });

    // Aturan validasi tiap field (mengembalikan pesan error atau '')
    const validators = {
        inputNama: function(v) {
            v = v.trim();
            if (!v) return 'Nama wajib diisi.';
            if (v.length < 3) return 'Nama minimal 3 karakter.';
            if (!/^[A-Za-z\s.'-]+$/.test(v)) return 'Nama hanya boleh berisi huruf.';
            return '';
        },
        inputAlamat: function(v) {
            v = v.trim();
            if (!v) return 'Alamat wajib diisi.';
            if (v.length < 10) return 'Alamat minimal 10 karakter (contoh: Jl. Ahmad Yani No. 10).';
            return '';
        },
        inputHp: function(v) {
            v = v.replace(/[\s-]/g, '');
            if (!v) return 'No HP wajib diisi.';
            if (!/^[0-9+]+$/.test(v)) return 'No HP hanya boleh berisi angka.';
            if (!/^(\+62|62|0)8[0-9]{8,11}$/.test(v)) return 'Format No HP tidak valid (contoh: 081234567890).';
            return '';
        }
    };

    function validasiField($input) {
        const id = $input.attr('id');
        const pesan = validators[id]($input.val());
        const $group = $input.closest('.form-group');
        $group.find('.form-error').text(pesan);
        $group.toggleClass('error', pesan !== '').toggleClass('valid', pesan === '');
        return pesan === '';
    }

    // Validasi real-time saat mengetik / meninggalkan field
    $('#formPembeli input, #formPembeli textarea').on('blur input', function() {
        if ($(this).val() !== '' || $(this).closest('.form-group').hasClass('error')) {
            validasiField($(this));
        }
    });

    // Submit form -> validasi semua field -> proses checkout
    $('#formPembeli').on('submit', function(e) {
        e.preventDefault();

        let semuaValid = true;
        let $pertamaError = null;
        $('#formPembeli input, #formPembeli textarea').each(function() {
            if (!validasiField($(this))) {
                semuaValid = false;
                if (!$pertamaError) $pertamaError = $(this);
            }
        });

        if (!semuaValid) {
            $pertamaError.trigger('focus');
            return;
        }

        const pembeli = {
            nama: $('#inputNama').val().trim(),
            alamat: $('#inputAlamat').val().trim(),
            hp: $('#inputHp').val().replace(/[\s-]/g, '')
        };
        const r = hitungRingkasan();
        const items = cart.map(i => ({ nama: i.nama, harga: i.harga, qty: i.qty }));

        // Animasi loading
        const $btn = $('#btnKonfirmasi');
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

        setTimeout(function() {
            $btn.html('<i class="fas fa-check-circle"></i> Konfirmasi Pesanan').prop('disabled', false);

            // Simpan riwayat ke localStorage
            simpanRiwayat(r.total, r.qty, pembeli, items);

            // Reset keranjang
            cart = [];
            updateCartUI();

            // Tutup modal & sidebar
            tutupModal();
            $('#cartSidebar').removeClass('open');
            $('#cartOverlay').fadeOut(300);

            showToast(`✅ Terima kasih, ${pembeli.nama}! ${r.qty} item · Rp ${r.total.toLocaleString('id-ID')}${r.infoDiskon}`);
        }, 1500);
    });

    /* =====================================================
       12c. SIMPAN RIWAYAT KE LOCALSTORAGE
       ===================================================== */
    function simpanRiwayat(total, qty, pembeli, items) {
        try {
            const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
            riwayat.push({
                tanggal: new Date().toISOString(),
                total: total,
                qty: qty,
                pembeli: pembeli,
                items: items
            });
            localStorage.setItem('riwayat', JSON.stringify(riwayat));
            console.log('Riwayat tersimpan. Total transaksi:', riwayat.length);
        } catch (err) {
            console.error('Gagal menyimpan riwayat:', err);
        }
    }

    /* =====================================================
       12d. TOMBOL & MODAL RIWAYAT
       ===================================================== */
    function renderRiwayat() {
        let data = [];
        try { data = JSON.parse(localStorage.getItem('riwayat')) || []; } catch (e) {}
        if (!data.length) {
            $('#riwayatList').html('<div class="cart-empty"><i class="fas fa-receipt"></i><p>Belum ada riwayat pesanan</p></div>');
            return;
        }
        let html = '';
        data.slice().reverse().forEach(function(r, i) {
            const tgl = new Date(r.tanggal).toLocaleString('id-ID');
            const nama = r.pembeli ? r.pembeli.nama : '-';
            const list = (r.items || []).map(it => `${it.nama} x${it.qty}`).join(', ');
            html += `<div class="modal-summary">
                <strong>#${data.length - i} · ${tgl}</strong><br>
                ${nama}${r.pembeli ? ' · ' + r.pembeli.hp : ''}<br>
                ${r.pembeli ? r.pembeli.alamat + '<br>' : ''}
                ${list ? list + '<br>' : ''}
                ${r.qty} item · <strong>Rp ${r.total.toLocaleString('id-ID')}</strong>
            </div>`;
        });
        $('#riwayatList').html(html);
    }

    $('#riwayatBtn').click(function() {
        renderRiwayat();
        $('#riwayatOverlay').addClass('show');
    });

    $('#riwayatClose').click(function() { $('#riwayatOverlay').removeClass('show'); });

    $('#riwayatOverlay').click(function(e) {
        if (e.target === this) $(this).removeClass('show');
    });

    $('#riwayatHapus').click(function() {
        if (confirm('Hapus semua riwayat?')) {
            localStorage.removeItem('riwayat');
            renderRiwayat();
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') $('#riwayatOverlay').removeClass('show');
    });

    /* =====================================================
       13. FUNGSI TOAST NOTIFICATION
       ===================================================== */
    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        $('#toastMsg').text(message);
        $('#toast').addClass('show');
        toastTimer = setTimeout(function() {
            $('#toast').removeClass('show');
        }, 2500);
    }

    /* =====================================================
       14. EVENT: HAMBURGER MENU (Mobile)
       ===================================================== */
    $('#hamburger').click(function() {
        $('#navMenu').toggleClass('show');
        const icon = $(this).find('i');
        if ($('#navMenu').hasClass('show')) {
            icon.removeClass('fa-bars').addClass('fa-times');
        } else {
            icon.removeClass('fa-times').addClass('fa-bars');
        }
    });

    // Tutup menu saat link diklik (mobile)
    $('.nav-link').click(function() {
        if (window.innerWidth <= 768) {
            $('#navMenu').removeClass('show');
            $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
        }
    });

    /* =====================================================
       15. INISIALISASI APLIKASI
       ===================================================== */
    renderProduk();
    updateCartUI();

    // Log ke console
    console.log('%c🍦 Warung Ice Cream - Siap!', 'color:#ff6b9d;font-size:16px;font-weight:bold;');
    console.log('%cTotal produk: ' + produkData.length, 'color:#2d1b3d;font-size:12px;');
});