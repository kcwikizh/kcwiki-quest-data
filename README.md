# Kcwiki Quest Data

![Build](https://github.com/kcwikizh/kcwiki-quest-data/workflows/Build%20and%20deploy/badge.svg)

🚧 The Structured data for Kantai Collection quest

## Supported features

- Auto complete for quest data

![image](https://user-images.githubusercontent.com/18554747/79259047-08d52700-7ec7-11ea-8a0c-729392866905.png)

- Hover documentation

![image](https://user-images.githubusercontent.com/18554747/79258575-4c7b6100-7ec6-11ea-880f-48ce728e6063.png)

- Types support
- JSON schema support
- Unit test
- Linter
- CI/CD
- Monitor new quest data from [poi server](https://github.com/poooi/poi-server) dump

![image](https://user-images.githubusercontent.com/18554747/81589987-1661cc00-93f5-11ea-8dd2-aaadfc3a524d.png)

## Instructions

### Quest data update

- Clone this repo
- Run `npm install`
- Run `npm run generateSchema`
- Edit `data/*.json` in [vscode](https://code.visualstudio.com/)

### Use in other libraries

To install the latest version, run the following command:

```sh
npm install --save kcwikizh/kcwiki-quest-data#release
```

Or if you're using [yarn](https://classic.yarnpkg.com/en/docs/install/):

```sh
yarn add kcwikizh/kcwiki-quest-data#release
```

```js
// API is currently in development and will be updated frequently
import { questData } from 'kcwiki-quest-data'
import type { Quest } from 'kcwiki-quest-data'
import quest101 from 'kcwiki-quest-data/data/101.json'
```

- Or use [gh-pages/data.min.json](https://github.com/kcwikizh/kcwiki-quest-data/tree/gh-pages) directly

## Reference

- [kcwikizh/kcdata](https://github.com/kcwikizh/kcdata)
- [任务 - 舰娘百科](https://zh.kcwiki.org/wiki/%E4%BB%BB%E5%8A%A1)
- [KC3Kai/kc3-translations/quests.json](https://github.com/KC3Kai/kc3-translations/blob/master/data/jp/quests.json)
- [poooi/plugin-quest](https://github.com/poooi/plugin-quest)

- [Editing JSON with Visual Studio Code](https://code.visualstudio.com/docs/languages/json)
- [typescript-json-schema](https://github.com/YousefED/typescript-json-schema)
- [quicktype](https://github.com/quicktype/quicktype)
- [JSON Schema Store](http://schemastore.org/json/)
