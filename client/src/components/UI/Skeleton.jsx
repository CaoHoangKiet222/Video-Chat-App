import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Avatar,
  ChatContent,
  ChatInfo,
  ChatItem,
  ChatText,
} from "../Chat/ChatItems.styled";

const SkeletonComponent = () => {
  return (
    <>
      {Array(2)
        .fill()
        .map((_, index) => {
          return (
            <ChatItem key={index}>
              <div>
                <Avatar isSkeleton={true}>
                  <Skeleton
                    circle={true}
                    height={`100%`}
                    width={`100%`}
                    duration={1}
                    highlightColor="#4b4b6050"
                  />
                </Avatar>
                <ChatContent>
                  <ChatInfo>
                    <h6>
                      <Skeleton
                        height={30}
                        width={245}
                        duration={2}
                        highlightColor="#4b4b6050"
                      />
                    </h6>
                    <div>
                      <Skeleton
                        height={30}
                        width={85}
                        duration={1}
                        highlightColor="#4b4b6050"
                      />
                    </div>
                  </ChatInfo>
                  <ChatText>
                    <p>
                      <Skeleton
                        height={25}
                        width={345}
                        duration={1}
                        highlightColor="#4b4b6050"
                      />
                    </p>
                  </ChatText>
                </ChatContent>
              </div>
            </ChatItem>
          );
        })}
    </>
    // };
  );
};

export default SkeletonComponent;
