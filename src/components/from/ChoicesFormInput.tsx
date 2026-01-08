'use client'
import Choices, { type Options as ChoiceOption } from 'choices.js'
import { type HTMLAttributes, type ReactElement, useEffect, useRef } from 'react'

export type ChoiceProps = HTMLAttributes<HTMLInputElement> &
  HTMLAttributes<HTMLSelectElement> & {
    multiple?: boolean
    className?: string
    options?: Partial<ChoiceOption>
    onChange?: (text: string) => void
  } & (
    | {
        allowInput?: false
        children: ReactElement[]
      }
    | { allowInput?: true }
  )

const ChoicesFormInput = ({ children, multiple, className, onChange, allowInput, options, ...props }: ChoiceProps) => {
  const choicesRef = useRef<HTMLInputElement & HTMLSelectElement>(null)

  useEffect(() => {
    const ref = choicesRef.current
    if (ref) {
      const choices = new Choices(ref, {
        ...options,
        placeholder: true,
        allowHTML: true,
        shouldSort: false,
      })
      const handleChange = (e: Event) => {
        if (!(e.target instanceof HTMLSelectElement)) return
        if (onChange) {
          onChange(e.target.value)
        }
      }
      ref.addEventListener('change', handleChange)

      return () => {
        choices.destroy()
        ref.removeEventListener('change', handleChange)
      }
    }
  }, [onChange, options])

  return allowInput ? (
    <input ref={choicesRef} multiple={multiple} className={className} {...props} />
  ) : (
    <select ref={choicesRef} multiple={multiple} className={className} {...props}>
      {children}
    </select>
  )
}

export default ChoicesFormInput
