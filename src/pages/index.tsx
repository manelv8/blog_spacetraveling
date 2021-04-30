import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import {FiCalendar, FiUser} from 'react-icons/fi';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <main className={styles.homeContainer}>
        <div className={styles.homePosts}>
          <a href="#">
            <span>como criar hooks</span>
            <p>
              Lorem ipsum dolor sit Facilis commodi perferendis ea ex voluptatem
              mollitia et, hic mo?
            </p>
            <div className={styles.homePostInfo}>
              <FiCalendar /> <time> 29 mar 2021 </time>
              <FiUser /> <span> davi linhares</span>
            </div>
          </a>
          <a href="#">
            <span>como criar hooks</span>
            <p>
              Lorem ipsum dolor sit Facilis commodi perferendis ea ex voluptatem
              mollitia et, hic mo?
            </p>
            <div className={styles.homePostInfo}>
              <FiCalendar /> <time> 29 mar 2021 </time>
              <FiUser /> <span> davi linhares</span>
            </div>
          </a>
          <a href="#">
            <span>como criar hooks</span>
            <p>
              Lorem ipsum dolor sit Facilis commodi perferendis ea ex voluptatem
              mollitia et, hic mo?
            </p>
            <div className={styles.homePostInfo}>
              <FiCalendar /> <time> 29 mar 2021 </time>
              <FiUser /> <span> davi linhares</span>
            </div>
          </a>
        </div>
        <a href="#" className={styles.homeLoadMore}>Carregar mais posts</a>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
