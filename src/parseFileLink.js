export const parseFileLink = (link) => {
  const id = getFileId(link)
  const node = getNodeId(link)
  console.log({ id, node })
  return { id, node }
}

function getUrlParams(search) {
  const hashes = search.slice(search.indexOf('?') + 1).split('&')
  const params = {}
  hashes.forEach((hash) => {
    const [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })
  return params
}

function getFileId(link) {
  const pathArr = link.split('/')
  const fileIndex = pathArr.findIndex((s) => s === 'file')
  if (fileIndex === -1) return null
  const idIndex = fileIndex + 1
  return pathArr[idIndex]
}

function getNodeId(link) {
  return getUrlParams(link)['node-id']
}
