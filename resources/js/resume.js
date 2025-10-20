// DOM
document.addEventListener("DOMContentLoaded", () => {

    // set year in footer
    const yearSpan = document.getElementById("footeryear");
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    // downloadResume();
});

function downloadResume() {
    // Option 1: If you have a PDF file
    window.open('assets/files/Jesus Jansen Lee_Resume.pdf', '_blank');
    
    // Option 2: Print the page (user can save as PDF)
    // window.print();
    
    // Add a message
    // alert('You can save this page as PDF using your browser\'s print dialog (Ctrl+P or Cmd+P)');
}

// export function globally
window.downloadResume = downloadResume;