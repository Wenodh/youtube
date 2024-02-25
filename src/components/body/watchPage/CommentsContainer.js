import React from "react";
import { FaUser } from "react-icons/fa";

const commentsData = [
  {
    id: "sdvc",
    name: "Wenodh",
    text: "Hi Nice Video",
    replies: [
      {
        id: "jsdvcjd",
        name: "Wenodh",
        text: "sdgfhsavcdv dsacvbjdvc",
        replies: [
          {
            id: "hdsvchd",
            name: "User123",
            text: "This is a great video!",
            replies: []
          },
          {
            id: "fdshfdsk",
            name: "User456",
            text: "I learned a lot from this, thank you!",
            replies: [
              {
                id: "gfhfdhdf",
                name: "Wenodh",
                text: "You're welcome! Feel free to ask any questions.",
                replies: []
              },
              {
                id: "kjdfgkj",
                name: "User789",
                text: "Can you make a video on topic ABC?",
                replies: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "hdfvdf",
    name: "User789",
    text: "Awesome content!",
    replies: [
      {
        id: "dfhdfhd",
        name: "Wenodh",
        text: "Thank you for your feedback!",
        replies: [
          {
            id: "sjdksdj",
            name: "User101112",
            text: "I would love to see more videos like this.",
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: "fdshfdsh",
    name: "Wenodh",
    text: "Thank you for your feedback!",
    replies: [
      {
        id: "dfshfds",
        name: "User101112",
        text: "Can you make a video on topic XYZ?",
        replies: [
          {
            id: "gdfhgdh",
            name: "Wenodh",
            text: "Sure! I'll consider making a video on that topic.",
            replies: [
              {
                id: "kdfgkdf",
                name: "User131415",
                text: "Looking forward to it!",
                replies: []
              }
            ]
          }
        ]
      },
      {
        id: "fdshfhds",
        name: "User161718",
        text: "I shared this video with my friends, they loved it!",
        replies: []
      }
    ]
  },
  {
    id: "kdfhdfh",
    name: "User192021",
    text: "Could you explain the second part in more detail?",
    replies: []
  }
];


const Comment = ({ data }) => {
  const { name, text, replies } = data;
  return (
    <div className="p-2 ">
      <div className="flex bg-slate-100 p-2 rounded-md">
        <div className="mt-2 flex h-9 w-9 items-center justify-center rounded-full border border-black">
          <FaUser />
        </div>
        <ul className="px-3">
          <li className="font-semibold">{name}</li>
          <li className="font-normal text-sm">{text}</li>
          <li className="flex gap-2">
            <button className="">👍</button>
            <button className="">👎</button>
            <button className="">Reply</button>
          </li>
        </ul>
      </div>
      {replies.map((reply) => (
        <div key={reply.id} className="ml-2 border-l pl-2 ">
          <Comment data={reply} />
        </div>
      ))}
    </div>
  );
};
const CommentsList = ({ comments }) => {
  return (
    <div>
      {comments?.map((comment) => (
        <Comment key={comment.id} data={comment} />
      ))}
    </div>
  );
};
const CommentsContainer = () => {
  return (
    <div className="m-5 p-2 ">
      <h1 className="text-2xl font-bold">Comments:</h1>
      <CommentsList comments={commentsData} />
    </div>
  );
};

export default CommentsContainer;
