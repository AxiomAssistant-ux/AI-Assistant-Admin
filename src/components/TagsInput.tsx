'use client'

import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import { Form, FormControl, FormLabel, Badge } from 'react-bootstrap'

interface TagsInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
  isInvalid?: boolean
  errorMessage?: string
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onChange,
  placeholder = 'Type and press Enter to add tags',
  label = 'Tags',
  isInvalid,
  errorMessage
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const trimmedValue = inputValue.trim()

      // Don't add duplicate tags
      if (!tags.includes(trimmedValue)) {
        onChange([...tags, trimmedValue])
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      onChange(tags.slice(0, -1))
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleRemoveTag = (e: React.MouseEvent, tagToRemove: string) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div>
      {label && <FormLabel>{label}</FormLabel>}

      <div
        className={`border rounded p-2 ${isInvalid ? 'border-danger' : ''}`}
        style={{ minHeight: '38px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
      >
        {tags.map((tag) => (
          <Badge
            key={tag}
            bg="primary"
            className="d-flex align-items-center gap-1"
            style={{ fontSize: '0.875rem', padding: '0.375rem 0.5rem' }}
          >
            {tag}
            <button
              type="button"
              className="btn-close btn-close-white"
              style={{ fontSize: '0.6rem', padding: '0.2rem' }}
              onClick={(e) => handleRemoveTag(e, tag)}
              title="Remove tag"
              aria-label="Remove tag"
            />
          </Badge>
        ))}
        <FormControl
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="border-0 p-0 flex-grow-1"
          style={{ minWidth: '120px', outline: 'none', boxShadow: 'none' }}
          isInvalid={isInvalid}
        />
      </div>

      {isInvalid && errorMessage && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {errorMessage}
        </Form.Control.Feedback>
      )}

      <Form.Text className="text-muted">
        {tags.length === 0 ? 'Press Enter to add tags (optional)' : `${tags.length} tag${tags.length !== 1 ? 's' : ''} added`}
      </Form.Text>
    </div>
  )
}

export default TagsInput

