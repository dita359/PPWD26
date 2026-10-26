jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {

    $('.spine').each(function (i) {
        const tinggi = parseInt($(this).css('--h'), 10) || 280;
        $(this).delay(i * 120).animate({ height: tinggi }, 600);
    });

    $('.book').hover(
        function () { $(this).stop().animate({ top: '-8px' }, 150); },
        function () { $(this).stop().animate({ top: '0px' }, 150); }
    );

    if (window.matchMedia('(hover: hover)').matches) {
        $('.dropdown').hover(
            function () { $(this).find('.dropdown-menu').stop(true, true).slideDown(200); },
            function () { $(this).find('.dropdown-menu').stop(true, true).slideUp(200); }
        );
    } else {
        $('.dropdown-btn').on('click', function () {
            $(this).siblings('.dropdown-menu').stop(true, true).slideToggle(200);
        });
    }

    function filterGenre(genre) {
        $('.tab').removeClass('active').attr('aria-selected', 'false')
            .filter('[data-genre="' + genre + '"]')
            .addClass('active').attr('aria-selected', 'true');

        const $cocok = genre === 'semua' ? $('.book') : $('.book[data-genre="' + genre + '"]');
        $('.book').stop(true, true).hide();
        $cocok.fadeIn(350);
    }

    $('.tab, .dropdown-menu a').on('click', function () {
        filterGenre($(this).data('genre'));
    });

    function tampilkanToast(pesan) {
        $('#toast').stop(true, true).text(pesan).fadeIn(250).delay(2800).fadeOut(400);
    }

    const $btnTop = $('#backToTop');

    $(window).on('scroll', function () {
        $btnTop.stop(true, true)[$(this).scrollTop() > 300 ? 'fadeIn' : 'fadeOut'](200);
    });

    function scrollKe(y) {
        $('html, body').stop(true).animate({ scrollTop: y }, 800);
    }

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const $tujuan = $($(this).attr('href'));
        scrollKe($tujuan.length ? $tujuan.offset().top - 60 : 0);
    });

    $btnTop.on('click', function () { scrollKe(0); });

    $.validator.addMethod('nomorHp', function (v, el) {
        return this.optional(el) || /^[0-9]{10,12}$/.test(v);
    });

    $.validator.addMethod('hurufAngka', function (v, el) {
        return this.optional(el) || (/[A-Za-z]/.test(v) && /[0-9]/.test(v));
    });

    const validator = $('#formMember').validate({
        rules: {
            nama:       { required: true, minlength: 3 },
            email:      { required: true, email: true },
            hp:         { required: true, nomorHp: true },
            kota:       { required: true, minlength: 3 },
            genre:      { required: true },
            password:   { required: true, minlength: 8, hurufAngka: true },
            konfirmasi: { required: true, equalTo: '#mPassword' }
        },
        messages: {
            nama:       { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email:      { required: 'Email wajib diisi', email: 'Format email tidak valid' },
            hp:         { required: 'Nomor WhatsApp wajib diisi', nomorHp: 'Nomor harus 10-12 digit angka' },
            kota:       { required: 'Kota wajib diisi', minlength: 'Nama kota minimal 3 karakter' },
            genre:      { required: 'Pilih satu genre favorit' },
            password:   { required: 'Password wajib diisi', minlength: 'Password minimal 8 karakter', hurufAngka: 'Password harus mengandung huruf dan angka' },
            konfirmasi: { required: 'Konfirmasi password wajib diisi', equalTo: 'Password konfirmasi tidak sama' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        highlight: function (el) {
            $(el).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (el) {
            $(el).removeClass('is-error').addClass('is-valid');
        },
        submitHandler: function (form) {
            tampilkanToast('Selamat datang, ' + $('#mNama').val().trim() + '! Akun member berhasil dibuat.');
            form.reset();
            validator.resetForm();
            $('#formMember .is-error, #formMember .is-valid').removeClass('is-error is-valid');
        }
    });

    $('#formMember input, #formMember select').on('blur keyup change', function () {
        $(this).valid();
        if (this.id === 'mPassword' && $('#mKonfirmasi').val()) $('#mKonfirmasi').valid();
    });

});