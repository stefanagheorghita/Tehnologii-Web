document.addEventListener('DOMContentLoaded', async function () {

const contactForm = document.querySelector('#contact-form');

const statusMessage = document.querySelector('#status-message');

contactForm.addEventListener('submit', (e) => {

  e.preventDefault();
  
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const subjectInput = document.querySelector('input[name="subject"]');
  const messageInput = document.querySelector('textarea[name="text-area"]');
  const token=localStorage.getItem('token');
  if(!token || token==='undefined' || token==='null' || token==='')
  {
    showStatusMessage('error', 'Please login to send message');
    return;
  }

  // Create an object to hold the form data
//   const formData = {
//     name: nameInput.value,
//     email: emailInput.value,
//     subject: subjectInput.value,
//     'text-area': messageInput.value
//   };
const formData = {
    name: nameInput.value,
    email: emailInput.value,
    subject: subjectInput.value,
    message: messageInput.value
  };

  //console.log(formData);

  fetch('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then((response) => {
      if (response.ok) {
        
        console.log('Form submitted successfully');
        showStatusMessage('success', 'Form submitted successfully');
       
      } else {
        
        console.error('Form submission failed');
        showStatusMessage('error', 'Form submission failed');
        
      }
    })
    .catch((error) => {
        console.error('Error occurred during form submission:', error);
        showStatusMessage('error', 'An error occurred during form submission');
    });
});



function validateFormInputs(nameInput, emailInput, subjectInput, messageInput) {
   
    if (nameInput.value.trim() === '') {
      showStatusMessage('error', 'Please enter your name');
      return false;
    }
  
    if (emailInput.value.trim() === '') {
      showStatusMessage('error', 'Please enter your email address');
      return false;
    }
  
  
    if (subjectInput.value.trim() === '') {
      showStatusMessage('error', 'Please enter a subject');
      return false;
    }
  
    if (messageInput.value.trim() === '') {
      showStatusMessage('error', 'Please enter your message');
      return false;
    }
  
    return true;
  }
  
  
  function showStatusMessage(type, message) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
  
    
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = '';
    }, 5000);
  }


});



