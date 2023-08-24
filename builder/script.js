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
        learnMoreSection.style.display = 'block';
        leftScanItems[0].classList.add('active-section');
        subsections[0].classList.add('active-sub')
        // populateLastEdit()
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
        // populateLastEdit()
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
        populateLastEdit()
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
        if (currentEditSection) {
            // Save content to contextInfo
            currentContextInfo[currentEditSection.id] = {
                author: editorInput.value,
                description: descriptionInput.value
            };
            console.log(currentContextInfo);
            contextInfo=currentContextInfo;
        }
        if (confirmPublish) {
            const sections = document.querySelectorAll('.section');
            let markdownContent = '';

        
            sections.forEach(section => {
                markdownContent += `# ${section.querySelector('h3').textContent}`;

                const contextInfoSection = contextInfo[section.id]; // Get context info for this section
                if (contextInfoSection) {
                    // markdownContent += `## Context Info\n\n`;
                    // markdownContent += `Editor Input:\n\n${contextInfoSection.editorInput}\n\n`;
                    // markdownContent += `Description Input:\n\n${contextInfoSection.descriptionInput}\n\n`;
                    markdownContent += `<!-- Author: ${contextInfoSection.author} --> `;
                    markdownContent += `<!-- Description: ${contextInfoSection.description} -->\n\n`;
                } else {
                    markdownContent += '\n\n'
                }

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
            populateVersionTable();
            populateCheckboxes();
            currentContextInfo = {};
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
            console.log(contextInfo)
        }
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
        const sections = markdownContent.split(/^(?=# [^#])/gm);    
        sections.forEach(section => {
            const contextInfoPattern = /<!-- Author: (.+) --> <!-- Description: (.+) -->/;
            const contextInfoMatch = section.match(contextInfoPattern);
            let author = '';
            let description = '';

            const sectionWithoutContext = section.replace(contextInfoPattern, '').trim();
            const sectionTitleLine = sectionWithoutContext.split('\n')[0];
            const sectionTitle = sectionTitleLine.slice(2); // Remove the '# ' from the title
            const sectionEl = document.querySelector(`[data-target="${sectionTitle.toLowerCase().replace(/\s/g, '-')}"]`);

            if (contextInfoMatch) {
                author = contextInfoMatch[1];
                description = contextInfoMatch[2];
                contextInfo[sectionTitle.toLowerCase().replace(/\s/g, '-')] = { author, description };
            }

            if (!sectionEl) {
                return; // Skip if section element not found
            }
    
            const subsections = sectionWithoutContext.split('## ');
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
                populateVersionTable();
                populateCheckboxes();

            } else if (markdownFiles.length > 1) {
                // console.log('Multiple Markdown files found:', markdownFiles);
                const latestMarkdownFile = markdownFiles.reduce((latestFile, currentFile) => {
                    const latestDateTime = new Date(latestFile.match(/reward_report_(.*)\.md/)[1]);
                    const currentDateTime = new Date(currentFile.match(/reward_report_(.*)\.md/)[1]);
                    return currentDateTime > latestDateTime ? currentFile : latestFile;
                });
    
                const markdownContent = await importedZip.files[latestMarkdownFile].async('string');
                // console.log('Latest Markdown files found:', markdownContent);

                // Use the markdown content to populate the HTML page (similar to the export code)
                parseMarkdown(markdownContent);
                populateDropdowns();
                populateLastEdit();
                populateVersionTable();
                populateCheckboxes();
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

    // document.getElementById('import-from-github').addEventListener('click', async () => {
    //     const githubRepositoryUrl = document.getElementById('github-folder-url').value;
    //     const apiEndpoint = 'http://localhost:3000/github-proxy'; 
    //     const apiUrl = convertToGitHubAPIUrl(githubRepositoryUrl);
    //     console.log(apiUrl);
    
    //     try {
    //         fetch(apiUrl)
    //             .then(response => response.json())
    //             .then(data => {
    //                 // Process the data here
    //                 console.log(data);
    //                 // Filter out files from the folderContents (you might need to adapt this based on your needs)
    //                 const markdownFiles = data.filter(file => file.name.endsWith('.md'));
            
    //                 // Loop through the markdownFiles and process them similarly to local file imports
    //                 for (const file of markdownFiles) {
    //                     try {
    //                         const contentResponse = await fetch(file.download_url);
    //                         const content = await contentResponse.text();
    //                         console.log(content);
    //                     } catch (error) {
    //                         console.error('Error fetching markdown content:', error);
    //                     }
    //                     // Process the content as needed (similar to your existing code)
    //                     // ...
    //                 }
            
    //                 // Update the UI or do any other necessary actions
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching GitHub API:', error);
    //             }); 
    //     } catch (error) {
    //         console.error('Error importing from GitHub:', error);
    //     }
    // });
    
    document.getElementById('import-from-github').addEventListener('click', async () => {
        const githubRepositoryUrl = document.getElementById('github-folder-url').value;
        const apiUrl = convertToGitHubAPIUrl(githubRepositoryUrl);
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            const markdownFiles = data.filter(file => (file.name.endsWith('.md') && file.name.startsWith('reward_report_')));
    
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
    
            if (markdownFiles.length > 0) {
                const latestMarkdownFile = markdownFiles.reduce((latestFile, currentFile) => {
                    const latestDateTime = new Date(latestFile.name.match(/reward_report_(.*)\.md/)[1]);
                    const currentDateTime = new Date(currentFile.name.match(/reward_report_(.*)\.md/)[1]);
                    return currentDateTime > latestDateTime ? currentFile : latestFile;
                });
    
                const markdownContentResponse = await fetch(latestMarkdownFile.download_url);
                const markdownContent = await markdownContentResponse.text();
    
                // Process the markdown content as needed
                parseMarkdown(markdownContent);
                populateDropdowns();
                populateLastEdit();
                populateVersionTable();
                populateCheckboxes();
            } else {
                console.error('No reward report markdown files found.');
            }
        } catch (error) {
            console.error('Error fetching GitHub API:', error);
        }
        console.log(importedMarkdownFiles)
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

        if (currentEditSection) {
            // Save content to contextInfo
            currentContextInfo[currentEditSection.id] = {
                author: editorInput.value,
                description: descriptionInput.value
            };
            // console.log(currentContextInfo);
        }

            
        subsections.forEach(subsection => {
            subsection.contentEditable = false;
        });
        

        if (indicator) {
            indicator.classList.remove('hidden');
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
        descriptionInput.value = '';
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

            if(contextInfo[descriptionSection]){
                descriptionElement.textContent = contextInfo[descriptionSection]['description'];
                console.log(descriptionSection)
                console.log(contextInfo[descriptionSection]['description'])
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
            console.log(sectionHeader)
            sectionHeaders.forEach(li => li.classList.remove('active-section'));
            sectionHeader.classList.add('active-section');
            console.log(sectionHeader.getAttribute('data-target'))
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
        file1Dropdown.innerHTML = '<option value="" disabled selected>Select a file</option>';
        file2Dropdown.innerHTML = '<option value="" disabled selected>Select a file</option>';

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
        const label = text.toLowerCase().replace(' ', '-').replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
        text = text.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
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
                console.log(section)
    
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
        const selectedFile1 = file1Dropdown.value;
        const selectedFile2 = file2Dropdown.value;
    
        // Find the corresponding content for the selected files
        const content1 = importedMarkdownFiles.find(file => file.name === selectedFile1)?.content || '';
        const content2 = importedMarkdownFiles.find(file => file.name === selectedFile2)?.content || '';

        const content1Sections = content1.split(/^(?=# [^#])/gm);    
        const content2Sections = content2.split(/^(?=# [^#])/gm);    
       

        if (content1Sections.length !== content2Sections.length) {
            throw new Error("Input arrays must have the same length");
        }

        diffContainer.innerHTML = '';


        for (let i = 0; i < content1Sections.length; i++) {
            const section1 = content1Sections[i];
            const section2 = content2Sections[i];
            const section1noCont = section1.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
            const section2noCont = section2.replace(/<!--\s*author:[^>]*-->\s*<!--\s*description:[^>]*-->/gi, '');
            const sectionTitleLine = section1noCont.split('\n')[0];
            const sectionTitle = sectionTitleLine.slice(2); // Remove the '# ' from the title
            const markedContent1 = section1noCont;
            const markedContent2 = section2noCont;
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

            diffContainer.innerHTML += htmlContent
            console.log(diffContainer.innerHTML)
        }
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

    function populateVersionTable() {
        // Loop through importedMarkdownFiles and populate the table
        importedMarkdownFiles.forEach(file => {
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
            nameCell.textContent = formattedDate;
            row.appendChild(nameCell);
            console.log(nameCell);
            
            const contentCell = document.createElement('td');
            const descriptionCell = document.createElement('div');
            descriptionCell.classList.add('description-cell');
            descriptionCell.textContent = file.content;
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

            contentCell.appendChild(descriptionCell);
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
            markdownTable.appendChild(row);
        });
    }
    
    const checkboxForm = document.getElementById('checkbox-form');
    const submitButton = document.getElementById('compare-flagged-button');

    // Function to populate checkboxes from importedMarkdownFiles
    function populateCheckboxes() {
        const checkboxContainer = checkboxForm.querySelector('#checkbox-container');
        importedMarkdownFiles.forEach(function(file, index) {
            const filename = file.name.match(/reward_report_(.*).md/)[1].replace(/_/g, ' '); // Replace this with your actual filename
            const parts = filename.split(/[- :]/);
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Months in JavaScript are 0-indexed
            const day = parseInt(parts[2]);
            const hours = parseInt(parts[3]);
            const minutes = parseInt(parts[4]);
            const seconds = parseInt(parts[5]);

            const formattedDate = new Date(year, month, day, hours, minutes, seconds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
            const checkboxLabel = document.createElement('label');
            checkboxLabel.innerHTML = `<input type="checkbox" name="item" value="${index}"> ${formattedDate}<br>`;
            checkboxContainer.appendChild(checkboxLabel);
        });
    }

    // Add a click event listener to the submit button
    submitButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        selectedCheckboxes.forEach(function(checkbox) {
            const selectedIndex = parseInt(checkbox.value);
            const selectedFile = importedMarkdownFiles[selectedIndex];
            console.log('Selected File:', selectedFile);
        });
    });
});
