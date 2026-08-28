import { FilterGroup, FilterButton } from './FilterTabs.styled'

function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}) {
  return (
    <FilterGroup role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          type="button"
          $active={value === option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </FilterGroup>
  )
}

export default FilterTabs
