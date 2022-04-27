import styled from 'styled-components';

export const SideBar = styled.div`
   height: 100%;
   width: 100%;
   background-color: #2a2a2a;

   @media (max-width: 1200px) {
      display: none;
   }
`;

export const ContactsContent = styled.div`
   display: flex;
   flex-direction: column;
`;

export const ChatsHeader = styled.div`
   background: #383f44;
   border-color: #2b2b2f;
   padding: 0.75rem;
`;

export const HeaderContent = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 445px;
   height: 45px;

   h5 {
      color: #fff;
      margin: 0;
      font-size: 1.09375rem;
      font-weight: 600;
   }

   ul {
      margin: 0;
      padding: 0;
      list-style: none;
      width: 76.5px;
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;

      li {
         width: 100%;
         margin-top: 10px;
         margin-left: 10px;
         font-size: 20px;

         svg {
            & > path {
               color: #adb5bd;
            }
            &:hover > path {
               color: #495057;
            }
         }
      }
   }
`;

export const ChatsSubHeader = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   cursor: pointer;
   padding: 0.25rem 0;
   height: 51px;

   & > div:first-child {
      position: relative;
      height: 42px;
      width: 127px;
      display: ${props => props.display};

      button {
         background: #2a2a2a;
         border-color: #2a2a2a;
         color: #adb5bd;
         cursor: pointer;
         font-size: .875rem;
         display: inline-block;
         font-weight: 400;
         border: transparent;
         padding: 0.4375rem 1.25rem;
         line-height: 1.5;
         border-radius: 0.25rem;
         transition: all .15s ease-in-out;

         &:after {
            display: inline-block;
            content: "";
            margin-left: 0.355em;
            vertical-align: 0.255em;
            border-top: 0.3em solid;
            border-right: 0.3em solid transparent;
            border-bottom: 0;
            border-left: 0.3em solid transparent;
         }
      }

      &:hover button {
         background: #495057;
      }
   }

   & > div:last-child {
      display: flex;
      width: ${props => props.display === "none" ? "100%" : "311px"};
      height: 40px;
      input {
         width: 90%;
         background-color: #2a2a2a;
         font-size: .875rem;
         color: #495057;
         padding: 0.375rem 0 0.375rem 0.75rem;
         outline: none;
         font-weight: 400;
         line-height: 1.5;
         border: 1px solid transparent;
         border-radius: 0.25rem;
         transition: all .15s ease-in-out;
         border-top-right-radius: 0;
         border-bottom-right-radius: 0;

         &:focus {
            color: #fff;
         }

         &::placeholder {
            color: #adb5bd
         }
      }

      div {
         height: 100%;

         div {
            background-color: #2a2a2a;
            border-radius: 0.25rem;
            display: flex;
            align-items: center;
            padding: 0.375rem 0.75rem;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            svg {
               font-size: 15px;
               path {
                  color: #adb5bd;
               }
            }
         }
      }
   }
`;

export const ChatsList = styled.ul`
   list-style: none;
   padding: .75rem;
   margin: 0;
   margin-bottom: 1rem;
   background-color: #2a2a2a;
   height: 100%;
   color: #ABD5BD;
`;
