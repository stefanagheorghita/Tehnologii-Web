document.addEventListener('DOMContentLoaded', function() {
  const mode = localStorage.getItem('mode');
  console.log('mode dark.js ' + mode);

  // Use the mode value as needed
  if (mode === 'true') {
    // Apply dark theme
    document.body.classList.add('dark-theme');
  } else {
    // Apply light theme
    document.body.classList.remove('dark-theme');
  }
});







// 'use strict';

// if(localStorage.getItem('mode') === 'true') {
//     document.body.classList.add('dark-theme');
// }
// else {
//     if(localStorage.getItem('token') !== null) {
//         fetch('http://localhost:3000/', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + localStorage.getItem('token')
//             }
//         }).then(response => {
//             if(response.status === 200) {
//                 response.json().then(result => {
//                     if(result.data.darkModeToggle === 'darkModeToggle') {
//                         document.body.classList.add('dark-theme');
//                     } else{
//                         document.body.classList.remove('dark-theme');
//                     }
//                 })
//             }
//         }).catch(err => {
//             document.body.classList.remove('dark-theme');
//         })
//     }
// }