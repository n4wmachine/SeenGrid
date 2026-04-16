const DB_NAME = 'doclab';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(mode, fn) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE_NAME, mode);
      const store = t.objectStore(STORE_NAME);
      const result = fn(store);
      t.oncomplete = () => resolve(result._value);
      t.onerror = () => reject(t.error);
    });
  });
}

export async function getAllDocs() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_NAME, 'readonly');
    const req = t.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.updatedAt - a.updatedAt));
    req.onerror = () => reject(req.error);
  });
}

export async function saveDoc(doc) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_NAME, 'readwrite');
    t.objectStore(STORE_NAME).put(doc);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function deleteDoc(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_NAME, 'readwrite');
    t.objectStore(STORE_NAME).delete(id);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function importFiles(fileList) {
  const docs = [];
  for (const file of fileList) {
    const text = await file.text();
    const doc = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^.]+$/, ''),
      filename: file.name,
      content: text,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveDoc(doc);
    docs.push(doc);
  }
  return docs;
}
