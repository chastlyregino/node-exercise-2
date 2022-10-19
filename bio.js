const fs = require('node:fs')
const { argv } = require('node:process')

const csvjson = require('csvjson')

const capitalCase = (name) => name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()

const inToCm = (height) => height * 2.54

const lbsToKg = (weight) => weight / 2.205
class BioStat {
  constructor(name, sex, age, height, weight) {
    this.name = capitalCase(name)
    this.sex = sex.toUpperCase()
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }

  isValidName() {
    return typeof this.name === 'string'
  }

  isValidSex() {
    return 'FM'.includes(this.sex)
    && typeof this.sex === 'string'
    && this.sex.length === 1
  }

  isValidAge() {
    return !Number.isNaN(this.age)
    && this.age >= 18
  }

  isValidHeight() {
    return !Number.isNaN(this.height)
  }

  isValidWeight() {
    return !Number.isNaN(this.weight)
  }
}

const errorMessage = (bioObject) => {
  let messageResult = []
  if (bioObject.isValidName() === false) {
    messageResult = [...messageResult, 'Name should be a string']
  }
  if (bioObject.isValidSex() === false) {
    messageResult = [...messageResult, 'Incorrect sex']
  }
  if (bioObject.isValidAge() === false) {
    messageResult = [...messageResult, 'Age is not a number or underaged']
  }
  if (bioObject.isValidHeight() === false) {
    messageResult = [...messageResult, 'Height is not a number']
  }
  if (bioObject.isValidWeight() === false) {
    messageResult = [...messageResult, 'Weight is not a number']
  }
  return messageResult.join(', ')
}

const readCSVFile = (filepath) => {
  const data = fs.readFileSync((__dirname, filepath), { encoding: 'utf8' })
  const options = {
    delimiter: ',',
    quote: '"',
    headers: 'name,sex,age,height,weight',
  }

  const stats = csvjson.toObject(data, options)
  const headers = Object.keys(stats)
  const map = new Map()

  for (let i = 1; i < headers.length; i += 1) {
    map.set(stats[headers[i]].name, stats[headers[i]])
  }
  return map
}

const writeCSVFile = (filepath, mapBio) => {
  try {
    const options = {
      delimiter: ',',
      quote: '"',
      headers: 'key',
    }
    const result = Array.from(mapBio.values())
    fs.writeFileSync(filepath, csvjson.toCSV(result, options), 'utf8', 'w')
    return true
  } catch {
    return false
  }
}

const create = (bioObject, mapBio) => {
  if (!mapBio.has(bioObject.name)) {
    const bioMap = mapBio
    bioMap.set(bioObject.name, bioObject)
    return bioMap
  }
  return null
}

const read = (bioName, mapBio) => {
  if (mapBio.has(bioName)) {
    return mapBio.get(bioName)
  }
  return null
}

const update = (bioObject, mapBio) => {
  if (mapBio.has(bioObject.name)) {
    const bioMap = mapBio
    bioMap.set(bioObject.name, bioObject)
    return bioMap
  }
  return null
}

const deletion = (bioName, mapBio) => {
  const bioMap = mapBio
  if (bioMap.delete(bioName)) {
    return bioMap
  }
  return null
}

let bioArray = readCSVFile('biostats.csv')
const [, , command, name, sex, age, height, weight] = argv

switch (command) {
  case '-c': {
    if (argv.length !== 8) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      const newBio = new BioStat(name, sex, age, height, weight)
      if (errorMessage(newBio).length !== 0) {
        console.log(`${errorMessage(newBio)}`)
      } else {
        bioArray = create(newBio, bioArray)
        if (bioArray === null) {
          console.log('Name already exists')
        } else {
          writeCSVFile('biostats.csv', bioArray)
        }
      }
    }
    break
  }
  case '-r': {
    if (argv.length !== 4) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      bioArray = read(capitalCase(name), bioArray)
      if (bioArray === null) {
        console.log('Name does not exist')
      } else {
        console.log(`
name: ${bioArray.name}
sex: ${bioArray.sex === 'F' ? 'Female' : 'Male'}
age: ${bioArray.age}
height: inches: ${bioArray.height} centimeters: ${inToCm(bioArray.height).toFixed(2)}
weight: pounds: ${bioArray.weight} kilograms: ${lbsToKg(bioArray.weight).toFixed(2)}
`)
      }
    }
    break
  }
  case '-u': {
    if (argv.length !== 8) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      const newBio = new BioStat(name, sex, age, height, weight)
      if (errorMessage(newBio).length !== 0) {
        console.log(`${errorMessage(newBio)}`)
      } else {
        bioArray = update(newBio, bioArray)
        if (bioArray === null) {
          console.log('Name does not exist')
        } else {
          writeCSVFile('biostats.csv', bioArray)
        }
      }
    }
    break
  }
  case '-d': {
    if (argv.length !== 4) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      bioArray = deletion(capitalCase(name), bioArray)
      if (bioArray === null) {
        console.log('Name does not exist')
      } else {
        writeCSVFile('biostats.csv', bioArray)
      }
    }
    break
  }
  default:
    console.log('Command does not exist')
}
