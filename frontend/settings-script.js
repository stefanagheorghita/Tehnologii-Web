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


/*document.addEventListener('change', function() {
  
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
});*/


//seems good
/*document.addEventListener('DOMContentLoaded', async function() {
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Function to fetch the mode setting from the server
  async function fetchModeSetting() {
    try {
      const response = await fetch('/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const mode = data.mode;

        // Apply the appropriate theme based on the mode setting
        darkModeToggle.checked = mode;
        updateTheme(mode);
      } else {
        console.error('Failed to fetch mode setting');
      }
    } catch (error) {
      console.error('Error fetching mode setting:', error);
    }
  }

  // Function to update the theme based on the mode setting
  function updateTheme(mode) {
    if (mode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // Function to send the request and update the mode setting
  async function updateDarkModeSetting() {
    const darkModeValue = darkModeToggle.checked;

    try {
      const response = await fetch('/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ darkModeToggle: darkModeValue })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedMode = data.mode;

        // Apply the updated theme based on the mode setting
        updateTheme(updatedMode);
        console.log('Dark mode updated successfully');
      } else {
        console.error('Dark mode update failed');
      }
    } catch (error) {
      console.error('Error updating dark mode:', error);
    }
  }

  // Add event listener to the checkbox
  darkModeToggle.addEventListener('change', updateDarkModeSetting);

  // Fetch the initial mode setting when the page loads
  await fetchModeSetting();
});*/



// document.addEventListener('DOMContentLoaded', async function() {
//   const darkModeToggle = document.getElementById('darkModeToggle');

//   // Function to fetch the mode setting from the server
//   async function fetchModeSetting() {
//     try {
//       const response = await fetch('/settings', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.text();
//         const mode = data.mode;

//         // Apply the appropriate theme based on the mode setting
//         darkModeToggle.checked = mode;
//         updateTheme(mode);
//       } else {
//         console.error('Failed to fetch mode setting');
//       }
//     } catch (error) {
//       console.error('Error fetching mode setting:', error);
//     }
//   }

//   // Function to update the theme based on the mode setting
//   function updateTheme(mode) {
//     if (mode) {
//       document.body.classList.add('dark-theme');
//     } else {
//       document.body.classList.remove('dark-theme');
//     }
//   }

//   // Function to send the request and update the mode setting
//   async function updateDarkModeSetting() {
//     const darkModeValue = darkModeToggle.checked;

//     try {
//       const response = await fetch('/settings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ darkModeToggle: darkModeValue })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const updatedMode = data.mode;

//         // Apply the updated theme based on the mode setting
//         updateTheme(updatedMode);
//         console.log('Dark mode updated successfully');
//       } else {
//         console.error('Dark mode update failed');
//       }
//     } catch (error) {
//       console.error('Error updating dark mode:', error);
//     }
//   }

//   // Add event listener to the checkbox
//   darkModeToggle.addEventListener('change', updateDarkModeSetting);

//   // Fetch the initial mode setting when the page loads
//   await fetchModeSetting();
// });



document.addEventListener('DOMContentLoaded', async function() {
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Function to fetch the mode setting from the server
  async function fetchModeSetting() {
    console.log('se executa fetchModeSettings');
    try {
      const response = await fetch('/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.text();
        let mode;
        if(data.mode !==undefined)
         {  mode = data.mode === 'true';
        console.log('localStorage get mode = ' + mode);
        localStorage.setItem('mode', mode);
        darkModeToggle.checked = mode;
        console.log('iau valoarea da '+darkModeToggle.checked);
      }
      else{
        mode = localStorage.getItem('mode') === 'true'; 
        console.log('mod nu schimb'+mode);
        darkModeToggle.checked = mode;
        console.log('iau valoarea nu'+darkModeToggle.checked);
        console.log('mod mod '+mode);
      }
    // darkModeToggle.checked = mode;
      
        // Store the mode setting in a cookie or local storage
        // Example using local storage:
        

        // Apply the appropriate theme based on the mode setting
       
       // updateTheme(mode);
      } else {
        console.error('Failed to fetch mode setting');
      }
    } catch (error) {
      console.error('Error fetching mode setting:', error);
    }
  }

  // Function to update the theme based on the mode setting
  function updateTheme(mode) {
    mode = localStorage.getItem('mode') === 'true';
    // Update the checkbox state
    darkModeToggle.checked = mode;
    if (mode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // Function to send the request and update the mode setting
  async function updateDarkModeSetting() {
    const darkModeValue = darkModeToggle.checked;

    try {
      const response = await fetch('/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ darkModeToggle: darkModeValue })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedMode = data.mode;

        console.log('localStorage post mode = ' + updatedMode);

        // Update the mode setting in the cookie or local storage
        localStorage.setItem('mode', updatedMode);

        // Apply the updated theme based on the mode setting
        updateTheme(updatedMode);
        console.log('Dark mode updated successfully');
      } else {
        console.error('Dark mode update failed');
      }
    } catch (error) {
      console.error('Error updating dark mode:', error);
    }
  }

  // Add event listener to the checkbox
  darkModeToggle.addEventListener('change', updateDarkModeSetting);

  // Fetch the initial mode setting when the page loads
  await fetchModeSetting();
});