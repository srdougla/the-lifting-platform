document.querySelectorAll('.library-nav li').forEach(item => {
    item.addEventListener('click', () => {
        const videoURL = item.getAttribute('data-video');
        const descriptionText = item.getAttribute('data-description');

        document.getElementById('currentVid').src = videoURL;
        document.getElementById('videoDescription').textContent = descriptionText;
    });
});


