document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabs li');
    const sections = document.querySelectorAll('.section');
    const leftScanItems = document.querySelectorAll('.sections-head');
    const subsections = document.querySelectorAll('.sections ul');
    const contentSections = document.querySelectorAll('.content-section');
    const buildReportButton = document.getElementById('build');
    const uploadReportButton = document.getElementById('upload');
    const preBuildMainContent = document.querySelector('.main-content.pre-build');
    const buildMainContent = document.querySelector('.main-content.build');
    const editButtons = document.querySelectorAll('.edit-button');

    const offset = 100;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetSectionId = tab.textContent.toLowerCase().replace(' ', '-');
            contentSections.forEach(section => {
                if (section.id === targetSectionId) {
                    section.classList.add('active-tab');
                } else {
                    section.classList.remove('active-tab');
                }
            });
        });
    });

    // sections.forEach((section) => {
    //     section.addEventListener('click', () => {
    //         sections.forEach(sec => sec.classList.remove('active-section'));
    //         section.classList.add('active-section');
    //     });
    // });

    buildReportButton.addEventListener('click', () => {
        if (preBuildMainContent.classList.contains('active-mode')) {
            preBuildMainContent.classList.remove('active-mode');
            buildMainContent.classList.add('active-mode');
            console.log('build')
        }
    });

    uploadReportButton.addEventListener('click', () => {
        // Add functionality for the "Upload Existing Reward Reports" button here
        // This code will run when the "Upload Existing Reward Reports" button is clicked
        console.log('upload')
    });

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

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.section');
            const subsections = section.querySelectorAll('.subsection p');
            
            subsections.forEach(subsection => {
                subsection.contentEditable = true;
            });

            button.textContent = 'Editing';
            button.classList.add('editing-button');
            button.removeEventListener('click', () => {});
        });
    });    
    
    
    

    tabs[0].click();
    leftScanItems[0].classList.add('active-section');
    subsections[0].classList.add('active-sub')
});