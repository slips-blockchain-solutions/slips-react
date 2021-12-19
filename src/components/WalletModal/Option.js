import React from 'react'
import styled from 'styled-components'
//import { a } from '../../theme'

const InfoCard = styled.button`
  background-color: gray;
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 12px;
  width: 100% !important;
  &:focus {
    box-shadow: 0 0 0 1px blue;
  }
  border-color: gray;
`

const OptionCard = styled(InfoCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard)`
  margin-top: 0;

`

const GreenCircle = styled.div`
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: green;
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: green;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  color: blue;
  font-size: 1rem;
  font-weight: 500;
`

const SubHeader = styled.div`
  color: white;
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div`
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: 24px;
    width: 24px;
  }
  align-items: flex-end;
`;

export default function Option({
  link = null,
  clickable = true,
  size = null,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false
}) {
  const content = (
    <OptionCardClickable onClick={onClick} clickable={clickable && !active} active={active}>
      <OptionCardLeft>
        <HeaderText color={color}>
          {' '}
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          {header}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
      <IconWrapper size={size} active={active}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <a href={link}>{content}</a>
  }

  return content
}
