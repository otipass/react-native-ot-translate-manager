import deepAssign from 'deep-assign'
import AsyncStorage from "@react-native-async-storage/async-storage"

class Translate {

    constructor() {
        this.isSetup = false
    }

    async getCurrentLanguage() {
        return await AsyncStorage.getItem("language")
    }

    async updateLanguage(language) {
        if(this.configuration[language]) {
            this.language = language.toLowerCase()
            await await AsyncStorage.setItem("language", language)
            return true
        } else {
            throw "Erreur dans Translate: updateLanguage() => langue '"+language+"' inconnue en configuration"
        }
    }


    async setup(translateConfiguration,translateContent,defaultLanguage,customContent = "") {
        this.configuration = translateConfiguration

        /* Definie targetUppercase */
        this.targetUppercase = new Array()
        
        /* Get last language in the memory */
        let language = await AsyncStorage.getItem("language")
        if(language == undefined) {
            language = defaultLanguage.toLowerCase()
            await AsyncStorage.setItem("language", language)
        }
        this.language = language.toLowerCase()

        /* Parse csv file */
        translateArr = this.parseAndBuildCSV(translateContent)
        translateArrCustom = this.parseAndBuildCSV(customContent)
        /* Build dynamics objects */
        let build = (line,data) => {
            let image = {}
            if(line.length == 0) {
                return data
            }
            let item = line.shift()
            image[item] = build(line,data)
            return image
        }
        this.key = {}
        
        translateArr.forEach(itemArr => {
            let key = itemArr.KEY
            let line = key.split('.')
            delete itemArr.KEY
            deepAssign(this.key,build(line,itemArr))
        })
        translateArrCustom.forEach(itemArr => {
            let key = itemArr.KEY
            let line = key.split('.')
            delete itemArr.KEY
            deepAssign(this.key,build(line,itemArr))
        })
        this.isSetup = true
    }

    parseAndBuildCSV(content) {
        if(typeof content != "string") {
            content = ""
        }
        let file = content.split('\n')
        let keys = file.shift().replace(/\r/g, '').split(';')
        let translateArr = new Array()
        file.map(element => {
            let temp = element.replace(/\r/g, '').split(';')
            let tempObj = {}
            keys.forEach((key,index) => {
                tempObj[key] = temp[index]
            })
            translateArr.push(tempObj)
        })
        return translateArr
    }

    toUppercase(dist) {
        if(Array.isArray(dist)) {
            dist.forEach(el => {
                this.targetUppercase.push(el)
            })
        }  else if(typeof dist == 'number') {
            this.targetUppercase.push(dist)
        }
        return this
    }


    get(key, ob = {}) {
        if(this.isSetup == false) {
            return "MODULE_IS_NOT_SETUP"
        }
        if(key == undefined) {
            return "KEY_UNDEFINED"
        }
        let phrase = ""
        if(key[this.language]) {
            phrase = key[this.language]
        } else {
            phrase = key[this.defaultLanguage]
        }
        if(phrase == undefined) {
            return
        }
        for (let objKey in ob) {
            phrase = phrase.replace("%"+objKey+"%", ob[objKey])
        }
        this.targetUppercase.forEach(uppercase => {
            if(uppercase < phrase.length && uppercase >= 0) {
                phrase = phrase.slice(0,uppercase) + phrase[uppercase].toUpperCase() + phrase.slice(uppercase+1,phrase.length)
            }
        })
        this.targetUppercase = new Array()
        return phrase
    }
}

const translate = new Translate()

export default translate
