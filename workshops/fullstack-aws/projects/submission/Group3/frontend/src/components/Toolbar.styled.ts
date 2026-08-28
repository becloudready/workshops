import styled from 'styled-components'

export const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`
