import React, { useState, useEffect } from 'react'
import './App.css'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { figmaTokenKey, filesKey } from './constants'
import { parseFileLink } from './parseFileLink'
import { useFiles } from 'hooks/useFiles'

export default function App() {
  return (
    <div className="App">
      <Token />
      <Files />
    </div>
  )
}

function Token(props) {
  const [token, setToken] = useLocalStorage(figmaTokenKey, null)
  const handleChange = (e) => setToken(e.target.value)
  return (
    <input
      type="text"
      value={token}
      onChange={handleChange}
      style={{ width: 320 }}
    />
  )
}

function Files(props) {
  const { files, addFile } = useFiles(filesKey, null)
  const handleChange = (e) => setValue(e.target.value)
  const [value, setValue] = useState('')
  return (
    <>
      <div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          style={{ width: 320 }}
        />
        <button
          onClick={() => {
            addFile(value)
            setValue('')
          }}
        >
          Add
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridColumnGap: 16,
          gridRowGap: 24,
          gridAutoFlow: 'column',
          gridTemplateColumns: 'auto',
        }}
      >
        {files.map((file) => (
          <File key={file.id + '_' + file.node} id={file.id} node={file.node} />
        ))}
      </div>
    </>
  )
}

function File({ id, node }) {
  const [token] = useLocalStorage(figmaTokenKey, null)
  const { removeFile } = useFiles(filesKey, null)
  const [data, setData] = useState(null)
  const [image, setImage] = useState(null)
  useEffect(() => {
    async function fetchData(params) {
      const url = node
        ? `https://api.figma.com/v1/files/${id}/nodes?ids=${encodeURIComponent(
            node
          )}`
        : `https://api.figma.com/v1/files/${id}`
      const data = await fetch(url, {
        headers: { 'X-FIGMA-TOKEN': token },
      }).then((d) => d.json())
      setData(data)
    }

    fetchData()
  }, [token, id, node])

  useEffect(() => {
    if (!node) return
    async function fetchData(params) {
      const url = `https://api.figma.com/v1/images/${id}?ids=${encodeURIComponent(
        node
      )}`

      const data = await fetch(url, {
        headers: { 'X-FIGMA-TOKEN': token },
      }).then((d) => d.json())

      const image = data?.images?.[node]
      console.log(data, image)
      setImage(image)
    }

    fetchData()
  }, [token, id, node])

  if (!data) return <p>{id}</p>

  const { thumbnailUrl, name, nodes } = data
  const thumb = image ? image : thumbnailUrl
  const nodeName = nodes?.[node]?.document?.name
  const bg = nodes?.[node]?.document?.backgroundColor
  const background = bg
    ? `rgba(${bg.r * 256}, ${bg.g * 256}, ${bg.b * 256}, ${bg.a})`
    : '#fff'
  return (
    <div
      style={{ maxWidth: 320, padding: 24, position: 'relative' }}
      onClick={() => console.log(data)}
    >
      <img
        src={thumb}
        style={{
          width: '100%',
          border: '1px solid rgba(0,0,0,.1)',
          borderRadius: 8,
          padding: 8,
          background,
        }}
      />
      <p>{nodeName ? `${nodeName} (${name})` : name}</p>
      <button onClick={() => removeFile(id, node)}>del</button>
    </div>
  )
}
