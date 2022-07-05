import React from "react";
import { BsSearch } from "react-icons/bs";
import styled from "styled-components";
import { ChatsSubHeader } from "../../Chat/SideBars.styled";

const SearchBox = (props) => {
  const inputHandler = (e) => {
    props.setSearchName(e.target.value);
  };

  return (
    <Container showSearchBox={props.showSearchBox}>
      <Content>
        <InputGroup>
          <div>
            <input
              type="text"
              placeholder="Search..."
              onChange={inputHandler}
            ></input>
            <div>
              <div>
                <BsSearch />
              </div>
            </div>
          </div>
        </InputGroup>
      </Content>
    </Container>
  );
};

export default SearchBox;

const Container = styled.div`
  display: flex;
  background-color: #323333;
  padding: 0 1.5rem;
  border-bottom: 1px solid #2b2b2b;
  width: 100%;
  animation: ${({ showSearchBox }) => (showSearchBox ? "show" : "close")} 0.5s;
  height: ${({ showSearchBox }) => (showSearchBox ? "69px" : "0px")};
  overflow: hidden;

  @keyframes show {
    from {
      height: 0;
    }
    to {
      height: 69px;
    }
  }

  @keyframes close {
    from {
      height: 69px;
    }
    to {
      height: 0;
    }
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  width: 100%;
  animation: show 0.75s ease-in-out;

  @keyframes show {
    from {
      height: 0;
    }
    to {
      height: 69px;
    }
  }
`;

const InputGroup = styled(ChatsSubHeader)`
  width: 100%;
  & > div:last-child {
    width: 100% !important;
    input {
      width: 100%;
    }
  }
  & > div {
    width: 100%;
  }
`;
