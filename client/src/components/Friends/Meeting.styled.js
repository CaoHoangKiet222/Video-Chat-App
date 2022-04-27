import styled from 'styled-components';

export const Container = styled.div`
   height: 100%;
   width: 100%;
   background: #323333;
`;

export const Content = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 100%;
   margin: 0 auto;
   padding: 0 15px;
   max-width: 1320px;
   justify-content: center;
   align-items: center;
`;

export const Join = styled.div`
   width: 460px;
   max-width: calc(100% - 80px);
   border: 1px solid #ccc;
   padding: 20px;
   background: #fff;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   & > img {
      width: 140px;
      height: 140px;
      margin-bottom: -30px;
   }
   p {
      &.name {
         font-size: 20px;
         font-weight: 700;
         text-transform: uppercase;
         margin-bottom: 0;
         margin-top: 20px;
      }
      &.title {
         margin-bottom: 0;
         margin-top: 8px;
         font-size: 17px;
      }
   }
`;

export const Picture = styled.div`
   left: auto;
   transform: none;
   width: 150px;
   cursor: pointer;
   margin: 10px 0;
`;
export const ImgWrapper = styled.div`
   width: 150px;
   height: 150px;
   border-radius: 75px;
   animation-name: ring;
   animation-duration: 2.8s;
   animation-iteration-count: infinite;
   animation-fill-mode: both;
   animation-timing-function: ease-out;
   box-sizing: border-box;

   & > div{
      display: flex;
      width: 100%;
      height: 100%;
      border-radius: 75px;
      justify-content: center;
      align-items: center;
      background: #666;
      color: #f7f7f8;
      font-size: 50px;
      border: 2px solid #665dfe;

      &:before {
         display: none;
      }
   }

   @keyframes ring {
    0% {
      width: 150px;
      height: 150px;
      border: 10px double #665dfe;
      padding: 4px; 
    }
    50% {
      width: 150px;
      height: 150px;
      border: 0 solid #ffffff;
      padding: 0; 
    }
    100% {
      width: 150px;
      height: 150px;
      border: 10px double #665dfe;
      padding: 4px; 
    } 
   }
`;

export const Buttons = styled.div`
   display: flex;
`;

export const RoundedButton = styled.div`
   width: 60px;
   height: 60px;
   background: #2A2A2A;
   border-radius: 30px;
   cursor: pointer;
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 8px;
&:hover {
   opacity: .9;
}

   svg {
      color: white;

   }
   &.close {
      background-color: #EF2916;
   }
   &.accept {
      background-color: #55d48b;
   }
`;
