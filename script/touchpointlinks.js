/**
 * File: touchpointlinks.js
 * Description: This script initializes QR code generation for sign-in and feedback purposes
 *              using the QRCode library. It handles the dynamic generation of QR codes based
 *              on session-specific data, provides links to feedback and sign-in forms, and
 *              includes functionality for toggling the visibility of QR codes and copying URLs.
 * Author: Lach Mullen
 * Contributor: Jeff McDonald
 * Created with assistance from ChatGPT
 * Reference Library: QRCode (https://davidshimjs.github.io/qrcodejs/) - Licensed under MIT
 * Version: 1.0
 * Date: 2024-05-14
 * License: GNU General Public License (GPL)
 * Project Repository: https://github.com/LoneStarMac/webeoc-touchpoints/
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * For a copy of the GNU General Public License, see http://www.gnu.org/licenses/.
 *
 * This script is dependent on the QRCode library. Make sure to include the QRCode library
 * before this script. The QRCode library can be included in your HTML as follows:
 * <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
 * Ensure the QRCode script tag is placed in the HTML before this file is loaded.
*
 * For questions or support, please contact [lm102@rice.edu].
 */

// check if QRCode library is loaded
if (typeof QRCode === 'undefined') {
    console.error('touchpointlinks.js requires the QRCode library. Please include the library before this script.');
}

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve DOM elements that will be interacted with
    var sessionElement = document.getElementById("touchpoint_name__id_here"); // element where session info is stored
    var idElement = document.getElementById("idTag"); // element where id info is stored
    var qrboxFeedback = document.getElementById("qrbox-feedback"); // container for feedback QR code
    var qrboxSignin = document.getElementById("qrbox-signin"); // container for sign-in QR code

    // base URIs for the feedback and sign-in forms
    var feedbackFormBaseURI = "https://forms.juvare.com/forms/2771502f-bf31-4822-811d-a3009d7cdff7?session=";
    var signinFormBaseURI = "https://forms.juvare.com/forms/6597fdff-ceec-41c8-93a9-af461db6f2dc?session=";

    // check if the sessionElement has content and is not just whitespace
    if (sessionElement && sessionElement.textContent.trim() &&  idElement && idElement.textContent.trim()) {
        var encodedSession = encodeURIComponent(sessionElement.textContent.trim()); // encode session information for URL usage
        var encodedId = encodeURIComponent(idElement.textContent.trim()); // encode session information for URL usage

        // full URLs that will be used in QR codes and links
        var feedbackURI = feedbackFormBaseURI + encodedSession + "&id=" + sessionId.textContent.trim();
        var signinURI = signinFormBaseURI + encodedSession + "&id=" + sessionId.textContent.trim();

        // display versions of the URLs that are not encoded
        var displayFeedbackURI = feedbackFormBaseURI + sessionElement.textContent.trim() + "&id=" + sessionId.textContent.trim();
        var displaySigninURI = signinFormBaseURI + sessionElement.textContent.trim() + "&id=" + sessionId.textContent.trim();

        // generate and display QR codes using setupQRCode function
        setupQRCode("qrcode-feedback", feedbackURI);
        setupQRCode("qrcode-signin", signinURI);

        // create clickable links and copy functionality beneath each QR code
        createLink("feedback-link-container", feedbackURI, "Feedback form", displayFeedbackURI);
        createLink("signin-link-container", signinURI, "Sign-In form", displaySigninURI);
    } else {
        console.error("Element is missing or empty!"); // log an error if sessionElement is not usable
    }

    // function to initialize QR codes with the provided element ID and URL
    function setupQRCode(elementId, url) {
        new QRCode(document.getElementById(elementId), {
            text: url,
            width: 512,
            height: 512,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // event listener to toggle visibility of QR code sections
    document.getElementById('toggleQRButton').addEventListener('click', function () {
        toggleVisibility('codes');
    });

    // function to create links with a visible URL and a copy button
    function createLink(containerId, href, text, displayHref) {
        var container = document.getElementById(containerId);
        var span = document.createElement('span');
        span.textContent = text + ": ";
        var link = document.createElement('a');
        link.href = href;
        link.textContent = displayHref; // display the human-readable URL
        link.style.marginRight = "10px";
        container.appendChild(span);
        container.appendChild(link);

        // create a copy button with a clipboard icon
        var copyBtn = document.createElement('button');
        copyBtn.innerHTML = '&lt;i class="fas fa-copy"&gt;&lt;/i&gt;';
        copyBtn.className = "btn btn-sm";
        copyBtn.onclick = function () {
            // copy the encoded URL to the clipboard
            navigator.clipboard.writeText(href).then(function () {
                alert('URL copied to clipboard!');
            }, function (err) {
                alert('Failed to copy URL: ', err);
            });
        };
        container.appendChild(copyBtn);
    }

    // function to toggle the display style of an element, making it visible or hidden
    function toggleVisibility(id) {
        var element = document.getElementById(id);
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }

    // function to toggle visibility of QR codes
    function switchQR(displayId, hideId) {
        var displayElement = document.getElementById(displayId);
        var hideElement = document.getElementById(hideId);
        if (displayElement && hideElement) {
            displayElement.style.display = 'block'; // show this QR code
            hideElement.style.display = 'none';    // hide the other QR code
        }
    }

    // retrieve button elements and attach event listeners
    var signInBtn = document.getElementById("sign-in-qr");
    var feedbackBtn = document.getElementById("feedback-qr");

    if (signInBtn && feedbackBtn) {
        signInBtn.addEventListener("click", function () {
            switchQR("qrbox-signin", "qrbox-feedback");
        });

        feedbackBtn.addEventListener("click", function () {
            switchQR("qrbox-feedback", "qrbox-signin");
        });
    }
});
