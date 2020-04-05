import { useState } from 'react'
import { filesKey } from '../constants.js'
import { useLocalStorage } from './useLocalStorage'
import { parseFileLink } from 'parseFileLink'

export function useFiles() {
  const [files, setFiles] = useLocalStorage(filesKey, [])

  const addFile = (str) => {
    const fileData = parseFileLink(str)
    setFiles((files) => [...files, fileData])
  }

  const removeFile = (id, node) => {
    setFiles((files) =>
      files.filter((file) => !(file.id === id && file.node === node))
    )
    console.log(files, 'del')
  }

  return { files, addFile, removeFile }
}
