import { repository, version } from '../../package.json'
import { BAND_MKTS, BING } from './constants'
import initContextMenu from './context_menus'
import { getURL, getURLSearchParams, openPage, registryListener, setCookie } from './utils'

export default () => {
  initContextMenu()
  registryListener({
    openUrlInSameTab: async ({ url }: { url: string } = {} as any) => {
      const tabs = await chrome.tabs.query({ currentWindow: true })
      const urlObj = getURL(url)
      let tab = tabs.find((tab) => tab.url?.startsWith(urlObj.origin))
      if (tab == null) {
        tab = await chrome.tabs.create({ url })
      } else {
        if (tab.id != null) {
          await Promise.all([chrome.tabs.move(tab.id, { index: tabs.length - 1 }), chrome.tabs.update(tab.id, { active: true })])
        }
      }

      let newUrl = url
      let query = ''
      let tabQuery = ''
      const isGoogle = urlObj.hostname === 'www.google.com'
      const isBing = urlObj.hostname === 'www.bing.com'
      if (isGoogle) {
        query = urlObj.searchParams.get('q') ?? ''
        tabQuery = getURL(tab.url).searchParams.get('q') ?? ''
        getURL(tab.url).searchParams.get('q')
      } else if (isBing) {
        query = urlObj.searchParams.get('q') ?? ''
        tabQuery = getURL(tab.url).searchParams.get('q') ?? ''
      }

      query = query.trim()
      tabQuery = tabQuery.trim()

      if (query && query === tabQuery) return // 不刷新页面

      if (isGoogle) {
        newUrl = `${urlObj.origin}${urlObj.pathname}?q=${encodeURIComponent(query)}`
      } else if (isBing) {
        newUrl = `${urlObj.origin}${urlObj.pathname}?q=${encodeURIComponent(query)}`
        // newUrl = `${urlObj.origin}${urlObj.pathname}?q=${query}&showconv=1`
      }

      await chrome.tabs.update(tab.id!, { url: newUrl })
    },
    ...(() => {
      const MAX_AGE = 1000 * 60 * 15 // 15min
      const KEY = 'notification'
      const FLAG_KEY = 'notification:hide'
      const getRemoteNotification = async () => {
        // console.log('getRemoteNotification')
        let data
        try {
          data = await fetch('https://api.github.com/repos/haozi/New-Bing-Anywhere/issues/24').then(async (res) => await res.json())
        } catch {}
        return data
      }
      return {
        getNotification: async () => {
          const { [KEY]: oldData } = await chrome.storage.local.get(KEY)

          if (!oldData || (oldData.lastModify && Date.now() - oldData.lastModify > MAX_AGE)) {
            await chrome.storage.local.remove(KEY)
            const data = await getRemoteNotification()

            if (data) {
              await chrome.storage.local.set({ [KEY]: { data, lastModify: Date.now() } })
            }
          }

          const { [FLAG_KEY]: flag, [KEY]: newData } = await chrome.storage.local.get([FLAG_KEY, KEY])

          if (!newData?.data) return null
          if (!(newData.data.title && newData.data.state === 'open')) return null
          if (flag === 1 && newData.data.title === oldData.data?.title) return null
          await chrome.storage.local.remove(FLAG_KEY)
          return newData.data
        },

        hideNotification: async () => {
          chrome.storage.local.set({ [FLAG_KEY]: 1 })
        }
      }
    })()
  })

  chrome.runtime.onInstalled.addListener((details) => {
    const repositoryUrl: string = repository.url
    // const debugurl = 'https://www.bing.com/search?q=Edge%20%E4%B8%8B%E8%BD%BD&showconv=1&FORM=hpcodx'
    // if (debugurl) {
    //   openPage(debugurl)
    //   return
    // }

    if (details.reason === 'install') {
      openPage(repositoryUrl)
    } else if (details.reason === 'update') {
      openPage(`${repositoryUrl}/releases/tag/v${version}`)
    }
  })

  chrome.webRequest.onBeforeRequest.addListener(
    () => {
      chrome.cookies.get(
        {
          name: '_EDGE_S',
          url: BING
        },
        (cookie) => {
          const value = cookie?.value
          if (!value) return

          const valueObj = getURLSearchParams(value)
          const mkt = valueObj.get('mkt')?.toLowerCase() ?? ''

          if (!BAND_MKTS.map((m) => m.toLowerCase()).includes(mkt)) return
          if (mkt === 'zh-cn') {
            valueObj.set('mkt', 'zh-HK')
            valueObj.set('ui', 'zh-hans')
          } else {
            valueObj.delete('mkt')
          }

          setCookie(
            {
              url: BING,
              name: cookie.name,
              value: valueObj.toString()
            },
            cookie
          )
        }
      )

      chrome.cookies.get(
        {
          name: '_RwBf',
          url: BING
        },
        (cookie) => {
          const value = cookie?.value
          if (!value) {
            setCookie({
              url: BING,
              name: '_RwBf',
              value: 'wls=2',
              domain: '.bing.com',
              httpOnly: true
            })
            return
          }

          const valueObj = getURLSearchParams(value)
          if (valueObj.get('wls') !== '2') {
            valueObj.set('wls', '2')
          }
          setCookie(
            {
              url: BING,
              name: '_RwBf',
              domain: '.bing.com',
              httpOnly: true,
              value: valueObj.toString()
            },
            cookie
          )
        }
      )
    },
    { urls: [BING + '*'], types: ['main_frame'] }
  )
}
