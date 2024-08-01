document.addEventListener('DOMContentLoaded', function() {
    function showInicioIfNoTarget() {
        const sections = document.querySelectorAll('section');
        const target = window.location.hash;

        sections.forEach(section => {
            if (!target || target === '#') {
                section.style.display = section.id === 'inicio' ? 'block' : 'none';
            } else {
                section.style.display = section.id === target.substring(1) ? 'block' : 'none';
            }
        });
    }

    window.addEventListener('hashchange', showInicioIfNoTarget);
    showInicioIfNoTarget();
});
