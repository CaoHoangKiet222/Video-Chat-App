import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
`;

export const MainLayout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 77px 472px auto;

  @media (max-width: 1200px) {
    grid-template-columns: auto;
  }
`;

export const DefaultUser = styled.div`
  height: 100vh;
  background-color: #323333;

  .user {
    text-align: center;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
      max-width: 1320px;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;

      .avatar {
        height: 5rem;
        width: 5rem;
        min-width: 5rem;
        display: inline-block;
        position: relative;
        border-radius: 50%;
        margin-bottom: 0.95rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      h5 {
        color: #fff;
        font-size: 1.09375rem;
        margin: 0 0 16px;
      }

      p {
        margin: 0 0 16px;
        color: #f8f9fa;
        font-size: 0.875rem;
      }

      button {
        color: #fff;
        background-color: #665dfe;
        border-color: #665dfe;
        cursor: pointer;
        font-size: 0.875rem;
        display: inline-block;
        font-weight: 400;
        border: 1px solid transparent;
        padding: 0.4375rem 1.25rem;
        outline: none;
        line-height: 1.5;
        border-radius: 0.25rem;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
          border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:hover {
          background-color: #4237fe;
        }
      }
    }
  }
`;
