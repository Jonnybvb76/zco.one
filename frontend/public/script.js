async function shortenURL() {
    const urlInput = document.getElementById('url-input');
    const originalUrl = urlInput.value;
    dialog = document.getElementById("dialog");
    dialog.innerHTML = "";

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl }),
        });

        const data = await response.json();
        if (response.ok) {
            const resultDiv = document.getElementById('url');
            resultDiv.innerHTML = "https://zco.one/" + data.shortUrl;
            document.getElementById('result').style.display = "flex";
        } else {
            dialog.innerHTML = "Error: " + (data.error || 'Could not shorten URL');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function count() {
    const countElement = document.getElementById("count");

    try {
        const response = await fetch('/count', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error getting URL count');
        }

        const data = await response.json();
        countElement.innerHTML = data.count + ' Links';

    } catch (error) {
        console.error('Error:', error);
    }
}

function copyLink() {
    const copyText = document.getElementById('url').innerText;

    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = copyText;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999); 

    navigator.clipboard.writeText(tempTextArea.value);

    document.body.removeChild(tempTextArea);
}

function closeResult() {
    result = document.getElementById("result");
    if(result.style.display == "flex") {
        result.style.display = "none";
    }
}

document.getElementById("url-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        shortenURL();
    }
});

count();