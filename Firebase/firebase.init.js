import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from '../Firebase/firebase.config'
const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp.firestore()
