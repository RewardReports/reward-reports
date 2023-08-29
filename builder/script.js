document.addEventListener('DOMContentLoaded', () => {

    // CODE FOR NON DESKTOP
    const isMobile = /Mobile|webOS|iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log(isMobile)
    // Get the message container element
    const messageContainer = document.getElementById('message-container')
    // Display the message if user is using a mobile device
    if (isMobile) {
        messageContainer.style.display = 'block';
    }



    // Code for Builder Tab

    const tabs = document.querySelectorAll('.tabs li');
    const sections = document.querySelectorAll('.section');
    const buildTab = document.getElementById('build-report');
    const leftScanItems = buildTab.querySelectorAll('.sections-head');
    const leftScanItemsAll = buildTab.querySelectorAll('.sections li');
    const subsections = buildTab.querySelectorAll('.sections ul');
    const contentSections = document.querySelectorAll('.content-section');
    const buildReportButton = document.getElementById('build');
    const uploadReportButton = document.getElementById('upload');
    const preBuildMainContent = document.querySelector('.main-content.pre-build');
    const buildMainContent = document.querySelector('.main-content.build');
    const draftMainContent = document.querySelector('.main-content.drafts');
    const editButtons = document.querySelectorAll('.edit-button');
    const authorForm = document.querySelector('.author-form');
    const cancelButton = document.getElementById('cancel-button');
    const saveButton = document.getElementById('save-button');
    const publishButton = document.getElementById('publish-button');
    const editorInput = document.getElementById('editor-input');
    const descriptionInput = document.getElementById('description-input');
    const infoIcons = document.querySelectorAll('.info');
    const hiddenInfoDivs = document.querySelectorAll('.hidden-info');
    const lastEditedSection = document.getElementById('last-edit');
    const learnMoreSection = document.getElementById('learn-more');
    const versionHistoryLink = document.getElementById('version-history-link');
    const restartButton = document.getElementById('restart-button');
    const activeDraftButton = document.getElementById('active-draft-button');
    const closeDraftButton = document.getElementById('close-draft-button');




    let importedMarkdownFiles = [];
    let currentEditSection;
    let contextInfo = {};
    let currentContextInfo = {};
    let currentScrollSection = document.getElementById('system-details');

//     const diffString = `diff --git a/sample.js b/sample.js
// index 0000001..0ddf2ba
// --- a/sample.js
// +++ b/sample.js
// @@ -1 +1 @@
// -// console.log("Hello World!")
// +// console.log("Hello from Diff2Html!")`;


    const offset = 100;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetSectionId = tab.textContent.toLowerCase().replace(' ', '-');
            contentSections.forEach(section => {
                if (section.id === targetSectionId) {
                    section.classList.add('active-tab');
                    if (targetSectionId==="version-history"){
                        checkExpendButtonNeed();
                    }
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
            // console.log('build');
        }
        // const subsections = document.querySelectorAll('.subsection p');
        // subsections.forEach(subsection => {
        //     subsection.contentEditable = true;
        //     subsection.innerHTML= "";
        // });

        // editButtons.forEach(button => {
        //     button.style.display = "none";
        // });

        // authorForm.style.display = 'block';

        learnMoreSection.style.display = 'block';
        leftScanItems[0].classList.add('active-section');
        subsections[0].classList.add('active-sub')
        restartButton.style.display = "block";
    });

    uploadReportButton.addEventListener('click', () => {
        openImportModal();
        if (preBuildMainContent.classList.contains('active-mode')) {
            preBuildMainContent.classList.remove('active-mode');
            buildMainContent.classList.add('active-mode');
            // console.log('build');
        }
        learnMoreSection.style.display = 'block';
        leftScanItems[0].classList.add('active-section');
        subsections[0].classList.add('active-sub')
        restartButton.style.display = "block";
    });

    leftScanItemsAll.forEach((item) => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = document.querySelector(`#${targetId}`);
            // console.log(targetSection.id)
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
                currentScrollSection = section;
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
            currentEditSection = section;
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

    closeDraftButton.addEventListener('click', () => {
        closeDraftButton.style.display = "none";
        activeDraftButton.style.display = 'block';
        buildMainContent.classList.add('active-mode');
        draftMainContent.classList.remove('active-mode');
        authorForm.style.display = "none"
        learnMoreSection.style.display = 'block';
        leftScanItems[0].classList.add('active-section');
        subsections[0].classList.add('active-sub');
    });

    activeDraftButton.addEventListener('click', () => {
        closeDraftButton.style.display = "block";
        activeDraftButton.style.display = 'none';
        const activeDrafts = [];
        const draftPagesContainer = document.getElementById('draft-pages-container')
        for (const sectionHead of leftScanItems) {
          const indicator = sectionHead.querySelector('.indicator');
    
          if (indicator && !indicator.classList.contains('hidden')) {
            const dataTarget = sectionHead.getAttribute('data-target');
            activeDrafts.push(dataTarget); // Add data-target to the array
          }
        }
        console.log('Active Drafts:', activeDrafts);

        draftPagesContainer.innerHTML = ''; // Clear the container

        activeDrafts.forEach(draft => {
            const draftDiv = document.createElement('div');
            draftDiv.classList.add('draft-item');
            draftDiv.classList.add('centered-div');
        

            const draftTitle = document.createElement('span');
            draftTitle.textContent = kebabToTitleCase(draft);
            draftDiv.appendChild(draftTitle);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                // Handle the edit button click here, e.g., open an editor for the draft
                console.log(`Edit button clicked for draft ${draft}`);
                closeDraftButton.style.display = "none";
                activeDraftButton.style.display = 'block';
                buildMainContent.classList.add('active-mode');
                draftMainContent.classList.remove('active-mode');
                const section = document.getElementById(draft);
                currentEditSection = section;
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

                mainButton = section.querySelector('.edit-button')

                mainButton.textContent = 'Editing';
                mainButton.classList.add('editing-button');
                mainButton.removeEventListener('click', () => {});
            });
            draftDiv.appendChild(editButton);

            draftPagesContainer.appendChild(draftDiv);
        });





        buildMainContent.classList.remove('active-mode');
        draftMainContent.classList.add('active-mode');
        authorForm.style.display = "block"
        learnMoreSection.style.display = 'none';

        leftScanItems.forEach(item =>{
            item.classList.remove('active-section');
        });
        subsections.forEach(item =>{
            item.classList.remove('active-sub');
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
        // console.log(importedMarkdownFiles)

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

    publishButton.addEventListener('click', async () => {
        // Show a confirmation dialog before proceeding
        const editSubsections = document.querySelectorAll('.subsection p');
        const confirmPublish = confirm('Publishing will publish all pages under drafts.');

       

        if (confirmPublish) {
    
            currentContextInfo = {
                author: editorInput.value,
                description: descriptionInput.value.replace(/\s+/g, ' ')
            };
    
            contextInfo = currentContextInfo;
            
            const sections = document.querySelectorAll('.section');
            let markdownContent = '';

            markdownContent += `<!-- Author: ${contextInfo.author} --> `;
            markdownContent += `<!-- Description: ${contextInfo.description} -->\n\n`;
        
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
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
            const folderName = `reward_reports_${formattedDate}`;
            const markdownFileName = `reward_report_${formattedDate}.md`;
        
            const zip = new JSZip();
            const folder = zip.folder(folderName);
            folder.file(markdownFileName, markdownContent);
            // console.log(importedMarkdownFiles)

             // Update importedMarkdownFiles with the newly generated markdown file
            const newFileContent = await folder.file(markdownFileName).async('string');
            const newFileName = markdownFileName;
            importedMarkdownFiles.push({ name: newFileName, content: newFileContent });

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
            // console.log('Markdown content:', importedMarkdownFiles);
            populateDropdowns();
            populateLastEdit();
            checkExpendButtonNeed2();
            populateVersionTable();
            // populateCheckboxes();
            // currentContextInfo = {};
            authorForm.style.display = 'none';
            currentEditSection = undefined;
            
            sections.forEach(section => {
                section.style.display = 'block';
            });

            editButtons.forEach((button) => {
                button.textContent = 'Edit';
                button.classList.remove('editing-button');
            });  

            editSubsections.forEach(subsection => {
                subsection.contentEditable = false;
            });
            
            const indicators = document.querySelectorAll('.indicator');

            indicators.forEach(indicator => {
                indicator.classList.add('hidden');
            });
            descriptionInput.value = '';
            activeDraftButton.style.display = "none";
        }
    });

    restartButton.addEventListener('click', () => {
        const indicators = document.querySelectorAll('.indicator');

        indicators.forEach(indicator => {
            indicator.classList.add('hidden');
        });
        activeDraftButton.style.display = "none";

        if (buildMainContent.classList.contains('active-mode')) {
            buildMainContent.classList.remove('active-mode');
            preBuildMainContent.classList.add('active-mode');
        }
        learnMoreSection.style.display = 'none';
        lastEditedSection.style.display = 'none';
        leftScanItems.forEach(item => {
            item.classList.remove('active-section');
          });
        subsections.forEach(item => {
            item.classList.remove('active-sub');
          });
        importedMarkdownFiles = [];
        currentEditSection = undefined;
        contextInfo = {};
        currentContextInfo = {};
        authorForm.style.display = 'none';
        populateLastEdit();
        checkExpendButtonNeed2();
        populateVersionTable();
        // populateCheckboxes();
        file1Dropdown.innerHTML = '<option value="" disabled selected>Select a date</option><option disabled="">Publish or import report(s) first</option>';
        file2Dropdown.innerHTML = '<option value="" disabled selected>Select a date</option><option disabled="">Publish or import report(s) first</option>';
        diffContainer.innerHTML = `
            <div class="compare-inplace">
                <svg width="137" height="105" viewBox="0 0 137 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34.4531 37.5C28.8281 37.5 23.6719 40.7812 21.0938 45.9375L0 88.3594V11.25C0 5.15625 4.92188 0 11.25 0H48.75L63.75 15H101.25C107.344 15 112.5 20.1562 112.5 26.25V37.5H34.4531ZM127.266 45C132.891 45 136.641 50.8594 133.828 56.0156L111.328 101.016C110.156 103.594 107.578 105 104.766 105H0L27.8906 49.2188C29.0625 46.6406 31.6406 45 34.4531 45H127.266Z" fill="#8D8F93"></path>
                </svg>
                <p>Select a date first to get started and compare two different versions.</p>
            </div>
        `;        
        originalContainer.innerHTML = `
            <div class="compare-inplace">
                <svg width="137" height="105" viewBox="0 0 137 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34.4531 37.5C28.8281 37.5 23.6719 40.7812 21.0938 45.9375L0 88.3594V11.25C0 5.15625 4.92188 0 11.25 0H48.75L63.75 15H101.25C107.344 15 112.5 20.1562 112.5 26.25V37.5H34.4531ZM127.266 45C132.891 45 136.641 50.8594 133.828 56.0156L111.328 101.016C110.156 103.594 107.578 105 104.766 105H0L27.8906 49.2188C29.0625 46.6406 31.6406 45 34.4531 45H127.266Z" fill="#8D8F93"></path>
                </svg>
                <p>Select a date first to get started and compare two different versions.</p>
            </div>
        `;  
        tbody.innerHTML =`
            <tr>
                <td colspan="7" style="text-align: center; height:60vh;"><i style="color: grey;">Please publish or import report(s) first to view versions.</i>
                </td>
            </tr>
        `;

        restartButton.style.display="none";
    });

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const displayStyle = window.getComputedStyle(authorForm).display;
                restartButton.disabled = displayStyle !== 'none';
            }
        }
    });
    
    // Start observing changes to the 'style' attribute of authorForm
    observer.observe(authorForm, { attributes: true });
    
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
    document.querySelectorAll('.import-button').forEach(button => {
        button.addEventListener('click', () => {
            openImportModal();
        });
    });

    // Event listener for cancel button in the modal
    document.getElementById('cancel-import').addEventListener('click', () => {
        closeImportModal();
    });
    document.getElementById('cancel-import-git').addEventListener('click', () => {
        closeImportModal();
    });

    function parseMarkdown(markdownContent) {
        contextInfo = {}; // Clear contextInfo
        const contextInfoPattern = /<!-- Author: (.+) --> <!-- Description: (.+) -->/;
        const contextInfoMatch = markdownContent.match(contextInfoPattern);
        let authorinfo = '';
        let descriptioninfo = '';
        const WithoutContext = markdownContent.replace(contextInfoPattern, '').trim();
        if (contextInfoMatch) {
            authorinfo = contextInfoMatch[1];
            descriptioninfo = contextInfoMatch[2];
            contextInfo = {
                author: authorinfo,
                description: descriptioninfo
            };
        }

        
        const sections = WithoutContext.split(/^(?=# [^#])/gm);    
        sections.forEach(section => {
            
            const sectionTitleLine = section.split('\n')[0];
            const sectionTitle = sectionTitleLine.slice(2); // Remove the '# ' from the title
            const sectionEl = document.querySelector(`[data-target="${sectionTitle.toLowerCase().replace(/\s/g, '-')}"]`);

            if (!sectionEl) {
                return; // Skip if section element not found
            }
    
            const subsections = section.split('## ');
            subsections.shift();
            // console.log(sectionEl)
            // console.log(sectionTitle)
    
            subsections.forEach((subsection, index) => {
                const lines = subsection.split('\n\n');
                const title = lines[0];
                const content = lines.slice(1).join('\n'); // Join lines using '\n' to maintain line breaks

    
                const subsectionEl = document.getElementById(`${sectionTitle.toLowerCase().replace(/\s/g, '-')}-sub${index + 1}`);
                // console.log(subsectionEl)

                if (!subsectionEl) {
                    return; // Skip if subsection element not found
                }
    
                const contentEl = subsectionEl.querySelector('p');
                contentEl.textContent = content;
            });
        });
        // console.log(contextInfo)
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
            // console.log('Imported zip folder:', folderName);
            // console.log('Zip files:', Object.keys(importedZip.files));
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
                // console.log('Markdown files found:', markdownFiles);
                const markdownContent = await importedZip.files[markdownFiles[0]].async('string');
                
                // Use the markdown content to populate the HTML page (similar to the export code)
                // console.log('Markdown content:', markdownContent);

                // Parse markdown sections
                parseMarkdown(markdownContent);
                populateDropdowns();
                populateLastEdit();
                checkExpendButtonNeed2()
                populateVersionTable();
                // populateCheckboxes();

            } else if (markdownFiles.length > 1) {
                // console.log('Multiple Markdown files found:', markdownFiles);
                const latestMarkdownFile = markdownFiles.reduce((latestFile, currentFile) => {
                    const latestDateString = latestFile.match(/reward_report_(.*).md/)[1].replace(/_/g, ' ');
                    const currentDateString = currentFile.match(/reward_report_(.*).md/)[1].replace(/_/g, ' ');
                    const parts = latestDateString.split(/[- :]/);
                    const year = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
                    const day = parseInt(parts[2]);
                    const hours = parseInt(parts[3]);
                    const minutes = parseInt(parts[4]);
                    const seconds = parseInt(parts[5]);

                    const latestDateTime = new Date(year, month, day, hours, minutes, seconds);

                    const parts2 = currentDateString.split(/[- :]/);
                    const year2 = parseInt(parts2[0]);
                    const month2 = parseInt(parts2[1]) - 1; // Months are zero-based in JavaScript
                    const day2 = parseInt(parts2[2]);
                    const hours2 = parseInt(parts2[3]);
                    const minutes2 = parseInt(parts2[4]);
                    const seconds2 = parseInt(parts2[5]);

                    const currentDateTime = new Date(year2, month2, day2, hours2, minutes2, seconds2);
                    console.log(latestFile.match(/reward_report_(.*).md/)[1])
                    console.log(latestDateTime)

                    return currentDateTime > latestDateTime ? currentFile : latestFile;
                });
    
                const markdownContent = await importedZip.files[latestMarkdownFile].async('string');
                // console.log('Latest Markdown files found:', markdownContent);

                // Use the markdown content to populate the HTML page (similar to the export code)
                parseMarkdown(markdownContent);
                populateDropdowns();
                populateLastEdit();
                checkExpendButtonNeed2()
                populateVersionTable();
                // populateCheckboxes();
                // console.log("parsed and replaced?");

            } else {
                console.error('No reward report markdown files found.');
            }
        } catch (error) {
            console.error('Error importing reward report:', error);
        }
    
        closeImportModal();
        console.log(contextInfo)
    });

    function convertToGitHubAPIUrl(repoUrl) {
        const parts = repoUrl.split('/');
        const username = parts[3];
        const repoName = parts[4];
        const path = parts.slice(7).join('/');
        
        return `https://api.github.com/repos/${username}/${repoName}/contents/${path}`;
    }

    document.getElementById('import-from-github').addEventListener('click', async () => {
        const githubRepositoryUrl = document.getElementById('github-folder-url').value;
        const apiUrl = convertToGitHubAPIUrl(githubRepositoryUrl);
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            const markdownFiles = data.filter(file => (file.name.endsWith('.md') && file.name.startsWith('reward_report_')));
    
            if (markdownFiles.length > 0) {
                for (const file of markdownFiles) {
                    try {
                        const contentResponse = await fetch(file.download_url);
                        const content = await contentResponse.text();
                        
                        // Process the content similar to your existing code
                        const trimmedFileName = file.name.substring(file.name.lastIndexOf('/') + 1);
                        importedMarkdownFiles.push({ name: trimmedFileName, content: content });
    
                    } catch (error) {
                        console.error('Error fetching markdown content:', error);
                    }
                }
    
                const latestMarkdownFile = markdownFiles.reduce((latestFile, currentFile) => {
                    const latestDateString = latestFile.name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' ');
                    const currentDateString = currentFile.name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' ');
                    const parts = latestDateString.split(/[- :]/);
                    const year = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
                    const day = parseInt(parts[2]);
                    const hours = parseInt(parts[3]);
                    const minutes = parseInt(parts[4]);
                    const seconds = parseInt(parts[5]);

                    const latestDateTime = new Date(year, month, day, hours, minutes, seconds);

                    const parts2 = currentDateString.split(/[- :]/);
                    const year2 = parseInt(parts2[0]);
                    const month2 = parseInt(parts2[1]) - 1; // Months are zero-based in JavaScript
                    const day2 = parseInt(parts2[2]);
                    const hours2 = parseInt(parts2[3]);
                    const minutes2 = parseInt(parts2[4]);
                    const seconds2 = parseInt(parts2[5]);

                    const currentDateTime = new Date(year2, month2, day2, hours2, minutes2, seconds2);
                    console.log(latestFile.name.match(/reward_report_(.*).md/)[1])
                    console.log(latestDateTime)

                    return currentDateTime > latestDateTime ? currentFile : latestFile;
                });


                console.log(latestMarkdownFile.name)
    
                const markdownContentResponse = await fetch(latestMarkdownFile.download_url);
                const markdownContent = await markdownContentResponse.text();
    
                // Process the markdown content as needed
                parseMarkdown(markdownContent);
                populateDropdowns();
                populateLastEdit();
                checkExpendButtonNeed2()
                populateVersionTable();
                // populateCheckboxes();
                
                closeImportModal();
            } else {
                console.error('No reward report markdown files found.');
            }
        } catch (error) {
            console.error('Error fetching GitHub API:', error);
        }
        // console.log(importedMarkdownFiles);
    });
    
    // document.getElementById('import-from-github').addEventListener('click', async () => {
    //     const githubRepositoryUrl = document.getElementById('github-folder-url').value;
    //     const apiUrl = convertToGitHubAPIUrl(githubRepositoryUrl);
    
    //     try {
    //         const response = await fetch(apiUrl);
    //         const data = await response.json();
    
    //         const markdownFiles = data.filter(file => (file.name.endsWith('.md') && file.name.startsWith('reward_report_')));
    
    //         for (const file of markdownFiles) {
    //             try {
    //                 const contentResponse = await fetch(file.download_url);
    //                 const content = await contentResponse.text();
                    
    //                 // Process the content similar to your existing code
    //                 const trimmedFileName = file.name.substring(file.name.lastIndexOf('/') + 1);
    //                 importedMarkdownFiles.push({ name: trimmedFileName, content: content });
    
    //             } catch (error) {
    //                 console.error('Error fetching markdown content:', error);
    //             }
    //         }
    
    //         if (markdownFiles.length > 0) {
    //             const latestMarkdownFile = markdownFiles.reduce((latestFile, currentFile) => {
    //                 const latestDateTime = new Date(latestFile.name.match(/reward_report_(.*)\.md/)[1]);
    //                 const currentDateTime = new Date(currentFile.name.match(/reward_report_(.*)\.md/)[1]);
    //                 return currentDateTime > latestDateTime ? currentFile : latestFile;
    //             });
    
    //             const markdownContentResponse = await fetch(latestMarkdownFile.download_url);
    //             const markdownContent = await markdownContentResponse.text();
    
    //             // Process the markdown content as needed
    //             parseMarkdown(markdownContent);
    //             populateDropdowns();
    //             populateLastEdit();
    //             populateVersionTable();
    //             populateCheckboxes();
    //         } else {
    //             console.error('No reward report markdown files found.');
    //         }
    //         closeImportModal();

    //     } catch (error) {
    //         console.error('Error fetching GitHub API:', error);
    //     }
    //     console.log(importedMarkdownFiles)
    // });
    
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
            currentEditSection = undefined;
            descriptionInput.value = '';
        }
    });

    saveButton.addEventListener('click', () => {
        // console.log(currentEditSection.id);
        const subsections = document.querySelectorAll('.subsection p');
        const targetNav = document.querySelector(`[data-target="${currentEditSection.id}"]`);
        const indicator = targetNav.querySelector('.indicator');
        // console.log(indicator)

        currentContextInfo = {
            author: editorInput.value,
            description: descriptionInput.value.replace(/\s+/g, ' ')
        };
            
        subsections.forEach(subsection => {
            subsection.contentEditable = false;
        });

        const paragraphs = currentEditSection.querySelectorAll('p[data-original-content]');
        let hasUnsavedChanges = false;
        paragraphs.forEach(paragraph => {
            if (paragraph.textContent !== paragraph.dataset.originalContent) {
                hasUnsavedChanges = true;
            }
        });

        if (hasUnsavedChanges) {
        indicator.classList.remove('hidden');
        activeDraftButton.style.display = "block";
        }

        sections.forEach(section => {
            section.style.display = 'block';
        });


        authorForm.style.display = 'none';
        editButtons.forEach((button) => {
            button.textContent = 'Edit';
            button.classList.remove('editing-button');
        });  
        currentEditSection = undefined;
        // descriptionInput.value = '';
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

    // Add event listeners to input and textarea elements
    editorInput.addEventListener('input', updateButtonStatus);
    descriptionInput.addEventListener('input', updateButtonStatus);

    // Function to update the button status
    function updateButtonStatus() {
        // Check if both input and textarea have content
        const hasContent = editorInput.value.trim() !== '' && descriptionInput.value.trim() !== '';

        // Update the button's disabled attribute based on the content status
        saveButton.disabled = !hasContent;
        publishButton.disabled = !hasContent;
    }

    function populateLastEdit() {
        lastEditedSection.style.display = 'block';
        const dateElement = document.getElementById('last-edit-date');
        const descriptionElement = document.getElementById('last-edit-description');
        const learnElement = document.getElementById('learn-more-section');
        const descriptionSection = currentScrollSection.id;
        learnElement.textContent = kebabToTitleCase(descriptionSection);


        if (importedMarkdownFiles.length > 0) {
            const sortedFiles = importedMarkdownFiles.slice().sort((a, b) => {
                const dateA = a.name.match(/reward_report_(.*).md/)[1];
                const dateB = b.name.match(/reward_report_(.*).md/)[1];
                return dateB.localeCompare(dateA); // Sort in descending order (newest to oldest)
            });
            const filename = sortedFiles[0].name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' '); // Replace this with your actual filename
            const parts = filename.split(/[- :]/);
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Months in JavaScript are 0-indexed
            const day = parseInt(parts[2]);
            const hours = parseInt(parts[3]);
            const minutes = parseInt(parts[4]);
            const seconds = parseInt(parts[5]);

            const formattedDate = new Date(year, month, day, hours, minutes, seconds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
            dateElement.textContent = formattedDate;

            if(contextInfo){
                descriptionElement.textContent = contextInfo['description'];
            } else {
                descriptionElement.textContent = "";
            }

        } else {
            lastEditedSection.style.display = 'none';
        } 
    }

    function kebabToTitleCase(kebabString) {
        const words = kebabString.split('-');
        const capitalizedWords = words.map(word => {
          const firstLetter = word[0].toUpperCase();
          const restOfWord = word.slice(1);
          return firstLetter + restOfWord;
        });
        return capitalizedWords.join(' ');
    }

    versionHistoryLink.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabs[1].classList.add('active');

        contentSections.forEach(section => {
            if (section.id === 'version-history') {
                section.classList.add('active-tab');
            } else {
                section.classList.remove('active-tab');
            }
        });
        console.log('check')
        checkExpendButtonNeed();
    });


    // Initial call to update button status
    updateButtonStatus();
    
    tabs[0].click();
    

    
    
    
    
    
    
    //CODE FOR VIEW CHANGES TAB
    const diffContainer = document.getElementById('diff-container');
    const originalContainer = document.getElementById('original-container');
    const file1Dropdown = document.getElementById('file1');
    const file2Dropdown = document.getElementById('file2');
    // const compareButton = document.getElementById('compareButton');
    const changesNav = document.getElementById('changeNav');
    

    const sectionHeaders = changesNav.querySelectorAll('.sections li');
    const subsectionHeaders = changesNav.querySelectorAll('.sections ul');


    sectionHeaders.forEach(sectionHeader => {
        sectionHeader.addEventListener('click', () =>{
            sectionHeaders.forEach(li => li.classList.remove('active-section'));
            sectionHeader.classList.add('active-section');
            // filterSectionsByClass(sectionHeader.getAttribute('data-target'))
            activateSub()
            filterActiveSection()
            // filterActiveSectionDiffs()
        });
    });

    function activateSub(){
        subsectionHeaders.forEach((sub) => {
            sub.classList.remove('active-sub');
            if (sub.parentElement.classList.contains('active-section')) {
                sub.classList.add('active-sub');
            } 
        });
    }


    // Function to populate the dropdowns
    function populateDropdowns() {
        file1Dropdown.innerHTML = '<option value="" disabled selected>Select a date</option>';
        file2Dropdown.innerHTML = '<option value="" disabled selected>Select a date</option>';
        

        // Sort importedMarkdownFiles from newest to oldest
        if (importedMarkdownFiles.length > 0) {
            const sortedFiles = importedMarkdownFiles.slice().sort((a, b) => {
                const dateA = a.name.match(/reward_report_(.*).md/)[1];
                const dateB = b.name.match(/reward_report_(.*).md/)[1];
                return dateB.localeCompare(dateA); // Sort in descending order (newest to oldest)
            });        
            sortedFiles.forEach(file => {
                const filename = file.name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' '); // Replace this with your actual filename
                const parts = filename.split(/[- :]/);
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // Months in JavaScript are 0-indexed
                const day = parseInt(parts[2]);
                const hours = parseInt(parts[3]);
                const minutes = parseInt(parts[4]);
                const seconds = parseInt(parts[5]);

                const formattedDate = new Date(year, month, day, hours, minutes, seconds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = file.name;
                option1.textContent = formattedDate;
                option2.value = file.name;
                option2.textContent = formattedDate;
                file1Dropdown.appendChild(option1);
                file2Dropdown.appendChild(option2);
            });       
        } else {
            importedMarkdownFiles.forEach(file => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = file.name;
                option1.textContent = file.name;
                option2.value = file.name;
                option2.textContent = file.name;
                file1Dropdown.appendChild(option1);
                file2Dropdown.appendChild(option2);
            }); 
        }
    }

    // Add an event listener to the second dropdown
    file2Dropdown.addEventListener('change', () => {
        const selectedFile1 = file1Dropdown.value;
        const selectedFile2 = file2Dropdown.value;

        if (selectedFile1 && selectedFile2) {
            // Both files are selected, trigger the compare function
            compare();
        }
        sectionHeaders.forEach(li => li.classList.remove('active-section'));
        activateSub()
        sectionHeaders[0].click();
    });

    file1Dropdown.addEventListener('change', () => {
        const selectedFile1 = file1Dropdown.value;
        const selectedFile2 = file2Dropdown.value;

        if (selectedFile1 && selectedFile2) {
            // Both files are selected, trigger the compare function
            compare();
        }
        populateFile1();
        sectionHeaders.forEach(li => li.classList.remove('active-section'));
        activateSub()
        sectionHeaders[0].click();
    });

    const renderer = new marked.Renderer();

    // Override the default heading rendering
    renderer.heading = function(text, level) {
        // Adjust heading level as needed (e.g., convert level 1 to h3 and level 2 to h4)
        const label = text.toLowerCase().replace(' ', '-');
        text = text;
        if (level === 1) {
            return `<h3 class="${label}">${text}</h3>`;
        } else if (level === 2) {
            return `<h4 class="${label}">${text}</h4>`;
        } else {
            return `<h${level}>${text}</h${level}>`;
        }
    };

    // Set the custom renderer in the marked options
    marked.setOptions({
        renderer: renderer
    });

    // function filterSectionsByClass(className) {
    //     const container = document.getElementById('original-container');
    //     const sections = container.querySelectorAll('h3');
    
    //     sections.forEach(section => {
    //         if (section.classList.contains(className)) {
    //             const siblingElements = [section];
    
    //             let nextElement = section.nextElementSibling;
    //             while (nextElement && nextElement.tagName !== 'H3') {
    //                 siblingElements.push(nextElement);
    //                 nextElement = nextElement.nextElementSibling;
    //             }
    
    //             container.innerHTML = '';
    //             siblingElements.forEach(element => {
    //                 container.appendChild(element);
    //             });
    //         }
    //     });
    // }

    function filterActiveSection() {
        const activeSection = changesNav.querySelector('.active-section');
        if (activeSection) {
            const className = activeSection.getAttribute('data-target'); 
            const container = document.getElementById('original-container');
            const sections = container.querySelectorAll('h3');
            const container2 = document.getElementById('diff-container');
            const sections2 = container2.querySelectorAll('section');

    
            sections.forEach(section => {
                const siblingElements = [section];
    
                let nextElement = section.nextElementSibling;
                while (nextElement && nextElement.tagName !== 'H3') {
                    siblingElements.push(nextElement);
                    nextElement = nextElement.nextElementSibling;
                }


                if (section.textContent == kebabToTitleCase(className)) {
                    siblingElements.forEach(element => {
                        element.style.display = 'block';
                    });
                } else {
                    siblingElements.forEach(element => {
                        element.style.display = 'none';
                    });
                }  
            });

            sections2.forEach(section => {
               
                if (section.classList.contains(className)) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }  
            });
        }
    }

    // function filterActiveSectionDiffs() {
    //     const activeSection = changesNav.querySelector('.active-section');
    //     if (activeSection) {
    //         const className = activeSection.getAttribute('data-target');
        
    //         const container = document.getElementById('diff-container');
    //         const sections = container.querySelectorAll('h3');
        
    //         sections.forEach(section => {
    //             const siblingElements = [section];
    
    //             let nextElement = section.nextElementSibling;
    //             while (nextElement && nextElement.tagName !== 'H3') {
    //                 siblingElements.push(nextElement);
    //                 nextElement = nextElement.nextElementSibling;
    //             }


    //             if (section.classList.contains(className)) {
    //                 siblingElements.forEach(element => {
    //                     element.style.display = 'block';
    //                 });
    //             } else {
    //                 siblingElements.forEach(element => {
    //                     element.style.display = 'none';
    //                 });
    //             }  
    //         });
    //     }
    // }
    
    

    function compare() {

        const indicators = document.querySelectorAll('.changed-indicator');
        indicators.forEach(indicator => {
            indicator.classList.add('hidden');
        });
        const selectedFile1 = file1Dropdown.value;
        const selectedFile2 = file2Dropdown.value;
    
        // Find the corresponding content for the selected files
        const content1 = importedMarkdownFiles.find(file => file.name === selectedFile1)?.content || '';
        const content2 = importedMarkdownFiles.find(file => file.name === selectedFile2)?.content || '';

        const content1noCont = content1.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
        const content2noCont = content2.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');

        const content1Sections = content1noCont.split(/^(?=# [^#])/gm);    
        const content2Sections = content2noCont.split(/^(?=# [^#])/gm);    
       

        if (content1Sections.length !== content2Sections.length) {
            throw new Error("Input arrays must have the same length");
        }

        diffContainer.innerHTML = '';


        for (let i = 0; i < content1Sections.length; i++) {
            const section1 = content1Sections[i];
            const section2 = content2Sections[i];
            const sectionTitleLine = section1.split('\n')[0];
            const sectionTitle = sectionTitleLine.slice(2); // Remove the '# ' from the title
            const markedContent1 = section1;
            const markedContent2 = section2;
            let htmlContent = "";
        
            // Compute the diff using jsdiff
            const diff = Diff.diffWordsWithSpace(markedContent1, markedContent2);
        
            // Clear existing content and start building the HTML
            htmlContent += `<section class="${sectionTitle.toLowerCase().replace(/\s/g, '-')}">`;
        
            diff.forEach(part => {
                // const span = document.createElement('span');
                // span.textContent = part.value;
                htmlBit = marked.parse(part.value);
                // console.log(htmlBit)
                if (part.added) {
                    htmlBit = `<span class="added">${htmlBit}</span>`;
                } else if (part.removed) {
                    htmlBit = `<span class="removed">${htmlBit}</span>`;
                } else {
                    htmlBit = `<span class="unchanged">${htmlBit}</span>`;
                }

                htmlContent += htmlBit;
            });
            htmlContent += "</section>"
            diffContainer.innerHTML += htmlContent;

            const spans = diffContainer.querySelectorAll('span');
            // Iterate over each span
            spans.forEach(span => {
                // Check if the span has no content (i.e., empty or only whitespace)
                if (!span.textContent.trim()) {
                    // Remove the span from its parent
                    span.parentNode.removeChild(span);
                }
            });
        }
        const sections = diffContainer.querySelectorAll('section');
        
        sections.forEach(section => {
            const removedSpans = section.querySelectorAll('span.removed');
            const filteredRemovedSpans = Array.from(removedSpans).filter(span => {
                return span.textContent.trim() !== '';
            });
            
            const addedSpans = section.querySelectorAll('span.added');
            const filteredAddedSpans = Array.from(addedSpans).filter(span => {
                return span.textContent.trim() !== '';
            });
            


            console.log(section.classList[0] + ": " + filteredRemovedSpans.length + ", " + filteredAddedSpans.length)
            
            // Check if there are any removed or added spans in the section
            if (filteredRemovedSpans.length > 0 || filteredAddedSpans.length > 0) {
                const targetNav = document.querySelector(`#changeNav [data-target="${section.classList[0]}"] .changed-indicator`);
                targetNav.classList.remove('hidden');
            }
        });
    }

    // function compare() {
    //     const selectedFile1 = file1Dropdown.value;
    //     const selectedFile2 = file2Dropdown.value;
    
    //     // Find the corresponding content for the selected files
    //     const content1 = importedMarkdownFiles.find(file => file.name === selectedFile1)?.content || '';
    //     const content2 = importedMarkdownFiles.find(file => file.name === selectedFile2)?.content || '';
    
    //     // Convert Markdown to HTML
    //     const markedContent1 = content1.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
    //     const markedContent2 = content2.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
    
    //     console.log(markedContent1)
    //     console.log(markedContent2)

    //     // Compute the diff using jsdiff
    //     const diff = Diff.diffWords(markedContent1, markedContent2);
    
    //     // Clear existing content and start building the HTML
    //     diffContainer.innerHTML = '';
    
    //     diff.forEach(part => {

    //         // const span = document.createElement('span');
    //         // span.textContent = part.value;
    //         htmlBit = marked.parse(part.value);
    //         console.log(htmlBit)
    //         if (part.added) {
    //             htmlBit = `<span class="added">${htmlBit}</span>`;
    //         } else if (part.removed) {
    //             htmlBit = `<span class="removed">${htmlBit}</span>`;
    //         } else {
    //             htmlBit = `<span class="unchanged">${htmlBit}</span>`;
    //         }

    //         diffContainer.innerHTML += htmlBit;
    
    //     });
    // }

    function populateFile1() {
        const selectedFile1 = file1Dropdown.value;
        const content1 = importedMarkdownFiles.find(file => file.name === selectedFile1)?.content || '';
        originalContainer.innerHTML = '';
        originalContainer.innerHTML = marked.parse(content1);
    }
    
    // Event listener for the Compare button
    // compareButton.addEventListener('click', () => {
    //     const selectedFile1 = file1Dropdown.value;
    //     const selectedFile2 = file2Dropdown.value;

        // // Find the corresponding content for the selected files
        // const content1 = importedMarkdownFiles.find(file => file.name === selectedFile1)?.content || '';
        // const content2 = importedMarkdownFiles.find(file => file.name === selectedFile2)?.content || '';

        // // Compute the diff using jsdiff
        // const diff = Diff.diffLines(content1, content2);

        // // Display the diff in the container
        // container.innerHTML = '';
        // diff.forEach(part => {
        //     const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        //     const span = document.createElement('span');
        //     span.style.color = color;
        //     span.textContent = part.value;
        //     container.appendChild(span);
        // });
    // });

    //CODE FOR VERSION HISTORY

    const markdownTable = document.getElementById('version-table');
    const tbody = markdownTable.querySelector('tbody');


    function populateVersionTable() {
        // Clear the content of the <tbody>

        tbody.innerHTML = '';
        // Loop through importedMarkdownFiles and populate the table
        const sortedFiles = importedMarkdownFiles.slice().sort((a, b) => {
            const dateA = a.name.match(/reward_report_(.*).md/)[1];
            const dateB = b.name.match(/reward_report_(.*).md/)[1];
            return dateB.localeCompare(dateA); // Sort in descending order (newest to oldest)
        });        
        sortedFiles.forEach((file, index) => {
            const filename = file.name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' '); // Replace this with your actual filename
            const parts = filename.split(/[- :]/);
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Months in JavaScript are 0-indexed
            const day = parseInt(parts[2]);
            const hours = parseInt(parts[3]);
            const minutes = parseInt(parts[4]);
            const seconds = parseInt(parts[5]);
            const formattedDate = new Date(year, month, day, hours, minutes, seconds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

            const row = document.createElement('tr');
            const nameCell = document.createElement('td');

            // // Create the bookmark checkbox
            // const bookmarkCheckbox = document.createElement('input');
            // bookmarkCheckbox.type = 'checkbox';
            // bookmarkCheckbox.classList.add('bookmark-checkbox');
            
            // // Set the custom attribute to store the index
            // bookmarkCheckbox.setAttribute('data-file-index', index);
            
            // nameCell.appendChild(bookmarkCheckbox);

            // Create the container for the checkbox and SVG
            const nameContainer = document.createElement('div');
            nameContainer.classList.add('centered-div')
            const checkboxContainer = document.createElement('label');
            checkboxContainer.classList.add('checkbox-container');

            // Create the bookmark checkbox
            const bookmarkCheckbox = document.createElement('input');
            bookmarkCheckbox.type = 'checkbox';
            bookmarkCheckbox.classList.add('bookmark-checkbox');
            bookmarkCheckbox.setAttribute('data-file-index', index);

            // Create the SVG for the checkbox when it's checked
            const checkedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            checkedSvg.setAttribute('width', '12');
            checkedSvg.setAttribute('height', '17');
            checkedSvg.setAttribute('viewBox', '0 0 12 17');
            checkedSvg.innerHTML = '<path d="M12 2V16.5L6 13L0 16.5V2C0 1.1875 0.65625 0.5 1.5 0.5H10.5C11.3125 0.5 12 1.1875 12 2Z" fill="#8D8F93"/>';

            // Create the SVG for the checkbox when it's unchecked
            const uncheckedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            uncheckedSvg.setAttribute('width', '12');
            uncheckedSvg.setAttribute('height', '17');
            uncheckedSvg.setAttribute('viewBox', '0 0 12 17');
            uncheckedSvg.innerHTML = '<path d="M10.5 0.5C11.3125 0.5 12 1.1875 12 2V15.5C12 16.2812 11.1562 16.75 10.4688 16.375L6 13.75L1.5 16.375C0.8125 16.75 0 16.2812 0 15.5V2C0 1.1875 0.65625 0.5 1.5 0.5H10.5ZM10.5 14.625V2.1875C10.5 2.09375 10.4062 2 10.2812 2H1.65625C1.5625 2 1.5 2.09375 1.5 2.1875V14.625L6 12L10.5 14.625Z" fill="#8D8F93"/>';

            // Append the checkbox and SVGs to the container
            checkboxContainer.appendChild(bookmarkCheckbox);
            checkboxContainer.appendChild(checkedSvg);
            checkboxContainer.appendChild(uncheckedSvg);
            checkedSvg.style.display = 'none';
            uncheckedSvg.style.display = 'block';

            // Toggle visibility of SVGs based on checkbox state
            bookmarkCheckbox.addEventListener('change', function () {
                if (bookmarkCheckbox.checked) {
                    checkedSvg.style.display = 'block';
                    uncheckedSvg.style.display = 'none';
                } else {
                    checkedSvg.style.display = 'none';
                    uncheckedSvg.style.display = 'block';
                }
            });

            nameContainer.appendChild(checkboxContainer);

            // Create the formatted date
            const formattedDateElement = document.createElement('span');
            formattedDateElement.textContent = formattedDate;
            nameContainer.appendChild(formattedDateElement);
            nameCell.appendChild(nameContainer);



            row.appendChild(nameCell);
            
            const contentCell = document.createElement('td');
            const descriptionCell = document.createElement('div');
            descriptionCell.classList.add('description-cell');
            const contextInfoPattern = /<!-- Author: (.+) --> <!-- Description: (.+) -->/;
            const contextInfoMatch = file.content.match(contextInfoPattern);
            console.log(contextInfoMatch)
            if (contextInfoMatch) {
                descriptionCell.textContent = contextInfoMatch[2] + " -- " + contextInfoMatch[1];
            }

            contentCell.appendChild(descriptionCell);
            

            const expandButton = document.createElement('span');
            expandButton.classList.add('expand-button');
            expandButton.textContent = 'Read more...';
            expandButton.addEventListener('click', () => {
                descriptionCell.classList.toggle('expanded');
                if (descriptionCell.classList.contains('expanded')) {
                    expandButton.textContent = 'Hide text';
                } else {
                    expandButton.textContent = 'Read more...';
                }
            });
            
            contentCell.appendChild(expandButton);
            row.appendChild(contentCell);

            const metric1 = document.createElement('td');
            metric1.textContent = "1";
            const metric2 = document.createElement('td');
            metric2.textContent = "2";
            const metric3 = document.createElement('td');
            metric3.textContent = "3";
            const metric4 = document.createElement('td');
            metric4.textContent = "4";
            const metric5 = document.createElement('td');
            metric5.textContent = "5";
            row.appendChild(metric1);
            row.appendChild(metric2);
            row.appendChild(metric3);
            row.appendChild(metric4);
            row.appendChild(metric5);
            tbody.appendChild(row);
        });

        const bookmarkCheckboxes = document.querySelectorAll('.bookmark-checkbox');

        // Add event listeners to each bookmark checkbox
        bookmarkCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                console.log("update")
                populateCheckboxes();
            });
        }); 
    }

    function checkExpendButtonNeed(){
        const descriptionCells = document.querySelectorAll('.description-cell');
        descriptionCells.forEach((descriptionCell)=> {
            const expandButton = descriptionCell.parentElement.querySelector('.expand-button')
            console.log(descriptionCell.scrollHeight)
            console.log(descriptionCell.clientHeight)
            if(descriptionCell.scrollHeight > descriptionCell.clientHeight) {
                expandButton.style.display = "block";
            } else {
                expandButton.style.display = "none";
            }
        });
    }

    function checkExpendButtonNeed2(){
        const descriptionElement = document.getElementById('last-edit-description');
        const expandButton = descriptionElement.parentElement.querySelector('.expand-button')
        console.log(descriptionElement.scrollHeight)
        console.log(descriptionElement.clientHeight)
        if(descriptionElement.scrollHeight > descriptionElement.clientHeight) {
            expandButton.style.display = "block";
        } else {
            expandButton.style.display = "none";
        }
        expandButton.addEventListener('click', () => {
            descriptionElement.classList.toggle('expanded');
            if (descriptionElement.classList.contains('expanded')) {
                expandButton.textContent = 'Hide text';
            } else {
                expandButton.textContent = 'Read more...';
            }
        });
    }
    
    const checkboxForm = document.getElementById('checkbox-form');
    const checkboxForm2 = document.getElementById('checkbox-form-perf');
    const compareButtons = document.querySelectorAll('.compare-flagged-button');

    // Function to populate checkboxes from importedMarkdownFiles
    function populateCheckboxes() {
        const checkboxContainer = checkboxForm.querySelector('#checkbox-container');
        const checkboxContainer2 = checkboxForm2.querySelector('#checkbox-container-perf');
        checkboxContainer.innerHTML="";
        checkboxContainer2.innerHTML="";

        

        const sortedFiles = importedMarkdownFiles.slice().sort((a, b) => {
            const dateA = a.name.match(/reward_report_(.*).md/)[1];
            const dateB = b.name.match(/reward_report_(.*).md/)[1];
            return dateB.localeCompare(dateA); // Sort in descending order (newest to oldest)
        });        
        sortedFiles.forEach(function(file, index) {

            const bookmarkCheckbox = document.querySelector(`.bookmark-checkbox[data-file-index="${index}"]`);
            console.log(bookmarkCheckbox)
            if (bookmarkCheckbox && bookmarkCheckbox.checked) {
                const filename = file.name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' ');
                const parts = filename.split(/[- :]/);
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[2]);
                const hours = parseInt(parts[3]);
                const minutes = parseInt(parts[4]);
                const seconds = parseInt(parts[5]);
    
                const formattedDate = new Date(year, month, day, hours, minutes, seconds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    
                const checkboxLabel = document.createElement('label');
                const checkboxLabel2 = document.createElement('label');
                checkboxLabel.innerHTML = `<input type="checkbox" class="compare-checkbox" value="${index}"> ${formattedDate}<br>`;
                checkboxLabel2.innerHTML = `<input type="checkbox" class="compare-checkbox" value="${index}"> ${formattedDate}<br>`;
                checkboxContainer.appendChild(checkboxLabel);
                checkboxContainer2.appendChild(checkboxLabel2);
            }
        });
        const compareCheckboxes = checkboxForm.querySelectorAll('.compare-checkbox');
        const compareCheckboxes2 = checkboxForm2.querySelectorAll('.compare-checkbox');

        const maxSelected = 2;

        let selectedCount1 = 0;
        let selectedCount2 = 0;

        compareCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedCount1++;
                if (selectedCount1 > maxSelected) {
                    checkbox.checked = false;
                    selectedCount1--;
                }
                } else {
                    selectedCount1--;
                }
            });
        });

        compareCheckboxes2.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                selectedCount2++;
                if (selectedCount2 > maxSelected) {
                    checkbox.checked = false;
                    selectedCount2--;
                }
                } else {
                selectedCount2--;
                }
            });
        });

        checkboxForm.addEventListener('change', function() {
            const selectedCheckboxes = checkboxForm.querySelectorAll('input[type="checkbox"]:checked');
            const compareButton = checkboxForm.querySelector('button');
            compareButton.disabled = (selectedCheckboxes.length !== 2);
        });

        checkboxForm2.addEventListener('change', function() {
            const selectedCheckboxes = checkboxForm2.querySelectorAll('input[type="checkbox"]:checked');
            const compareButton = checkboxForm2.querySelector('button');
            compareButton.disabled = (selectedCheckboxes.length !== 2);
        });
    }


    // Add a click event listener to the submit button
    compareButtons.forEach((button) =>  {
        button.disabled = true; // Initially disable the button
        button.addEventListener('click', function() {
            const selectedCheckboxes = button.parentElement.querySelectorAll('input[type="checkbox"]:checked');
            if (selectedCheckboxes.length === 2){
                const sortedFiles = importedMarkdownFiles.slice().sort((a, b) => {
                    const dateA = a.name.match(/reward_report_(.*).md/)[1];
                    const dateB = b.name.match(/reward_report_(.*).md/)[1];
                    return dateB.localeCompare(dateA); // Sort in descending order (newest to oldest)
                }); 
                const selectedMarkdownFiles = ['file1.md', 'file2.md']; // Replace with actual file names
                console.log(selectedCheckboxes)
                selectedCheckboxes.forEach(function(checkbox, index) {
                    const selectedIndex = parseInt(checkbox.value);
                    const selectedFile = sortedFiles[selectedIndex];
                    selectedMarkdownFiles[index] = selectedFile;
                    console.log(selectedMarkdownFiles);
                });
    
    
                // Select the first item from selectedMarkdownFiles in file1Dropdown
                if (selectedMarkdownFiles[0]) {
                    for (let i = 0; i < file1Dropdown.options.length; i++) {
                        console.log(file1Dropdown.options[i].value)
                        console.log(selectedMarkdownFiles[0].name)
    
                        if (file1Dropdown.options[i].value === selectedMarkdownFiles[0].name) {
                            file1Dropdown.options[i].selected = true;
                            break;
                        }
                    }
                }
                
                // Select the second item from selectedMarkdownFiles in file2Dropdown
                if (selectedMarkdownFiles[1]) {
                    for (let i = 0; i < file2Dropdown.options.length; i++) {
                        if (file2Dropdown.options[i].value === selectedMarkdownFiles[1].name) {
                            file2Dropdown.options[i].selected = true;
                            break;
                        }
                    }
                }
    
                // Trigger the change event on the dropdowns to update their selected options
                const changeEvent = new Event('change', { bubbles: true });
                file1Dropdown.dispatchEvent(changeEvent);
                file2Dropdown.dispatchEvent(changeEvent);
    
                // Now navigate to the "View Changes" tab
                tabs[3].click();
            }

        });
    });
    
});

// Add a function to display a warning message
function displayUnloadWarning(event) {
    event.returnValue = 'If you leave this page without publishing, you will lose your progress on your Reward Report. Are you sure you want to leave?';
}
  
  // Attach the event listener to the window
window.addEventListener('beforeunload', displayUnloadWarning);
  
  // Remove the event listener when the form is submitted
submitButton.addEventListener('click', () => {
    window.removeEventListener('beforeunload', displayUnloadWarning);
});