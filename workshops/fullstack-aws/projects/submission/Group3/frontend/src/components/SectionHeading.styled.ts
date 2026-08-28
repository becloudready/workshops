import styled from 'styled-components'

export const SectionEyebrow = styled.p`
  margin: 0 0 12px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const SectionHeading = styled.h2`
  margin: 0;
  font-size: 28px;
  line-height: 1.3;
  color: var(--text-h);

  @media (max-width: 640px) {
    font-size: 24px;
  }
`
