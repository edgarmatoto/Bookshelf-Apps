const listBuku = [];
const RENDER_EVENT = 'render-web';
const SAVED_EVENT = 'save-web';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('inputBook');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    inputBuku();
    clearInput();
  });
  loadData();
});

function clearInput() {
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
}

function inputBuku() {
  const inputJudul = document.getElementById('inputBookTitle').value;
  const inputPenulis = document.getElementById('inputBookAuthor').value;
  const inputTahun = document.getElementById('inputBookYear').value;
  const Id = buatId();

  const objekBuku = buatObjekBuku(Id, inputJudul, inputPenulis, inputTahun, false);
  listBuku.push(objekBuku);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function buatId() {
  return +new Date();
}

function buatObjekBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
}

document.addEventListener(RENDER_EVENT, function() {
  const incompleteBook = document.getElementById('incompleteBookshelfList');
  incompleteBook.innerHTML = '';

  const completeBook = document.getElementById('completeBookshelfList');
  completeBook.innerHTML = '';

  for (itemBuku of listBuku) {
    const elemenBuku = tampilkanBuku(itemBuku)
    if (itemBuku.isComplete) {
      completeBook.append(elemenBuku);
    } else {
      incompleteBook.append(elemenBuku);
    }
  }
});

function tampilkanBuku(objekBuku) {
  const judulBuku = document.createElement('h3');
  judulBuku.innerText = objekBuku.title;
  const penulisBuku = document.createElement('p');
  penulisBuku.innerText = `Penulis: ${objekBuku.author}`;
  const tahunBuku = document.createElement('p');
  tahunBuku.innerText = `Tahun: ${objekBuku.year}`;
  const tombolAksi = document.createElement('div');
  tombolAksi.classList.add('action');

  const article = document.createElement('section')
  article.classList.add('book_item');
  article.append(judulBuku, penulisBuku, tahunBuku, tombolAksi);

  const trashButton = document.createElement('button');
  trashButton.innerText = 'Hapus buku';
  trashButton.classList.add('red');
  trashButton.addEventListener('click', function() {
    hapusBuku(objekBuku.id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit buku';
  editButton.classList.add('yellow');
  editButton.addEventListener('click', function() {
    editBuku(objekBuku.id);
  });

  if (objekBuku.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.innerText = 'Belum dibaca';
    undoButton.classList.add('blue');
    undoButton.addEventListener('click', function() {
      belumDibaca(objekBuku.id);
    });

    tombolAksi.append(undoButton, trashButton, editButton);
  } else {
      const readButton = document.createElement('button');
      readButton.innerText = 'Selesai dibaca';
      readButton.classList.add('oldblue');
      readButton.addEventListener('click', function() {
        telahTerbaca(objekBuku.id);
    });

    tombolAksi.append(readButton, trashButton, editButton);
  }
  return article;
}

function hapusBuku(id) {
  const targetBuku = indexBuku(id);

  if (targetBuku === -1) return;

  listBuku.splice(targetBuku, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function indexBuku(id) {
  for (index in listBuku) {
    if (id === listBuku[index].id) {
      return index;
    }
  }

  return -1;
}

function belumDibaca(id) {
  const targetBuku = statusBuku(id);

  if (targetBuku == null) return;

  targetBuku.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function telahTerbaca(id) {
  const targetBuku = statusBuku(id);

  if (targetBuku == null) return;

  targetBuku.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBuku(id) {
  const targetBuku = statusBuku(id);
  if (targetBuku == null) return;
  
  document.getElementById('inputBookTitle').value = targetBuku.title;
  document.getElementById('inputBookAuthor').value = targetBuku.author;
  document.getElementById('inputBookYear').value = targetBuku.year;

  hapusBuku(id);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function statusBuku(id) {
  for (const objekBuku of listBuku) {
    if (id === objekBuku.id) {
      return objekBuku;
    }
  }
  return null;
}

function saveData() {
  if (isStorageSupport()) {
    const parsed = JSON.stringify(listBuku);
    localStorage.setItem('APPS_BUKU', parsed);
  }
}

function isStorageSupport() {
  if (typeof(Storage) === undefined) {
    alert('Browser anda tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadData() {
  const parsed = JSON.parse(localStorage.getItem('APPS_BUKU'));

  if (parsed !== null) {
    for (const objekBuku of parsed) {
      listBuku.push(objekBuku);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}