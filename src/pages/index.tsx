import { GetStaticProps } from 'next';
import Link from 'next/link'

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import {FiCalendar, FiUser} from 'react-icons/fi';

import {format} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useEffect, useState } from 'react';

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




export default function Home({postsPagination}: HomeProps) {
  // const [listPost,setListPost] = useState<Post[]>([])
  const [pagination, setPagination] = useState<PostPagination>(postsPagination)
  useEffect(()=>{
    setPagination(postsPagination)
  },[])


  function HandleLoadMore(next_page: string) {
    fetch(next_page)
      .then(response => response.json())
      .then(data => {
        const posts = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'dd MMM yyyy',
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              // title: RichText.asText(post.data.title),
              subtitle: post.data.subtitle,
              // subtitle: RichText.asText(post.data.subtitle),
              author: post.data.author,
              // author: RichText.asText(post.data.author),
            },
          };
        });

        const updatedPosts = [...pagination.results, ...posts]
        setPagination({
          next_page: data.next_page,
          results: updatedPosts});
      });
  }




  return (
    <>
      <main className={styles.homeContainer}>
        <div className={styles.homePosts}>
          {pagination.results.map(post => {
            return (
              <Link key={post.uid}  href={`/post/${post.uid}`}>
                <a>
                  <span>{post.data.title}</span>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.homePostInfo}>
                    <FiCalendar /> <time> {post.first_publication_date} </time>
                    <FiUser /> <span> {post.data.author}</span>
                  </div>
                </a>
              </Link>
            );
          })}
          
          
        </div>

       { pagination.next_page && <a href='#' onClick={() => HandleLoadMore(pagination.next_page)} className={styles.homeLoadMore}>Carregar mais posts</a> }
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type','posts')
  ],{
    fetch:['posts.title','posts.subtitle','posts.author'],
    pageSize:2
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date), 'dd MMM yyyy',
       {
         locale:ptBR
       }
      ),
      data: {
        title: post.data.title,
        // title: RichText.asText(post.data.title),
        subtitle: post.data.subtitle,
        // subtitle: RichText.asText(post.data.subtitle),
        author: post.data.author,
        // author: RichText.asText(post.data.author),
      },
    };
  });

console.log(postsResponse.next_page,posts)
  //postsPagination
  return {
    props: {
      postsPagination:{
        next_page:postsResponse.next_page,
        results:posts
      }
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}
