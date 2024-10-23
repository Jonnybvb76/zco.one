
async function shortenURL() {
    const urlInput = document.getElementById('url-input');
    const originalUrl = urlInput.value;

    dialog = document.getElementById("dialog");

    dialog.innerHTML = "";

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl }), 
        });

        if (!response.ok) {
            dialog.innerHTML = "Error shortening the URL! (maybe invalid URL?)";
            throw new Error('Error shortening the URL');
        }

        const data = await response.json();
        const resultDiv = document.getElementById('url');
        resultDiv.innerHTML = "https://zco.one/" + data.shortUrl; 

        document.getElementById('result').style.display = "flex";
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