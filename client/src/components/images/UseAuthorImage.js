import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../login/OAuth';

const UseAuthorImages = (posts) => {
  const { serverUrl } = useContext(AuthContext);
  const [authorImages, setAuthorImages] = useState({});

  useEffect(() => {
    const fetchAuthorImages = async () => {
      const images = {};
      await Promise.all(posts.map(async (post) => {
        if (post.author_id) {
          try {
            const response = await axios.get(`${serverUrl}/match/chattingPersonal`, {
              params: { email: post.author_id }
            });
            // images[post.author_id] = `data:${response.data.imageType};base64,${response.data.imageBlob}`;
            images[post.author_id] = response.data.imageType;
          } catch (error) {
            console.error('Error fetching author image:', error);
            images[post.author_id] = null;
          }
        }
      }));
      setAuthorImages(images);
    };

    if (posts.length > 0) {
      fetchAuthorImages();
    }
  }, [posts, serverUrl]);

  return authorImages;
};

export default UseAuthorImages;
