import { Spin } from 'antd'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`

export default function Loading() {
  return (
    <Container>
      <Spin />
    </Container>
  )
}
