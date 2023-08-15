document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabs li');
    const sections = document.querySelectorAll('.section');
    const leftScanItems = document.querySelectorAll('.sections-head');
    const subsections = document.querySelectorAll('.sections ul');

    const offset = 100;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // sections.forEach((section) => {
    //     section.addEventListener('click', () => {
    //         sections.forEach(sec => sec.classList.remove('active-section'));
    //         section.classList.add('active-section');
    //     });
    // });

    leftScanItems.forEach((item) => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = document.querySelector(`#${targetId}`);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.clientHeight;
            const sectionId = section.id;
            const correspondingNavItem = document.querySelector(`.sections li[data-target="${sectionId}"]`);
            
            if (scrollTop >= sectionTop && scrollTop <= sectionBottom) {
                leftScanItems.forEach(li => li.classList.remove('active-section'));
                correspondingNavItem.classList.add('active-section');
                
                subsections.forEach((sub) => {
                    sub.classList.remove('active-sub');
                    if (sub.parentElement.classList.contains('active-section')) {
                        sub.classList.add('active-sub');
                    } 
                });
            
            } 
        });
    });    
    
    
    

    tabs[0].click();
    leftScanItems[0].classList.add('active-section');
    subsections[0].classList.add('active-sub')
});