import styled from 'styled-components';

export const InputForm = styled.form`
   display: flex;
   background: #323333;
   padding: 0.75rem 2.25rem;
   border-top: 1px solid #2b2b2f;

   // check here
   width: calc(100vw - 4.375rem - 472px);
   position: fixed;
   bottom: 0;
   height: 89px;
   min-height: 4vh;
   @media (max-width: 1200px) {
      width: 100%;
   }

   input {
      width: 100%;
      height: 100%;
      padding: 6px 12px;
      background: #2a2a2a;
      color: #fff;
      border: none;
      font-size: 1.175rem;
      outline: none;
   }
   
   button {
      cursor: pointer;
      width: 5rem;
      outline: none;
      border: none;
      padding: .1rem;
      margin-left: .5rem;
      border-radius: 4px;
      transition: background 0.23s;
      background-color: #665dfe;

      &:hover {
         background: #4237fe;
      }
      svg {
         font-size: 1.5rem;
         color: #fff;
      }
   }
`;
