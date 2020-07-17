import db from '../Firebase/firebase.init'

export default {
  methods: {
    // get patients data
    getPatientsData () {
      return db.collection('patients').get()
    }
  }
}
