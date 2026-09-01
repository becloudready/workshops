import { SearchBoxWrapper, SearchIcon, SearchInput, ClearButton } from './SearchBox.styled'

function SearchBox({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel?: string
}) {
  return (
    <SearchBoxWrapper>
      <SearchIcon viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path
          d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zm-.63 3.578a4.5 4.5 0 1 1 .708-.707l2.775 2.775a.5.5 0 1 1-.707.707L9.37 10.078z"
          fill="currentColor"
        />
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <ClearButton type="button" aria-label="Clear search" onClick={() => onChange('')}>
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </ClearButton>
      )}
    </SearchBoxWrapper>
  )
}

export default SearchBox
