import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {FiCalendar, FiClock, FiUser} from 'react-icons/fi'
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}:PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const [readingTime,setReadingTime] = useState(0)
  useEffect(()=>{
    
    const content = post.data.content;
    
    const totalTime = content.reduce((acc,obj)=>{
       const bodyText = RichText.asText(obj.body)
      const textLength = bodyText.split(/\s/g).length
      const time = Math.ceil(textLength /200)
      return acc + time;
    },0)

    setReadingTime(totalTime)
    
    
  },[])
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.postBanner}>
          <img src={post.data.banner.url} />
        </div>

        <main className={styles.postContainer}>
          <div className={styles.postTitle}>{post.data.title}</div>

          <div className={styles.postInfo}>
            <FiCalendar />{' '}
            <time> {format(
      new Date(post.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    )} </time>
            <FiUser /> <span> {post.data.author}</span>
            <FiClock />
            <span> {readingTime} min </span>
          </div>

          <div className={styles.postContent}>
            {post.data.content.map(item => {
              return (
                <>
                  <h2> {item.heading} </h2>

                  <div dangerouslySetInnerHTML={{ __html: item.body[0] }} />
                </>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
    }
  );

  const paths = posts.results.map(post => {
    return{
      params: {
        slug: post.uid
      }
    }
  })
  return {
    paths,
    fallback: true
  };
};

export const getStaticProps = async ({params}) => {

  const { slug } = params
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts',String(slug),{})
  // console.log(JSON.stringify(response,null,2))
   

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    // first_publication_date_formatted: format(
    //   new Date(response.first_publication_date),
    //   'dd MMM yyyy',
    //   {
    //     locale: ptBR,
    //   }
    // ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [RichText.asText(content.body)],
        };
      }),
    },
  };

  console.log(JSON.stringify(post, null,2))
  return {
    props: {post}
  }
}



