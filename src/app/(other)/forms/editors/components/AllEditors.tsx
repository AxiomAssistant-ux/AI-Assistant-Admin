'use client'
import React from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

let valueBubble = ''
let valueSnow = ''
valueSnow = valueBubble = `<h3><span class="ql-size-large">Hello World!</span></h3>
    <p><br/></p>
    <h3>This is a simple editable area.</h3>
    <p><br/></p>
    <ul>
      <li>Select a text to reveal the toolbar.</li>
      <li>Edit rich document on-the-fly, so elastic!</li>
    </ul>
<p><br/></p>
<p>End of simple area</p>`

const SnowEditor = () => {
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'super' }, { script: 'sub' }],
      [{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['direction', { align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }
  return (
    <>
      <Card style={{ height: '481px' }}>
        <CardHeader>
          <CardTitle as={'h5'}>Snow Editor</CardTitle>
          <p className="card-subtitle">
            Use <code>snow-editor</code> id to set snow editor.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <ReactQuill id="snow-editor" style={{ height: 300 }} modules={modules} defaultValue={valueSnow} theme="snow" />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const BubbleEditor = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Bubble Editor</CardTitle>
          <p className="card-subtitle">
            Use <code>bubble-editor</code> id to set bubble editor.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <ReactQuill id="bubble-editor" defaultValue={valueBubble} theme="bubble" style={{ height: 300 }} />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const AllEditors = () => {
  return (
    <>
      <SnowEditor />
      <BubbleEditor />
    </>
  )
}

export default AllEditors
