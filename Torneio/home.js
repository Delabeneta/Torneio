document.addEventListener('DOMContentLoaded', function() {
            updateCountdown();
            setInterval(updateCountdown, 1000);
        });

        function updateCountdown() {
            // Data do torneio - SUBSTITUA PELA DATA REAL
            const tournamentDate = new Date('2025-10-19T08:00:00').getTime();
            const now = new Date().getTime();
            const distance = tournamentDate - now;

            if (distance < 0) {
                document.getElementById('countdown').innerHTML = '<div class="countdown-finished">O torneio já começou!</div>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerHTML = String(days).padStart(2, '0');
            document.getElementById('hours').innerHTML = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerHTML = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerHTML = String(seconds).padStart(2, '0');
        }

        function scrollToSection(id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        }

        function shareOnWhatsApp() {
            const text = encodeURIComponent('Olá, gostaria de tirar dúvidas sobre o torneio de vôlei');
            const url = `https://wa.me/+5521974563511?text=${text}`;
            window.open(url, '_blank');
        }
  