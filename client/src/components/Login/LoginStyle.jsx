import styled from 'styled-components';
import {LoadingSpinner} from '../UI/Loading';

export const Container = styled.div`
   display: flex;
   background: url("/images/background-login.jpg") top left repeat;
   background-size: cover;
   position: relative;
   top: 0;
   bottom: 0;
   width: 100%;
   justify-content: center;
   align-items: center;
   text-align: center;
   padding: 30px 0;
   min-height: 100vh;
   z-index: 999;
`;

export const Content = styled.div`
   max-width: 1320px;
   width: 100%;
   padding-right: .75rem;
   padding-left: .75rem;
   height: 100vh;
   margin-right: auto;
   margin-left: auto;
`;

export const FormContainer = styled.div`
   height: 100%;
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`;

export const FormSection = styled.div`
   max-width: 550px;
   margin: 0 auto;
   padding: 70px 50px;
   background: #fff;
   border-radius: 5px;
   box-shadow: 0px 10px 13px -7px #000000, 0px 2px 36px 5px #000000;
   z-index: 999;
   
   p {
      margin: 0;
      margin-top: 20px;
      display: inline-block;
      font-size: 16px;

      a {
         margin-left: 4px;
         font-weight: 600;
         font-size: 16px;
         color: #535353;
         text-decoration: none;
      }
   }
`;
export const Logo = styled.div`
   width: 450px;
   height: 50px;

   img {
      width: 30%;
      margin-bottom: 20px;
      height: 40px;
   }
`;

export const MainTitle = styled.div`
   h3 {
      width: 450px;
      height: 30px;
      margin: 0 0 30px;
      font-weight: 300;
      font-size: 25px;
      color: #313131;
      font-family: 'Jost', sans-serif;

      span:last-child {
         color: #01c5ff;
         font-weight: 400;
         height: 30px;
      }
   }
`;
export const Form = styled.form`
   width: 450px;
   height: ${props => props.isSignup ? "455px" : "370px"}
`;

export const FormGroup = styled.div`
   margin-bottom: 25px;

   input {
      width: 100%;
      height: 50px;
      border-radius: 3px;
      color: #404040;
      letter-spacing: 0.9px;
      padding: 12px 20px;
      outline: none;
      line-height: 1.5;
      font-weight: 400;
      background: #E8E8E8;
      border: none;

      &::placeholder{
         color: #6c757d;
      }
   }
`;

export const CheckBox = styled.div`
   display: flex;
   margin-bottom: 20px;
   justify-content: space-between;

   a {
      font-size: 16px;
      color: #535353;
      margin-top: 3px;
      text-decoration: none;
      font-weight: bold;
   }
`;

export const FormCheck = styled.div`
   min-height: 1.5em;
   margin-bottom: 0.125rem;

   input {
      width: 20px;
      height: 18px;
      filter: hue-rotate(60deg);
   }

   label {
      margin-left: 3px;
   }
`;

export const LoginButton = styled.div`
   width: 450px;
   height: 54px;
   background: #01c5FF;
   border-radius: 3px;
   position: relative;
   left: 0;
   top: 0;
   right: 0;
   z-index: 99;

   button {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: transparent;
      padding: 0 50px;
      line-height: 46px;
      border: 2px solid transparent;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      transition: all .7s ease;
      font-size: 17px;
      z-index: 1;
   }

   &:before,
   &:after {
      height: 50px;
      position: absolute;
      top: 0;
      content: '';
      width: 0px;
      visibility: hidden;
      border: 2px solid #01c5FF;
      background: #01c5FF;
      transition: all .7s ease;
      border-radius: 3px;
      opacity: 0;
      z-index: 0;
   }

   &:before {
      left: 0;
   }

   &:after {
      right: 0;
   }

   &:hover:after {
      visibility: visible;
      background: #ffffff;
      width: calc(100% - 4px);
      opacity: 1;
   }
   
   &:hover button {
      color: #01c5FF;
   }

   &:hover {
      ${LoadingSpinner} {
         &:after {
            border: 5px solid #01c5FF;
            border-color: #01c5FF transparent #01c5FF transparent;
         }
         z-index: 2;
      }
   }

   &:hover:before {
      visibility: visible;
      background: #ffffff;
      width: calc(100% - 4px);
      opacity: 1;
   }
`;

export const ExtraLogin = styled.div`
   width: 100%;
   margin: 25px 0 25px;
   position: relative;
   
   span {
      padding: 1px 20px;
      position: relative;
      font-size: 15px;
      background-color: #ffffff;
   }

   &:before {
      position: absolute;
      content: '';
      left: 0;
      top: 10px;
      width: 100%;
      height: 1px;
      background: #d8dcdc;
      z-index: -1;
   }
`;

export const SocialList = styled.ul`
   list-style: none;
   padding: 0;
   margin: 0 0 20px;
   display: block;
   width: 450px;
   height: 50px;
`;

export const List = styled.li`
   display: inline-block;
   margin: 0 3.5px;
   position: relative;

   a {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      width: 130px;
      height: 40px;
      margin: 2px 0 3px 0;
      line-height: 40px;
      border-radius: 20px;
      text-decoration: none;
      background-color: #fff;
      box-shadow: 0 0 5px rgb(0 0 0 / 20%);
      font-family: 'Jost', sans-serif;
      color: ${props => props.isFb ? "#4867aa" : props.isTwitter ? "#33CCFF" : props.isGoogle && "#DB4437"};

      svg {
            width: 20px;
            height: 20px;
            position: absolute;
            left: 12px;
            top: 12px;
            background-color: #fff;
      }

      span {
         margin-right: -15px;
         height: 20px;
      }
   }
`;
