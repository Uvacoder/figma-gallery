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

  const removeFile = (id) => {}

  return { files, addFile, removeFile }
}
