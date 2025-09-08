let previewContainer = document.querySelector('.cropsPreview');
let previewBoxes = previewContainer.querySelectorAll('.preview');

document.querySelectorAll('.gridCropList .cropCard').forEach(cropCard => {
  cropCard.onclick = () => {
    previewContainer.style.display = 'flex';
    let name = cropCard.getAttribute('data-name');
    previewBoxes.forEach(preview => preview.classList.remove('active'));
    previewBoxes.forEach(preview => {
      if (preview.getAttribute('data-target') === name) {
        preview.classList.add('active');
      }
    });
  };
});

previewBoxes.forEach(preview => {
  let closeBtn = preview.querySelector('.fa-times');
  closeBtn.onclick = () => {
    preview.classList.remove('active');
    previewContainer.style.display = 'none';
  };
});

previewContainer.addEventListener('click', e => {
  if (e.target === previewContainer) {
    previewBoxes.forEach(preview => preview.classList.remove('active'));
    previewContainer.style.display = 'none';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && previewContainer.style.display === 'flex') {
    previewBoxes.forEach(preview => preview.classList.remove('active'));
    previewContainer.style.display = 'none';
  }
});

const searchInput = document.getElementById('cropSearchInput');
const cropCards = document.querySelectorAll('.gridCropList .cropCard');

searchInput.addEventListener('input', () => {
  let query = searchInput.value.toLowerCase();
  cropCards.forEach(card => {
    let cropName = card.dataset.name.toLowerCase();
    card.style.display = cropName.includes(query) ? 'block' : 'none';
  });
});