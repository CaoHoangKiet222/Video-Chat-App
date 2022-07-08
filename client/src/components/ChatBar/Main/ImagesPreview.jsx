import React from "react";
import styled from "styled-components";

const ImagesPreview = ({ url, isRight }) => {
  console.log(url);
  return (
    <FormImg isRight={isRight}>
      <div className="column">
        <div className="lightgallery_item">
          <img src={url} alt="" />
        </div>
      </div>
    </FormImg>
  );
};

export default ImagesPreview;

const FormImg = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: 7px;
  margin-left: -5px;
  max-width: 103px;
  max-height: 103px;

  div.column {
    padding: 5px;

    .lightgallery_item {
      cursor: pointer;

      img {
        max-width: 90px;
        max-height: 90px;
        min-height: 90px;
        border-radius: 10px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;
