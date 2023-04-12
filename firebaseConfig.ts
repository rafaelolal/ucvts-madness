// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBbitTjJgiECRoft7IWWRbj49G_vJR5i-k',
  authDomain: 'ucvts-madness.firebaseapp.com',
  projectId: 'ucvts-madness',
  storageBucket: 'ucvts-madness.appspot.com',
  messagingSenderId: '190510406973',
  appId: '1:190510406973:web:62f1bff50b142683df3954',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
