// create constants
const page = document.querySelector('.page');
const API_KEY = localStorage.getItem('apiKey');

// create application container
const appContainer = document.createElement('div');
appContainer.classList.add('app');
page.appendChild(appContainer);

// create status message element
const statusMessage = document.createElement('p');
statusMessage.classList.add('app-form-status-message');

// create form
const appForm = document.createElement('form');
appForm.method = 'submit';
appForm.action = `none`;
appForm.classList.add('app-form');

const inputUrl = document.createElement('input');
inputUrl.classList.add('app-form-input');
inputUrl.placeholder = 'Enter url you want to convert to PDF';

const button = document.createElement('button');
button.classList.add('app-form-button');
button.textContent = 'Get PDF';

appContainer.appendChild(appForm);
appForm.appendChild(inputUrl);
appForm.appendChild(button);
appContainer.appendChild(statusMessage);

// create spinner and button tectContent 
const spinner = document.createElement('i');
spinner.classList.add('fa-solid', 'fa-spinner', 'fa-spin');
const buttonWaitingText = document.createElement('span');
buttonWaitingText.textContent = ' Converting..';

// create request to API
appForm.addEventListener('submit', (event) => {
    event.preventDefault();
    statusMessage.textContent = '';
    button.textContent = '';
    button.appendChild(spinner);
    button.appendChild(buttonWaitingText);
    button.disabled = true;
    fetch(`https://v2.convertapi.com/convert/web/to/pdf?Secret=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            'Parameters': [
                {
                    'Name': 'Url',
                    'Value': inputUrl.value
                },
                {
                    'Name': 'StoreFile',
                    'Value': true
                }
            ]
        })
    })
        .then(response => response.json())
        .then((data) => {
            if (data.Code >= 400) {
                throw new Error(data.Message);
            }

            const link = document.createElement('a');
            link.download = data.Files[0].FileName;
            link.textContent = 'here';
            link.href = data.Files[0].Url;
            link.click();
            statusMessage.textContent = 'File is ready and will download automatically. If not - click ';
            statusMessage.appendChild(link);
        })
        .catch((error) => {
            statusMessage.textContent = error;
        })
        .finally(() => {
            button.textContent = 'Get PDF';
            button.disabled = false;
        })
})
