var helper = {
    // (A) AJAX FETCH
    ajax: (url, data, after) => {
        let formData = new FormData();
        for (let [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(responseData => after(responseData))
        .catch(error => {
            alert('An error occurred while making the request');
            console.error('Request failed:', error);
        });
    }
};


function showLocalStorage() {
    // Retrieve the value from local storage
    const credentialId = localStorage.getItem("webauthnCredentialId");

    // Show the value in an alert
    alert("Value in Local Storage: " + credentialId);
}

// Function to handle fingerprint login
function loginWithFingerprint() {
    const credentialIdBase64 = localStorage.getItem('webauthnCredentialId');
    if (!credentialIdBase64) {
        alert("No credential found. Please register first.");
        return;
    }
    const credentialId = base64ToArrayBuffer(credentialIdBase64);

    const options = {
        publicKey: {
            challenge: new Uint8Array([/* some challenge here */]),
            allowCredentials: [{
                id: credentialId,
                type: 'public-key',
            }],
            userVerification: 'preferred'
        }
    };

    navigator.credentials.get(options)
        .then((credential) => {
            // Credential verification logic...
            console.log("Login successful with credential:", credential);
            //showWelcomePage("Fingerprint");
            alert("Fingerprint login success");
        })
        .catch((error) => {
            console.error("WebAuthn login with fingerprint failed:", error);
            alert("Fingerprint login failed. Please try another method."+error);
        });
}


// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}





function register() {
    // Perform WebAuthn registration
    localStorage.clear();

    
    const options = {
        publicKey: {
            user: {
                id: new Uint8Array(16),
                name: "John Doe",
                displayName: "john.doe@example.com"
            },
            challenge: new Uint8Array(32),
            rp: {
                name: "WebAuthn Demo",
                id: "apps.shaukatkhanum.org.pk"//window.location.hostname
            },
            pubKeyCredParams: [
                { type: "public-key", alg: -7 }, // ES256
                { type: "public-key", alg: -257 } // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                requireResidentKey: false,
                userVerification: "preferred"
            },
            attestation: "none" 
        }
    };

    navigator.credentials.create({ publicKey: options.publicKey })
    .then((credential) => {
        // Conversion and storage logic here...
        const credentialIdArrayBuffer = credential.rawId;
        const credentialIdBase64 = arrayBufferToBase64(credentialIdArrayBuffer);

        // Store the Base64-encoded credential ID in localStorage
        localStorage.setItem('webauthnCredentialId', credentialIdBase64);
        alert("WebAuthn registration successful. Credential stored in local storage.");
    })
    .catch((error) => {
        console.error("WebAuthn registration failed:", error);
    });
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
let binary = '';
let bytes = new Uint8Array(buffer);
let len = bytes.byteLength;
for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
}
return window.btoa(binary);

}



function showWelcomePage(method) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('welcomePage').style.display = 'block';
    document.getElementById('welcomeMessage').innerText = `Welcome! You have successfully logged in using ${method}.`;
}

// Prompt user to login with fingerprint
//loginWithFingerprint();
  // Function to receive messages from Flutter
    function receiveMessageFromFlutter(message) {
   

        if (message=='Y'){
            apex.item("P8_PASSWORD").setValue(localStorage.getItem('pwd'));
        // setTimeout(function() {
                   
                 apex.jQuery('#LOGIN').trigger('click');
                   // }, 5000);
                   

         }
   


    }
 
    // Function to send a message to Flutter
    function sendMessageToFlutter() {
      messageHandler.postMessage("Biometric");
    }

     function sendMessageToFlutterFaceId() {
      messageHandler.postMessage("FaceId");
      //alert('Welcome')
    }

      function flutterMessageBiometricType(message) {
      // alert("Flutter Returned face type "+message)
        apex.item("P8_FACE").setValue(message);
       //apex.item("P8_NEW").setValue(message);
    }

		// Reading BarCode/QR Code
           //return message when passing parameter qrcode
        function qrMessageFromFlutter(message) {
            alert("Flutter Returned qr "+message);

    }
           //return message when passing parameter barcode_mrno
        function mrnoMessageFromFlutter(message) {
       	apex.item("P174_SCANNED_PATIENT_MRNO").setValue(message);

    }
            //return message when passing parameter qr_med
        function medicineMessageFromFlutter(message) {
       	apex.item("P174_SCANNED_MEDICICNE").setValue(message);

    }

        function qrSendMessageToFlutter(p_code) {
      messageHandler.postMessage(p_code);
    }
       /// "qrcode"