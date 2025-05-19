import { Container, Row, Col, Modal } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./Blog.module.css";
import { FaCalendar, FaUser, FaTag } from "react-icons/fa";
import slide1 from "../../assets/images/slid2.jpg";
import slide2 from "../../assets/images/slid1.jpg";
import slide3 from "../../assets/images/slid3.jpg";
import slide4 from "../../assets/images/slid4.jpg";
import { Helmet } from "react-helmet";
import { useContext, useEffect, useState } from "react";
import BlogsContext from "../../shop/BlogsContext";
import truncateText from "./../Common/truncateText";
import BreadCrumb from "../Common/BreadCrumb";

export default function Blog() {
  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "BLog", link: "/blog" },
  ];
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { blogsList, isLoading, fetchBlogs } = useContext(BlogsContext);
  useEffect(() => {
    fetchBlogs();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  // Temporary static posts
  const staticPosts = [
    {
      id: 1,
      title: "Understanding Common Skin Conditions",
      excerpt:
        "Learn about the most frequent skin conditions and their treatments...",
      image: slide1,
      date: "2024-03-15",
      author: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      title: "Essential Vitamins for Your Health",
      excerpt:
        "Discover the key vitamins your body needs for optimal health...",
      image: slide2,
      date: "2024-03-14",
      author: "Dr. Michael Chen",
    },
    {
      id: 3,
      title: "Mental Health and Wellness",
      excerpt: "Tips and strategies for maintaining good mental health...",
      image: slide3,
      date: "2024-03-13",
      author: "Dr. Emily Brown",
    },
    {
      id: 4,
      title: "Healthy Heart Guidelines",
      excerpt: "Important guidelines for maintaining a healthy heart...",
      image: slide4,
      date: "2024-03-12",
      author: "Dr. James Wilson",
    },
  ];

  const handleShowArticle = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <>
              <BreadCrumb breadCrumbData={breadCrumbData} />

    <Container className={styles.blogContainer}>
      <Helmet>
        <title>Health Blog | Care+ Latest Updates</title>
      </Helmet>


      <section className={styles.heroSection}>
        <Slider {...settings}>
          {staticPosts.map((post) => (
            <div key={post.id} className={styles.slideWrapper}>
              <img src={post.image} alt={post.title} />
              <div className={styles.slideContent}>
                <h2 className="text-white">{post.title}</h2>
                <p className="text-white">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <Container className={styles.featuredSection}>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center mb-5">
            <h2 className={styles.sectionTitle}>Latest Health Insights</h2>
            <div className={styles.titleUnderline}></div>
          </Col>
        </Row>

        <Row>
          {blogsList.length > 0 && (
            <Col lg={6}>
              <div className={styles.mainArticle}>
                <img src={blogsList[0].image.path} alt={blogsList[0].title} />
                <div className={styles.articleContent}>
                  <div
                    className={`${styles.articleMeta} d-flex justify-content-between`}
                  >
                    <div>
                      <p>
                        <span>
                          <FaCalendar /> Created At:
                          {new Date(blogsList[0].createdAt)
                            .toISOString()
                            .slice(0, 10)}
                        </span>
                      </p>
                      <p>
                        <span>
                          <FaCalendar /> Updated At:{" "}
                          {new Date(blogsList[0].updatedAt)
                            .toISOString()
                            .slice(0, 10)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span>
                        <FaUser /> {blogsList[0].author}
                      </span>
                    </div>
                  </div>
                  <h3>{blogsList[0].title}</h3>
                  <p>{truncateText(blogsList[0].excerpt, 100)}</p>
                  <button
                    className={styles.readMoreBtn}
                    onClick={() => handleShowArticle(blogsList[0])}
                  >
                    Read Full Article <FaTag className="ms-2" />
                  </button>
                </div>
              </div>
            </Col>
          )}

          {blogsList.length > 0 && <Col lg={6}>
            <div className={styles.relatedArticles}>
              {blogsList.slice(1, blogsList.length).map((post) => (
                <div
                  key={post._id}
                  className={styles.relatedArticle}
                  onClick={() => handleShowArticle(post)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={post.image.path} alt={post.title} />
                  <div className={styles.relatedContent}>
                    <h4>{post.title}</h4>
                    <div className={styles.articleMeta}>
                      <span>
                        <FaCalendar /> Created at: {new Date(post.createdAt).toISOString().slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>}
        </Row>
      </Container>

      {/* Article Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className={styles.articleModal}
      >
        {selectedPost && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className={styles.modalTitle}>
                {selectedPost.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className={styles.modalContent}>
                <div className="text-center">
                  <img
                    src={selectedPost.image.path}
                    alt={selectedPost.title}
                    className={styles.modalImage}
                  />
                </div>
                <div className={`d-flex justify-content-between ${styles.modalMeta} my-3`}>
                  <p>

                  <span className="mx-3">
                    <FaCalendar /> Created At: {new Date(selectedPost.createdAt).toISOString().slice(0, 10)}
                  </span>
                  <span>
                    <FaCalendar /> Updated At: {new Date(selectedPost.updatedAt).toISOString().slice(0, 10)}
                  </span>
                  </p>
                  <span>
                    <FaUser /> {selectedPost.author}
                  </span>
                </div>
                <div className={styles.modalText}>
                  <p>{selectedPost.excerpt}</p>
                  
                </div>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
    </>
  );
}
