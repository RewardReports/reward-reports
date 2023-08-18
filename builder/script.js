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
    let importedMarkdownFiles = [];


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
            console.log('build');
        }
    });

    uploadReportButton.addEventListener('click', () => {
        // Add functionality for the "Upload Existing Reward Reports" button here
        // This code will run when the "Upload Existing Reward Reports" button is clicked
        console.log('upload');
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
        console.log(importedMarkdownFiles)

        // Export imported markdown files as separate markdown files
        if (importedMarkdownFiles.length > 0) {
            importedMarkdownFiles.forEach(importedFile => {
                folder.file(importedFile.name, importedFile.content);
            });
        }
    
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
        }).catch(function (error) {
            console.error('Error generating ZIP:', error);
        });
    });

    // Function to open the modal
    function openImportModal() {
        const modal = document.getElementById('import-modal');
        modal.style.display = 'block';
    }

    // Function to close the modal
    function closeImportModal() {
        const modal = document.getElementById('import-modal');
        modal.style.display = 'none';
    }

    // Event listener for import button click
    document.getElementById('import-button').addEventListener('click', () => {
        openImportModal();
    });

    // Event listener for cancel button in the modal
    document.getElementById('cancel-import').addEventListener('click', () => {
        closeImportModal();
    });

    function parseMarkdown(markdownContent) {
        const sections = markdownContent.split(/^(?=# [^#])/gm);

    
        sections.forEach(section => {
            const sectionTitle = section.split('\n\n')[0].slice(2); // Remove the '# ' from the title
            const sectionEl = document.querySelector(`[data-target="${sectionTitle.toLowerCase().replace(/\s/g, '-')}"]`);
            console.log(sectionEl)

            if (!sectionEl) {
                return; // Skip if section element not found
            }
    
            const subsections = section.split('## ');
            subsections.shift();
            console.log(subsections)

    
            subsections.forEach((subsection, index) => {
                const lines = subsection.split('\n\n');
                const title = lines[0];
                const content = lines.slice(1).join('\n'); // Join lines using '\n' to maintain line breaks

    
                const subsectionEl = document.getElementById(`${sectionTitle.toLowerCase().replace(/\s/g, '-')}-sub${index + 1}`);
                console.log(subsectionEl)

                if (!subsectionEl) {
                    return; // Skip if subsection element not found
                }
    
                const contentEl = subsectionEl.querySelector('p');
                contentEl.textContent = content;
            });
        });
    }

    // Event listener for confirm import button in the modal
    document.getElementById('confirm-import').addEventListener('click', async () => {
        const importFileInput = document.getElementById('import-file');
        const file = importFileInput.files[0];
    
        if (!file) {
            return;
        }
    
        try {
            const zip = new JSZip();
            const importedZip = await zip.loadAsync(file);

    
            const folderName = Object.keys(importedZip.files)[0];
            console.log('Imported zip folder:', folderName);
            console.log('Zip files:', Object.keys(importedZip.files));
            const folder = importedZip.folder(folderName);
            const markdownFiles = Object.keys(folder.files).filter(fileName => {
                return fileName.startsWith(folderName + 'reward_report_') && fileName.endsWith('.md'); 
            });


            importedMarkdownFiles = await Promise.all(markdownFiles.map(async fileName => {
                const content = await folder.files[fileName].async('string');
                const trimmedFileName = fileName.substring(fileName.lastIndexOf('/') + 1); // Extract file name after last "/"
                return { name: trimmedFileName, content: content };
            }));
    
            if (markdownFiles.length === 1) {
                console.log('Markdown files found:', markdownFiles);
                const markdownContent = await importedZip.files[markdownFiles[0]].async('string');
                // Use the markdown content to populate the HTML page (similar to the export code)
                console.log('Markdown content:', markdownContent);

                // Parse markdown sections
                parseMarkdown(markdownContent)
                

            } else if (markdownFiles.length > 1) {
                console.log('Multiple Markdown files found:', markdownFiles);
                const latestMarkdownFile = markdownFiles.reduce((latestFile, currentFile) => {
                    const latestDateTime = new Date(latestFile.match(/reward_report_(.*)\.md/)[1]);
                    const currentDateTime = new Date(currentFile.match(/reward_report_(.*)\.md/)[1]);
                    return currentDateTime > latestDateTime ? currentFile : latestFile;
                });
    
                const markdownContent = await importedZip.files[latestMarkdownFile].async('string');
                console.log('Latest Markdown files found:', markdownContent);

                // Use the markdown content to populate the HTML page (similar to the export code)
                parseMarkdown(markdownContent);
                console.log("parsed and replaced?");

            } else {
                console.error('No reward report markdown files found.');
            }
        } catch (error) {
            console.error('Error importing reward report:', error);
        }
    
        closeImportModal();
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