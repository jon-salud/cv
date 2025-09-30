const CV_DATA_PATH = 'cv-data.json';

function myFunction() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}

async function loadCvData() {
   const response = await fetch(CV_DATA_PATH);
   if (!response.ok) {
      throw new Error('Unable to load CV data');
   }
   const data = await response.json();
   window.cvData = data;
   return data;
}

document.addEventListener('DOMContentLoaded', () => {
   loadCvData().catch((error) => {
      console.error('Failed to load CV data', error);
   });
});
