// import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <div>Home</div>
      {/* <div>
        <img
          src={currentUser.avatar}
          referrerPolicy="no-referrer"
          alt="profile"
        />
      </div> */}
    </div>
  );
}
