import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faEmail } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const SocialShare = ({ url, title }) => {
  const socialMediaLinks = [
    {
      name: 'Facebook',
      icon: faFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      name: 'Twitter',
      icon: faTwitter,
      url: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    },
    {
      name: 'LinkedIn',
      icon: faLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    },
    {
      name: 'Email',
      icon: faEmail,
      url: `mailto:?subject=${title}&body=${url}`,
    },
  ];

  return (
    <div className="d-flex justify-content-center mb-3">
      <ul className="list-inline">
        {socialMediaLinks.map((link, index) => (
          <li key={index} className="list-inline-item">
            <Link
              to={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              className="text-decoration-none"
            >
              <FontAwesomeIcon icon={link.icon} size="lg" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialShare;