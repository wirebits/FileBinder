// JavaScript File for FileBinder
// Author - WireBits

const generateButton = document.getElementById('generate');
const resetButton = document.getElementById('reset');
const passwordInput = document.getElementById('password');
const messageInput = document.getElementById('message');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const fileSizeDisplay = document.getElementById('fileSize');

let file = null;
let filebase64 = '';

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    file = fileInput.files[0];
    if (file) {
        fileNameDisplay.textContent = `File Name : ${file.name}`;
        fileSizeDisplay.textContent = `File Size : ${file.size} bytes`;

        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            filebase64 = fileReader.result.replace('data:', '').replace(/^.+,/, '');
        }
        fileReader.readAsDataURL(file);
    }
});

resetButton.addEventListener('click', () => {
    passwordInput.value = '';
    messageInput.value = '';
    fileNameDisplay.textContent = 'File Name';
    fileSizeDisplay.textContent = 'File Size (in bytes)';
});

generateButton.addEventListener('click', () => {
    if (file) {
        build();
    } else {
        alert("Please upload a file first.");
    }
});

function build() {
    generateHTML();
}

function xor(input) {
    let result = '';
    const password = passwordInput.value;
    for (let i = 0; i < input.length; ++i) {
        result += String.fromCharCode(password.charCodeAt(i % password.length) ^ input.charCodeAt(i));
    }
    return result;
}

function generateHTML() {
    const htmlContent = `<!DOCTYPE html>
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Encrypted HTML File</title>
  <style>
   body {
     font-family: Arial, sans-serif;
     background-color: black;
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
     margin: 0;
     color: white;
     overflow: hidden;
    }
	.container {
     background-color: black;
     width: 100%;
     max-width: 600px;
     padding: 20px;
     border-radius: 8px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
     text-align: center;
     display: flex;
     flex-direction: column;
     align-items: center;
    }
	input[type="password"], textarea {
     color: white;
     resize: none;
     width: 100%;
     max-width: 400px;
     padding: 10px;
     border: 2px solid #87CEEB;
     border-radius: 4px;
     background: #000000;
     font-family: "Courier New", Courier, monospace;
     box-sizing: border-box;
     margin-bottom: 10px;
    }
	.file-name, .file-size, .message {
     color: #87CEEB;
     font-size: 16px;
     margin-bottom: 10px;
    }
	button {
     color: white;
     padding: 14px 20px;
     margin: 5px 10px;
     border: none;
     border-radius: 4px;
     cursor: pointer;
     font-size: 16px;
     width: 40%;
    }
	#generate {
     background-color: #00AB66;
    }
	.title {
     font-size: 1.5rem;
     margin-bottom: 1rem;
     color: white;
     border: 2px solid orange;
     padding: 10px;
     border-radius: 5px;
     letter-spacing: 5px;
    }
	button:hover, .upload:hover {
     opacity: 0.8;
    }
  </style>
 </head>
 <body>
  <div class="container">
   <div class="title">Download Original File</div>
   <div class="file-name">File Name : ${file.name}</div>
   <div class="file-size">File Size : ${file.size} bytes</div>
   <div class="message">Message : ${messageInput.value}</div>
   <input type="password" id="passwordField" placeholder="Enter Password">
   <button id="generate" onclick='retrieve()'>Open</button>
  </div>
  <script>
  function b64toarray(base64) {
	var bin_string = window.atob(base64);
	var len = bin_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = bin_string.charCodeAt(i);
	}
	return bytes.buffer;
  }
  function retrieve() {
	var passwordField = document.getElementById('passwordField');
	var password = passwordField.value;
	if (!password) {
		alert('Please enter a password.');
		return;
	}
	var decryptedData = xor(atob('${btoa(xor(filebase64))}'));
	var binaryData = b64toarray(decryptedData);
	var blob = new Blob([binaryData], { type: 'application/octet-stream' });
	var downloadLink = document.createElement('a');
	downloadLink.href = window.URL.createObjectURL(blob);
	downloadLink.download = '${file.name}';
	downloadLink.click();
	window.URL.revokeObjectURL(downloadLink.href);
  }
  function xor(input) {
	var result = '';
	var password = document.getElementById('passwordField').value;
	for (var i = 0; i < input.length; ++i) {
		result += String.fromCharCode(password.charCodeAt(i % password.length) ^ input.charCodeAt(i));
	}
	return result;
  }
  </script>
 </body>
</html>`;

    const targetFilename = file.name + ".html";
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = targetFilename;
    link.click();
    URL.revokeObjectURL(link.href);
}
