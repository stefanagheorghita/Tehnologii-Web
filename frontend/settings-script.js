/*document.addEventListener("DOMContentLoaded", function() {

  // Get the value of the dark mode checkbox
const darkModeToggle = document.getElementById('darkModeToggle').checked;

// Prepare the data to be sent in the request body
const data = {
  darkModeToggle: darkModeToggle
};

console.log('Sending request with data:', data);

fetch('/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => {
    if (response.ok) {
      // Dark mode updated successfully
      console.log('Dark mode updated successfully');
    } else {
      // Dark mode update failed
      console.error('Dark mode update failed');
    }
  })
  .catch(error => {
    // Handle the error
    console.error('Error updating dark mode:', error);
  });*/

    
  /*//pt pagina settings
  const toggleSwitch = document.querySelector('#darkModeToggle');
    
  toggleSwitch.addEventListener('change', function () {
    console.log("luminaa");
    document.body.classList.toggle('dark-mode');
    document.getElementById('settingsForm').submit(); // Submit the form on checkbox change
  });*/
    


  /*const darkModeToggle = document.querySelector('#darkModeToggle');

  darkModeToggle.addEventListener('change', function() {
    const darkMode = this.checked;

    // Send a form submission to update dark mode preference in the server
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/settings';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'darkMode';
    input.value = darkMode ? 'on' : 'off';

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  });


  //dark
  /*const toggleSwitch = document.querySelector('#darkModeToggle');

  toggleSwitch.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');

    // Send the form data to the server
    const formData = new FormData();
    formData.append('darkMode', toggleSwitch.checked ? 'on' : 'off');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/settings');
    xhr.send(formData);
  }); */  
    
////////});


document.addEventListener('change', function() {
  
  function updateDarkModeSetting() {
    
    const darkModeToggle = document.getElementById('darkModeToggle').checked;
    
    console.log('asdcfg'+darkModeToggle);

    
    

    const data = {
      darkModeToggle: darkModeToggle
    };
  
    fetch('/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          console.log('Dark mode updated successfully');
          // document.getElementById('settingsForm').submit();
        } else {
          console.error('Dark mode update failed');
        }
      })
      .catch(error => {
        console.error('Error updating dark mode:', error);
      });
    
  }

  
  const toggleSwitch = document.querySelector('#darkModeToggle');
  toggleSwitch.addEventListener('change', updateDarkModeSetting);

  
  updateDarkModeSetting();
});
