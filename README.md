# react-native-ot-translate-manager

Simple Translate Manager for React Native and Expo

## Installation

Use the yarn manager [yarn](https://yarnpkg.com/en/docs/install#windows-stable) to install react-native-ot-translate-manager.

```bash
yarn add react-native-ot-translate-manager
```
## Configuration

You must have you translate file in csv format

```csv
KEY;FR;EN;ES
EXAMPLE.MAIN.TITLE;titre;title;título
EXAMPLE.MAIN.SUBTITLE;sous titre;subtitle;subtítulo
```
*myTranslate.csv*

First line define each language key

The first column represents the key to the translation

All translations must be lowercase

## Import

```javascript

import Translate from 'react-native-ot-translate-manager'

```

## Prepare


```javascript


//Path of csv file
let path = './dummy.csv'

//Configuration object enabled and disabled language
let configuration = {
    "FR" : true,
    "EN" : true,
    "DE" : false,
    "ES" : false
}

//Let default language
let default = 'EN'

//Setup configuration (async function)
await Translate.setup(path,configuration,default)

```

## Usage

Update language location :

```javascript

await Translate.updateLanguage('ES')

```

Get language location :

```javascript

let currentLanguage = await Translate.getCurrentLanguage()

```

Simple display :

```html

<Text>
    { Translate.get(Translate.key.example.main.title) } => "title"
</Text>

```

Simple display with uppercase value :

```html

<Text>
    { Translate.toUppercase(0).get(Translate.key.EXAMPLE.MAIL.TITLE) } => "Title"
</Text>
```
```html

<Text>
    { Translate.toUppercase(2).get(Translate.key.EXAMPLE.MAIL.TITLE) } => "tiTle"
</Text>
```

```html

<Text>
    { Translate.toUppercase([0,2,4]).get(Translate.key.EXAMPLE.MAIL.TITLE) } => "TiTlE
</Text>
```
Simple display with complexe variable :

Variables can be added in translations


```csv
KEY;FR;EN;ES
EXAMPLE.MAIN.CURRENT.DATE;Il est %date% ;It is %date% ;Son las %date%
```

%date% is an variable

```html

<Text>
    { Translate.get(Translate.key.EXAMPLE.MAIN.CURRENT.DATE, {date: '01/01/2010' }) } => "It is 01/01/2010" 
</Text>
```

With multiple variable


```csv
KEY;FR;EN;ES
EXAMPLE.MAIN.CURRENT.DATE;Il est %time% le %date% ;It is %time% at %date% ;Son las %time% - %date%
```

```html

<Text>
    { Translate.get(Translate.key.EXAMPLE.MAIN.CURRENT.DATE, {date: '01/01/2010', time: '09:00:00' }) } => "It is 09:00:00 at 01/01/2010" 
</Text>
```

[MIT](https://choosealicense.com/licenses/mit/)