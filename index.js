const fs = require('fs')
const deepAssign = require('deep-assign');
const reactNative = require('react-native')

class Translate {


    async getCurrentLanguage() {
        return await reactNative.AsyncStorage.getItem("language")
    }

    async updateLanguage(language) {
        if(typeof this.configuration[language] == "object") {
            this.language = language
            await await reactNative.AsyncStorage.setItem("language", language)
            return true
        } else {
            throw "Erreur dans Translate: updateLanguage() => langue '"+language+"' inconnue en configuration"
        }
    }


    async setup(configuration,path,defaultLanguage) {

        this.configuration = configuration

        /* Definie targetUppercase */
        this.targetUppercase = new Array()
        
        /* Get last language in the memory */
        let language = await reactNative.AsyncStorage.getItem("language")
        if(language == undefined) {
            language = defaultLanguage
            await reactNative.AsyncStorage.setItem("language", language)
        }
        this.language = language

        /* Parse csv file */
        let file = fs.readFileSync(path).toString().split('\n')
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
        let phrase = ""
        if(key[this.language]) {
            phrase = key[this.language]
        } else {
            phrase = key[this.defaultLanguage]
        }
        if(phrase == undefined) {
            console.log(KEY)
            return KEY
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

module.exports = translate
