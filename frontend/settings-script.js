document.addEventListener("DOMContentLoaded", function() {
    
  //pt pagina settings
  const toggleSwitch = document.querySelector('#darkModeToggle');
    
  toggleSwitch.addEventListener('change', function () {
    console.log("luminaa");
    document.body.classList.toggle('dark-mode');
    document.getElementById('settingsForm').submit(); // Submit the form on checkbox change
  });
    


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
    
});