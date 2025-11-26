export function appendAffiliateParams(rawUrl: string, source: string) {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.toLowerCase()
    if (host.includes('amazon')) {
      const tag = process.env.AMAZON_PARTNER_TAG
      if (tag) url.searchParams.set('tag', tag)
    }
    if (host.includes('flipkart')) {
      const aff = process.env.FLIPKART_AFF_ID
      if (aff) url.searchParams.set('affid', aff)
    }
    return url.toString()
  } catch {
    return rawUrl
  }
}

export function normalizeUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl)
    // Remove tracking params and normalize
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'tag', 'affid']
    paramsToRemove.forEach((p) => url.searchParams.delete(p))
    // Remove trailing slash
    url.pathname = url.pathname.replace(/\/$/, '')
    return url.origin + url.pathname
  } catch {
    return rawUrl.trim()
  }
}