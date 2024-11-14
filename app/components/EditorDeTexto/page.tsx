'use client'

import React, { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface QuillEditorProps {
  value: string
  onChange: (content: string) => void
}

export default function EditorDeTexto({ value, onChange }: QuillEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const modules = useMemo(() => {
    if (typeof window !== 'undefined') {
      return {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        imageResize: {
          parchment: null,
          modules: ['Resize', 'DisplaySize']
        }
      }
    }
    return {}
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('quill-image-resize-module-react').then((ImageResize) => {
        const Quill = require('quill')
        Quill.register('modules/imageResize', ImageResize.default)
        if (modules.imageResize) {
          modules.imageResize.parchment = Quill.import('parchment')
        }
      })
    }
  }, [modules])

  if (!isMounted) {
    return null // or a loading spinner
  }

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <div className="border border-input rounded-md overflow-hidden">
              <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
                theme="snow"
                placeholder="Escreva seu post aqui..."
                className="min-h-[200px] [&_.ql-editor]:min-h-[150px] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-input [&_.ql-container]:border-none"
              />
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="border border-input rounded-md p-4 min-h-[200px] prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: value }} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}