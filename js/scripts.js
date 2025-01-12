//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  const formData = new FormData(form);
  e.preventDefault();
  var object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  var json = JSON.stringify(object);
  result.innerHTML = "Please wait...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: json
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-green-500");
      } else {
        console.log(response);
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-red-500");
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Something went wrong!";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 5000);
    });
});

const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const PORT = 3000;

// Webhook URLs for different pages
const webhooks = {
    home: "https://discord.com/api/webhooks/1327931248584429628/B2c7b-Wvz1BHLzFhyz58Ffj3N6vdcMIyKvQW4KnvXRlBUgdW3HOYKUUyZlkC9J9wGXsQ", // main
    about: "https://discord.com/api/webhooks/1327931147354636370/gFrbsxzbXv8KyuUiVEx-lQVKhMF8gY03W1cxA7Phz63TtMSQNYSV0I-hve8RvjIKPzLU", // socials
    contact: "https://discord.com/api/webhooks/1327931026034528287/YOKpYyC-POC3I4gKdsYACfeenmmwqvEcJpcC7NgppYAsIggqNxOn69U_g7MFNJqFxWSj", // socialmedia
    services: "https://discord.com/api/webhooks/1327930917393666049/ipTV4JTZOmIl5tY5cC3fcVq8TC959Ng1UcUb2uWPLPF__-XfBW86hS1nHL5Chf9ImTD3" // adminpanel
};

// Middleware to parse JSON
app.use(express.json());

// Serve static files (like index.html, about.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route for home page
app.get('/', (req, res) => {
    sendVisitToWebhook(req.ip, 'home');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for about page
app.get('/about.html', (req, res) => {
    sendVisitToWebhook(req.ip, 'about');
    res.sendFile(path.join(__dirname, 'public', 'socials.html'));
});

// Route for contact page
app.get('/contact.html', (req, res) => {
    sendVisitToWebhook(req.ip, 'contact');
    res.sendFile(path.join(__dirname, 'public', 'socialmedia.html'));
});

// Route for services page
app.get('/services.html', (req, res) => {
    sendVisitToWebhook(req.ip, 'services');
    res.sendFile(path.join(__dirname, 'public', 'adminpanel.html'));
});

// Function to send visit data to the corresponding Discord webhook
async function sendVisitToWebhook(visitorIP, page) {
    try {
        // Use the corresponding webhook URL based on the page
        const webhookURL = webhooks[page];

        if (webhookURL) {
            await axios.post(webhookURL, {
                content: `## A visitor accessed the ${page} page! IP: \`\`\`${visitorIP}\`\`\``
            });
            console.log(`Message sent to Discord for ${page} page!`);
        } else {
            console.error('Webhook URL for this page is not defined');
        }
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
