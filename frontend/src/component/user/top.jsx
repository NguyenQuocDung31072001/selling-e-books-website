import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const IMAGE_URL = "http://localhost:5000/image_avatar/avatar_user.png";

function TopUser() {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [image, setImage] = useState();
  useEffect(() => {
    if (currentUser?.avatar_url) {
      setImage(currentUser.avatar_url);
    }
  }, [currentUser]);

  //currentUser.avatar_url
  return (
    <div className="w-full h-50px bg-orange-200 fixed top-0">
      <div className="flex justify-end">
        <Link to="/user/setting">
          <img
            className="h-[50px] w-[50px] object-cover cursor-pointer rounded-[50px]"
            src={image ? currentUser?.avatar_url : IMAGE_URL}
            alt=""
          />
        </Link>
      </div>
    </div>
  );
}

export default TopUser;
