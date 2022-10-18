/* eslint-disable no-restricted-globals */
const fs = require('node:fs')
const { argv } = require('node:process')

const csvjson = require('csvjson')

const command = argv[2]

class Bio {
  constructor(name, sex, age, height, weight) {
    this.name = name
    this.sex = sex
    this.age = age
    this.height = height
    this.weight = weight
  }
}

const readCSVFile = (filepath) => {
  const data = fs.readFileSync((__dirname, filepath), { encoding: 'utf8' })
  const options = {
    delimiter: ',',
    quote: '""',
    headers: 'name,sex,age,height,weight',
  }

  return csvjson.toObject(data, options)
}

const writeCSVFile = (filepath, arrayBio) => {
  try {
    const options = {
      delimiter: ',',
      quote: '""',
      headers: 'key',
    }
    fs.writeFileSync(filepath, csvjson.toCSV(arrayBio, options), 'utf8', 'w')
    return true
  } catch {
    return false
  }
}

const create = (bioObject, arrayBio) => {
  if (!arrayBio.find((bio) => bio.name.toLowerCase() === bioObject.name.toLowerCase())) {
    return [...arrayBio, bioObject]
  }
  return null
}

const read = (bioObject, arrayBio) => {
  if (arrayBio.find((bio) => bio.name.toLowerCase() === bioObject.toLowerCase())) {
    return arrayBio.find((bio) => bio.name.toLowerCase() === bioObject.toLowerCase())
  }
  return null
}

const update = (bioObject, arrayBio) => {
  if (arrayBio.find((bio) => bio.name.toLowerCase() === bioObject.name.toLowerCase())) {
    // eslint-disable-next-line max-len
    const bioIndex = arrayBio.findIndex((bio) => bio.name.toLowerCase() === bioObject.name.toLowerCase())
    const { name } = bioObject
    const { sex } = bioObject.sex
    const { age } = bioObject.age
    const { height } = bioObject.height
    const { weight } = bioObject.weight
    // eslint-disable-next-line no-param-reassign
    arrayBio[bioIndex] = {
      ...arrayBio[bioIndex], name, sex, age, height, weight,
    }
    return arrayBio
  }
  return null
}

const deletion = (bioObject, arrayBio) => {
  if (arrayBio.find((bio) => bio.name.toLowerCase() === bioObject.toLowerCase())) {
    return arrayBio.filter((bio) => bio.name.toLowerCase() !== bioObject.toLowerCase())
  }
  return null
}

let bioArray = readCSVFile('biostats.csv')

switch (command) {
  case '-c':
    if (argv.length !== 8) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      let name = argv[3]
      let sex = argv[4]
      const age = Number(argv[5])
      const height = Number(argv[6])
      const weight = Number(argv[7])
      if (!sex.toLowerCase === 'f' || !sex.toLowerCase === 'm') {
        console.log('Incorrect sex')
      } else if (isNaN(age)) {
        console.log('Age is not a number')
      } else if (age < 18) {
        console.log('Age is underaged')
      } else if (isNaN(height)) {
        console.log('Height is not a number')
      } else if (isNaN(weight)) {
        console.log('Weight is not a number')
      } else {
        name = name.charAt(0).toUpperCase() + name.slice(1)
        sex = sex.toUpperCase()
        const newBio = new Bio(name, sex, age, height, weight)
        bioArray = create(newBio, bioArray)
        if (bioArray === null) {
          console.log('Name already exists')
        } else {
          bioArray.shift()
          writeCSVFile('biostats.csv', bioArray)
        }
      }
    }
    break
  case '-r':
    if (argv.length !== 4) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      const name = argv[3]
      bioArray = read(name, bioArray)
      if (bioArray === null) {
        console.log('Name does not exist')
      } else {
        console.log(`name: ${bioArray.name}`)
        switch (bioArray.sex) {
          case 'F':
            console.log('sex: Female')
            break
          case 'M':
            console.log('sex: Male')
            break
          default:
            console.log('no sex is available')
        }
        console.log(`age: ${bioArray.age}
height: inches: ${bioArray.height} centimeters: ${(bioArray.height * 2.54).toFixed(2)}
weight: pounds: ${bioArray.weight} kilograms: ${(bioArray.weight * 0.45359237).toFixed(2)}`)
      }
    }
    break
  case '-u':
    if (argv.length !== 8) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      let name = argv[3]
      let sex = argv[4]
      const age = Number(argv[5])
      const height = Number(argv[6])
      const weight = Number(argv[7])
      if (!sex.toLowerCase === 'f' || !sex.toLowerCase === 'm') {
        console.log('Incorrect sex')
      } else if (isNaN(age)) {
        console.log('Age is not a number')
      } else if (age < 18) {
        console.log('Age is underaged')
      } else if (isNaN(height)) {
        console.log('Height is not a number')
      } else if (isNaN(weight)) {
        console.log('Weight is not a number')
      } else {
        name = name.charAt(0).toUpperCase() + name.slice(1)
        sex = sex.toUpperCase()
        const newBio = new Bio(name, sex, age, height, weight)
        bioArray = update(newBio, bioArray)
        if (bioArray === null) {
          console.log('Name does not exist')
        } else {
          bioArray.shift()
          writeCSVFile('biostats.csv', bioArray)
        }
      }
    }
    break
  case '-d':
    if (argv.length !== 4) {
      console.log('You do not have the right number of arguments to run this command')
    } else {
      const name = argv[3]
      bioArray = deletion(name, bioArray)
      if (bioArray === null) {
        console.log('Name does not exist')
      } else {
        bioArray.shift()
        writeCSVFile('biostats.csv', bioArray)
      }
    }
    break
  default:
    console.log('Command does not exist')
}
