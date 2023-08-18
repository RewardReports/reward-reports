document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabs li');
    const sections = document.querySelectorAll('.section');
    const leftScanItems = document.querySelectorAll('.sections-head');
    const leftScanItemsAll = document.querySelectorAll('.sections li');
    const subsections = document.querySelectorAll('.sections ul');
    const contentSections = document.querySelectorAll('.content-section');
    const buildReportButton = document.getElementById('build');
    const uploadReportButton = document.getElementById('upload');
    const preBuildMainContent = document.querySelector('.main-content.pre-build');
    const buildMainContent = document.querySelector('.main-content.build');
    const editButtons = document.querySelectorAll('.edit-button');
    const authorForm = document.querySelector('.author-form');
    const cancelButton = document.getElementById('cancel-button');
    const saveButton = document.getElementById('save-button');
    const infoIcons = document.querySelectorAll('.info');
    const hiddenInfoDivs = document.querySelectorAll('.hidden-info');



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

    leftScanItemsAll.forEach((item) => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = document.querySelector(`#${targetId}`);
            console.log(targetSection.id)
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

            // Hide all other sections
            sections.forEach(otherSection => {
                if (otherSection !== section) {
                    otherSection.style.display = 'none';
                }
            });
            
            subsections.forEach(subsection => {
                subsection.contentEditable = true;
                subsection.dataset.originalContent = subsection.textContent;
            });

            button.textContent = 'Editing';
            button.classList.add('editing-button');
            button.removeEventListener('click', () => {});

            authorForm.style.display = 'block';
        });
    });

    
    // document.getElementById('export-button').addEventListener('click', () => {
    //     const sections = document.querySelectorAll('.section');
    //     let markdownContent = '';
    
    //     sections.forEach(section => {
    //         markdownContent += `# ${section.querySelector('h3').textContent}\n\n`;
    
    //         const subsections = section.querySelectorAll('.subsection');
    
    //         subsections.forEach(subsection => {
    //             const title = subsection.querySelector('h4').textContent;
    //             const content = subsection.querySelector('p').textContent;
    
    //             markdownContent += `## ${title}\n\n${content}\n\n`;
    //         });
    
    //         markdownContent += '\n';
    //     });
    
    //     const blob = new Blob([markdownContent], { type: 'text/plain;charset=utf-8' });
    //     const filename = 'reward_report.md';
        
    //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //         window.navigator.msSaveOrOpenBlob(blob, filename);
    //     } else {
    //         const url = URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = filename;
    //         link.click();
    //         URL.revokeObjectURL(url);
    //     }
    // });

    document.getElementById('export-button').addEventListener('click', () => {
        const sections = document.querySelectorAll('.section');
        let markdownContent = '';
    
        sections.forEach(section => {
            markdownContent += `# ${section.querySelector('h3').textContent}\n\n`;
    
            const subsections = section.querySelectorAll('.subsection');
    
            subsections.forEach(subsection => {
                const title = subsection.querySelector('h4').textContent;
                const content = subsection.querySelector('p').textContent;
    
                markdownContent += `## ${title}\n\n${content}\n\n`;
            });
    
            markdownContent += '\n';
        });
    
        const now = new Date();
        const formattedDate = now.toISOString().replace(/:/g, '-'); // Replace colons with dashes
        const folderName = `reward_reports_${formattedDate}`;
        const markdownFileName = `reward_report_${formattedDate}.md`;
    
        const zip = new JSZip();
        const folder = zip.folder(folderName);
        folder.file(markdownFileName, markdownContent);
    
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            const filename = `${folderName}.zip`;
    
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(content, filename);
            } else {
                const url = URL.createObjectURL(content);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                URL.revokeObjectURL(url);
            }
        });
    });
    
    
    cancelButton.addEventListener('click', () => {
        // Show a confirmation dialog before proceeding
        const confirmCancel = confirm('Are you sure you want to cancel? Any unsaved changes will be discarded.');
        if (confirmCancel) {
            const paragraphs = document.querySelectorAll('p[data-original-content]');
            paragraphs.forEach((paragraph) => {
                paragraph.textContent = paragraph.dataset.originalContent;
            });
            paragraphs.forEach(subsection => {
                subsection.contentEditable = false;
            });
            authorForm.style.display = 'none';
            editButtons.forEach((button) => {
                button.textContent = 'Edit';
                button.classList.remove('editing-button');
            });  
            sections.forEach(section => {
                section.style.display = 'block';
            });
        }
        
    });

    saveButton.addEventListener('click', () => {
        const subsections = document.querySelectorAll('.subsection p');
            
        subsections.forEach(subsection => {
            subsection.contentEditable = false;
        });

        sections.forEach(section => {
            section.style.display = 'block';
        });

        authorForm.style.display = 'none';
        editButtons.forEach((button) => {
            button.textContent = 'Edit';
            button.classList.remove('editing-button');
        });  
    });

    infoIcons.forEach((icon) => {
        icon.addEventListener('mouseover', (event) => {
            const targetId = icon.closest('.subsection').id + '-info';
            const targetInfoDiv = document.querySelector(`[data-target="${targetId}"]`);
            const scrollTop = window.scrollY || window.pageYOffset;

    
            if (targetInfoDiv) {
                targetInfoDiv.style.left = event.clientX + 'px';
                targetInfoDiv.style.top = (event.clientY + scrollTop - 50) + 'px';
                targetInfoDiv.classList.add('show-info');
            }
        });
    
        icon.addEventListener('mouseout', () => {
            hiddenInfoDivs.forEach((div) => {
                div.classList.remove('show-info');
            });
        });
    });    
    
    

    tabs[0].click();
    leftScanItems[0].classList.add('active-section');
    subsections[0].classList.add('active-sub')
});