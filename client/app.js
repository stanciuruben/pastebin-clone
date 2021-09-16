// LOAD PASTES FROM DB ON LOAD
document.addEventListener('onload', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/pastes', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
});