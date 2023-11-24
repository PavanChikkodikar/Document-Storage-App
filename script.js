document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const fileList = event.target.files;
    const fileListContainer = document.getElementById('fileList');

    // Display the list of uploaded files
    for (const file of fileList) {
        const listItem = createFileListItem(file);
        fileListContainer.appendChild(listItem);
    }

    // Save files to local storage
    saveFilesToLocal(fileList);
}

// ... (unchanged)

function createFileListItem(file) {
    const listItem = document.createElement('div');
    listItem.classList.add('fileItem');

    const fileName = document.createElement('div');
    fileName.textContent = file.name;
    listItem.appendChild(fileName);

    const fileActions = document.createElement('div');
    fileActions.classList.add('fileActions');

    const openButton = document.createElement('button');
    openButton.textContent = 'Open';
    openButton.addEventListener('click', () => openFile(file));
    fileActions.appendChild(openButton);

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.addEventListener('click', () => downloadFile(file));
    fileActions.appendChild(downloadButton);

    const renameButton = document.createElement('button');
    renameButton.textContent = 'Rename';
    renameButton.addEventListener('click', () => renameFile(file, listItem, fileName));
    fileActions.appendChild(renameButton);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeFile(file, listItem));
    fileActions.appendChild(removeButton);

    listItem.appendChild(fileActions);

    return listItem;
}

function renameFile(file, listItem, fileNameElement) {
    const newName = prompt('Enter the new name for the file:', file.name);
    if (newName !== null && newName !== '') {
        file.name = newName;
        fileNameElement.textContent = newName;

        // Update the file name in local storage
        const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
        const updatedFiles = storedFiles.map(storedFile => {
            if (storedFile.name === file.name) {
                storedFile.name = newName;
            }
            return storedFile;
        });

        localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    }
}


document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// Clear All button event listener
document.getElementById('clearAllButton').addEventListener('click', clearAllFiles);

// ... (unchanged)

function clearAllFiles() {
    // Clear the displayed file list
    const fileListContainer = document.getElementById('fileList');
    fileListContainer.innerHTML = '';

    // Clear files from local storage
    localStorage.removeItem('uploadedFiles');
}



function saveFilesToLocal(files) {
    // Use localStorage to store file names and their contents (you may want to explore more robust storage options)
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

    for (const file of files) {
        storedFiles.push({
            name: file.name,
            content: file
        });
    }

    localStorage.setItem('uploadedFiles', JSON.stringify(storedFiles));
}

function openFile(file) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
}

function downloadFile(file) {
    // You may want to implement logic to download the file content here
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function removeFile(file, listItem) {
    // Remove the file from the displayed list
    listItem.remove();

    // Remove the file from local storage
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    const updatedFiles = storedFiles.filter(storedFile => storedFile.name !== file.name);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
}

// Load files from local storage when the page is loaded
window.addEventListener('load', () => {
    const fileListContainer = document.getElementById('fileList');
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

    for (const storedFile of storedFiles) {
        const listItem = createFileListItem(storedFile.content);
        fileListContainer.appendChild(listItem);
    }
});
