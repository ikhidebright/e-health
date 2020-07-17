<template>
    <b-container>
      <div class="chart mx-auto">
      <b-spinner label="Spinning" v-if="loading" class="chart"></b-spinner>
      <p v-else-if="error">An Error Occured, no saved Data locally or Internet connection is down 😥 </p>
    <Chart :data="data" v-else/>
      </div>
    </b-container>
</template>

<script>
import Chart from '@/components/Chart'
import customHelper from '../../Services/patients.service'
import _ from 'lodash'

export default {
  name: 'Home',
  mixins: [customHelper],
  data () {
    return {
      patientsData: [],
      error: false,
      loading: false,
      ageRanges: [[10, 19], [20, 28], [29, 36], [37, 190]],
      data: []
    }
  },
  components: {
    Chart
  },
  methods: {
    range (start, end) {
      return Array.from({ length: (end - start) }, (v, k) => k + start)
    },
    async saveToLocal (item) {
      const dataToStore = JSON.stringify(item)
      await localStorage.setItem('dataFromLocalStorage', dataToStore)
    },
    getLocalStorageData () {
      if (localStorage.getItem('dataFromLocalStorage') === null) {
        this.error = true
      } else {
        this.error = false
        const data = localStorage.getItem('dataFromLocalStorage')
        return JSON.parse(data)
      }
    },
    async getPatients () {
      const querySnapshot = await this.getPatientsData()
      if (querySnapshot.empty && querySnapshot.docs.length < 1) {
        this.data = this.getLocalStorageData()
      } else {
        await querySnapshot.forEach(doc => {
          this.patientsData.push(doc.data())
        })
      }
    },
    async bloodGroupsArray () {
      const bloodGroup = await _.map(this.patientsData, 'bloodGroup')
      // from the bloodGroup array get unique bloodGroups (make bloodGroup occur once)
      const uniqBloodGroup = await _.uniq(bloodGroup)
      // list bloodGroups and get their counts
      uniqBloodGroup.forEach((item) => {
        const arr = _.filter(this.patientsData, ['bloodGroup', item])
        const BloodGroupsAndCounts = [item, arr.length]
        // push the BloodGroupsAndCounts in the chartOptions data array
        this.data.push(BloodGroupsAndCounts)
      })
    },
    async ageRangesArray () {
      this.ageRanges.forEach((item) => {
      // get age ranges by specifying start, end ponts to the range function
        const arr = this.range(item[0], item[1])
        // filter items with age ranges
        const ageRanges = _.filter(this.patientsData, function (o) { return arr.includes(o.age) })
        // console.log(ageRanges)
        item[1] = item[1] >= 190 ? 'and Above' : '- ' + item[1]
        const text = 'Ages ' + `${item[0]} ${item[1]}`
        // console.log([text, ageRanges.length])
        this.data.push([text, ageRanges.length])
      })
    }
  },
  async mounted () {
    try {
      // start loading spinner
      this.loading = true
      await this.getPatients()
      // map bloodGroups in an array
      await this.bloodGroupsArray()
      // get arrays of age ranges
      await this.ageRangesArray()
      // stop loading spinner
      this.loading = false
      // store chart data in localStorage
      await this.saveToLocal(this.data)
    } catch (err) {
      this.loading = false
      this.data = this.getLocalStorageData()
    }
  }
}
</script>

<style scoped>
.chart {
  margin-top: 20vh;
}
</style>
