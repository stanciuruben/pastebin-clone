const customHttpRequest = (method, url, body) => {
    const xhr = new XMLHttpRequest();
    return new Promise( (resolve, reject) => {
        xhr.open(method, url, true);
        xhr.onload = function() {
            resolve(xhr.response);
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body !== null && JSON.stringify(body));
    }).then((response) => {
        return response;
    });
}

const runWhenDOMIsReady = async () => {
    if (document.readyState === "complete") {
        await customHttpRequest('GET', 'http://localhost:3000/createPastesTable', body);
        const body = {
            "argument": "title",
            "tableName": "pastes",
            "specifications": ""
        }
        const res = await customHttpRequest('GET', 'http://localhost:3000/selectData', body);
        // PARSE RESPONSE AS HTML AND APPEND IN DOM
        pastesHtml = res.reduce((acc, pasteTitle) => acc + `<a class="paste-title" href="#current-paste" onclick="showPaste(${pasteTitle})">${pasteTitle}</a>`, '');
        document.getElementById('pastes').innerHTML = pastesHtml;
    } else {
        setTimeout(runWhenDOMIsReady, 1000); // CHECKS IF DOM LOADED EVERY SECOND RECURSIVELY
    }
};

const showPaste = async (title) => {
    // GET PASTE TEXT FROM DB
    const specifications = `WHERE title = ${title}`;
    const body = {
        "argument": "text",
        "tableName": "pastes",
        "specifications": specifications
    }
    const res = await customHttpRequest('GET', 'http://localhost:3000/selectData', body);
    // SHOW CURRENT PASTE IN UI
    const currentPaste = document.getElementById('current-paste');
    currentPaste.innerHTML = '';
    const pasteTitle = document.createElement('h1');
    pasteTitle.innerText = title;
    const pasteText = document.createElement('p');
    pasteText.innerText = res;
    currentPaste.appendChild(pasteTitle);
    currentPaste.appendChild(pasteText);
}

const addNewPaste = async () => {
    // GET DATA FROM UI
    const pasteTitle = document.getElementById('new-paste-title').value;
    const pasteText = document.getElementById('new-paste-text').value;
    // RESET INPUTS
    document.getElementById('new-paste-title').value = '';
    document.getElementById('new-paste-text').value = '';
    // ADD PASTE TO DB
    const body = {
        "tableName": "pastes (title, text)",
        "values": [`(\'${pasteTitle}\', \'${pasteText}\')`]
    }
    const isPasteAdded = await customHttpRequest('POST', 'http://localhost:3000/insertInto', body);
    // ADD PASTE TO UI IF ADDED TO DATABASE SUCCESSFULLY
    console.log(isPasteAdded);
    if (isPasteAdded === 'success') {
        pasteHtml = document.createElement('a');
        pasteHtml.classList.add('paste-title');
        pasteHtml.href = "#current-paste";
        pasteHtml.onclick = () => {
            showPaste(pasteTitle);
        }
        pasteHtml.innerText = pasteTitle;
        document.getElementById('pastes').appendChild(pasteHtml);
        return;
    }
    // IF FAILD TO ADD PASTE TO DATABASE
    document.createElement('errors').innerText = 'DATABASE ERROR! PLEASE CONTACT OUR SUPPORT TEAM';
}

runWhenDOMIsReady();