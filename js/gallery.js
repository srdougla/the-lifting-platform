const photoInput = document.getElementById('photoInput');
const captionInput = document.getElementById('captionInput');
const gallery = document.getElementById('gallery');

document.addEventListener('DOMContentLoaded', loadPhotos);

photoInput.addEventListener('change', function(e) {
    const files = e.target.files;
    const caption = captionInput.value;

    // remove empty state message if it's not empty
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = function(event) {
                const photoData = {
                    id: Date.now() + Math.random(),
                    src: event.target.result,
                    date: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    caption: caption
                };

            savePhoto(photoData);
            addPhotoToGallery(photoData);

            };

            reader.readAsDataURL(file);
        });

        photoInput.value = '';
        captionInput.value = '';
    }
});

function addPhotoToGallery(photoData) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.dataset.photoId = photoData.id;

    photoCard.innerHTML = `
    <button class="delete-btn" onclick="deletePhoto('${photoData.id}')">x</button>
    <img src="${photoData.src}">
    <div class="photo-info">
        <div class="photo-date">${photoData.date}</div>
        ${photoData.caption ? `<div class="photo-caption">${photoData.caption}</div>` : ''}
    </div>
    `;

    gallery.appendChild(photoCard);
}

function savePhoto(photoData) {
    const photos = getPhotos();
    photos.push(photoData);
    localStorage.setItem('gallery-photos', JSON.stringify(photos));
}

function getPhotos() {
    const photos = localStorage.getItem('gallery-photos');
    return photos ? JSON.parse(photos) : [];
}

function deletePhoto(photoId) {
    if (confirm('Delete this photo?')) {
        const photos = getPhotos();
        const updatedPhotos = photos.filter(photo => photo.id != photoId);
        localStorage.setItem('gallery-photos', JSON.stringify(updatedPhotos));

        const photoCard = document.querySelector(`[data-photo-id="${photoId}"]`);
        photoCard.remove();
    }
}

function loadPhotos() {
    const photos = getPhotos();
    photos.forEach(photo => {
        addPhotoToGallery(photo);
    });
}