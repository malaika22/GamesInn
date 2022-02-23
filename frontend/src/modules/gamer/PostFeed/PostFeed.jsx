import { React, useEffect, useContext } from "react";
import data from "./data";
import "./styles.scss";
import { Table, Card, Divider, Rate } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShippingFast } from "@fortawesome/free-solid-svg-icons";
import { GamerContext } from "../../../context/GamerContext";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
import { Loader } from "../../../components/Loader/Loader";
import EmptyScreen from "../../../components/EmptyScreen/EmptyScreen";

const PostFeed = () => {
  const { getAllAccounts, allAccounts, gamerLoading } =
    useContext(GamerContext);
  //Table

  // function getRatings() {
  //   for (let d of data) {
  //     // Get percentage
  //     const starPercentage = (d.rating / 5) * 100;
  //     // Round to nearest 10
  //     const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

  //     // Set width of stars-inner to percentage
  //     document.querySelector(
  //       `.post-${d.postId}.rating-stars-inner`
  //     ).style.width = starPercentageRounded;
  //   }
  // }

  // useEffect(() => {
  //   getRatings();
  // }, []);

  useEffect(() => {
    getAllAccounts();
  }, []);

  console.log("all accounts", allAccounts);
  const columns = [
    {
      title: "Offer Title",
      align: "center",
      width: "500px",
      render: (post) => (
        <Link to={`/gamer/post/${post._id}`}>{post?.title}</Link>
      ),
    },
    {
      title: "Rating",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.rating - b.rating,
      align: "center",
      render: (data) => {
        return (
          <div className="rating">
            {/* <img src={data.image} alt="UserDispalyImage" /> */}
            <Avatar icon={<UserOutlined />} size={64} />
            <div className="rating-right">
              <h3>{data?.username}</h3>
              {/* <div className="rating-stars-outer"> */}
              {/* <div className={`post-${data._id} rating-stars-inner`}> */}
              <Rate disabled defaultValue={Math.floor(Math.random() * 5) + 1} />
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        );
      },
    },
    {
      title: "Instant Delivery",
      dataIndex: "",
      align: "center",
      render: () => (
        <>
          <FontAwesomeIcon icon={faShippingFast} size="2x" />
          <h4>fast delivery</h4>
        </>
      ),
    },
    {
      title: "Price",
      // dataIndex: "price",
      align: "center",
      justify: "center",
      render: (data) => {
        console.log(data);
        return (
          <span>
            <h3>{`$ ${data?.cost}`}</h3>
            <Divider type="vertical" />
            <button>BUY NOW</button>
          </span>
        );
      },
      defaultSortOrder: "descend",
      sorter: (a, b) => a.price - b.price,
    },
  ];

  if (gamerLoading) {
    return <Loader />;
  } else if (!allAccounts?.length) {
    return <EmptyScreen title={"There's no accounts"} />;
  } else
    return (
      <div className="posts">
        <Table
          dataSource={allAccounts}
          columns={columns}
          pagination={{ pageSize: 5 }}
          bordered
          size="small"

          // scroll={{ x: "calc(700px + 50%)", y: 550 }}
        ></Table>
      </div>
    );
};

export default PostFeed;
