import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBJQ5-sRSnJKgrdD_-5MMxogYam1LnKFL8',
  authDomain: 'hawaii-app-4fe27.firebaseapp.com',
  projectId: 'hawaii-app-4fe27',
  storageBucket: 'hawaii-app-4fe27.firebasestorage.app',
  messagingSenderId: '68447221865',
  appId: '1:68447221865:web:bddc3ff54919a3ae064af8',
  measurementId: 'G-ECJF9RBJJE',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
