import styled from "styled-components";

const Error = ({ error, onClearErr }) => {
  const clickHandler = () => {
    onClearErr(true);
  };

  return (
    <Wrapper>
      <Card>
        <Button>
          <i>
            <span></span>
            <span></span>
          </i>
        </Button>
        <ErrorMessage>
          <h3>Opps...</h3>
          <p>{error}</p>
        </ErrorMessage>
        <button className="button" onClick={clickHandler}>
          Ok
        </button>
      </Card>
    </Wrapper>
  );
};

export default Error;

const Wrapper = styled.div`
  background-color: #ffffff70;
  display: grid;
  width: 100vw;
  height: 100vh;
  position: fixed;
  place-items: center;
  font-size: 0.9rem;
  top: 0;
  left: 0;
  z-index: 100;
  transition: ease-in-out 0.2s;
`;

const Card = styled.div`
  background-color: #ffffff;
  width: 350px;
  height: 250px;
  position: relative;
  box-shadow: 0 0 1rem #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  .button {
    display: inline-block;
    color: #fff;
    background-color: #2f80ed;
    border-style: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 15px;
    letter-spacing: normal;
    width: 76px;
    height: 30px;
    transition: all 0.3s;
    position: relative;
    text-align: center;
    text-decoration: none;
    margin-top: 20px;
    outline: none;

    &:hover {
      background-color: #1366d6;
    }
  }
`;

const Button = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  i {
    display: block;
    font-size: 18px;
    width: 56px;
    height: 56px;
    border: 2px solid red;
    border-radius: 50%;
    cursor: pointer;
    position: relative;

    span {
      width: 27px;
      height: 3px;
      background-color: red;
      display: block;
      position: absolute;
      transition: all 0.5s ease 0s;

      &:first-child {
        top: 24px;
        left: 12px;
        transform: rotate(45deg);
      }

      &:last-child {
        position: absolute;
        top: 24px;
        left: 12px;
        transform: rotate(-45deg);
      }
    }
  }
`;

const ErrorMessage = styled.div`
  width: 100%;

  h3 {
    font-weight: 600;
    width: 100%;
    margin: 0;
  }
`;
