/**
 * Gets the photo file upload from the html page and sets the photo source/photo preview
 */
const fileInput = document.querySelector('#photo_upload');
if (fileInput) {
    fileInput.onchange = evt => {
        const [file] = fileInput.files
        if (file) {
            document.querySelector('#upload_preview').src = URL.createObjectURL(file);
            document.querySelector('#upload_source').value = file.name;
        }
    }
}