import * as fs from 'fs'
import * as path from 'path'

/* 
    address of api
*/

const api: string = `https://api.bilibili.com/x/web-interface/view?`

/* 
    Api information
*/

interface video_access {
  // identify
  // readonly bvid:string
  // status
  readonly code: number
  readonly message: string
  data?: {
    // bvid: string
    videos: number
    tname: string
    pic: string
    title: string
    pubdate: number
    duration: number
    desc: string
    // author information
    name: string
    // viewer interaction information
    viewer: number
    danmuku: number
    reply: number
    like: number
    coin: number
    share: number
    favorite: number
  }
  // get address
}

function fulfillI(jsonData: JSON): video_access {
  return jsonData as unknown as video_access
}

function printI(va: video_access): void {
  console.log(va)
}

/* 
    verify the url
*/

function verifyURL(urlIf: string): string {
  try {
    const url = new URL(urlIf)
    if (
      url.hostname === 'www.bilibili.com' ||
      url.hostname === 'bilibili.com'
    ) {
      let bvid = url.pathname
      // console.log(bvid.substring(7, bvid.length - 2))
      return vidNoCheck(bvid.substring(7, bvid.length - 1))
    }
  } catch (error) {
    console.log(`Not a valid address, verify whether bvid`)
    return vidNoCheck(urlIf)
  }
  return vidNoCheck(urlIf)
}

/* 
    Access Internet for json content
*/

async function fetchData(url: string): Promise<JSON> {
  try {
    const response: Response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`)
    }
    const data: JSON = await response.json()
    let newData = JSON.parse(JSON.stringify(data, replacer, 2))
    return Promise.resolve(newData)
  } catch (error) {
    console.error('Error fetching data:', error)
    return Promise.reject(error)
  }
}

/* 
    filter function
*/
function replacer(key: string, value: any): any {
  if (key === 'ttl') {
    return undefined
  }
  if (key === 'data') {
    return {
      bvid: value.bvid,
      videos: value.videos,
      tname: value.tname,
      pic: value.pic,
      title: value.title,
      pubdate: value.pubdate,
      desc: value.desc,
      duration: value.duration,
      name: value.owner.name,
      view: value.stat.view,
      danmuku: value.stat.danmuku,
      reply: value.stat.reply,
      favorite: value.stat.favorite,
      coin: value.stat.coin,
      share: value.stat.share,
      like: value.stat.like,
    }
  }
  return value
}

/* 
    check the aid and bvid number, if error, just throw error. 
*/

function vidNoCheck(bvid: string): string {
  const letter: string = bvid.substring(0, 2).toLowerCase()
  const num: string = bvid.substring(2)
  if (letter === 'bv') {
    let api_bv: string = api.concat('bvid=').concat(bvid)
    // console.log(api_bv)
    return api_bv
  } else if (letter === 'av') {
    let api_av: string = api.concat('aid=').concat(num)
    return api_av
  } else {
    console.error('You should put avid and bvid')
    // console.log(letter)
    // console.log(num)
    process.exit(1)
  }
}

/* basic function of getting json from api, filter and video number check */

/* 
    check if the directory exists, if not, create the folder recursively, or error if failed.
*/
async function checkVaildDirectory(path: string): Promise<void> {
  try {
    await fs.promises.stat(path)
    return Promise.resolve()
  } catch (error) {
    try {
      await fs.promises.mkdir(path, { recursive: true })
      return Promise.resolve()
    } catch (errorDocument) {
      console.error(`Can't create folder: ` + errorDocument)
      return Promise.reject(errorDocument)
    }
  }
}

/* 
    write a json document with string
*/

async function writeToJson(
  path: string,
  title: string,
  data: JSON
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await checkVaildDirectory(path)
      // const jsonData = JSON.parse(data)
      // console.log(data)
      const jsonString = JSON.stringify(data, null, 2)
      const p = path.concat(`/${title}.json`)
      // console.log(data)
      fs.writeFile(p, jsonString, 'utf8', (error) => {
        if (error) {
          console.error(`Error writing JSON File: ${error}`)
          reject(error)
        } else {
          console.log('JSON has been written successfully.')
          resolve()
        }
      })
    } catch (parseError) {
      console.log(`Error parsing JSON string: `, parseError)
      reject()
    }
  })
}

/* write to a file */

function main(args: string[]) {
  if (args.length != 1) {
    console.error('Usage: node helper.js <arg>')
    process.exit(1)
  }
  try {
    const pa = path.join(__dirname, 'jsonfile')
    const title = args[0]
    fetchData(vidNoCheck(args[0])).then((jsonData) => {
      writeToJson(pa, title, jsonData)
    })
  } catch (error) {
    console.error('Error: ' + error)
  }
  /* let a: video_access
  fetchData(verifyURL(args[0])).then((x) => {
    a = fulfillI(x)
    console.log(a.data)
    // printI(a)
  }) */
}

const arg = process.argv.slice(2)
main(arg)
