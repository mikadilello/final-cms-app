import Head from 'next/head';
import Layout from '../components/layout';
import { getAllIds, getData } from '../lib/data';
import { Box, } from '@chakra-ui/react';

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
  bigFont: {
    fontSize: 18,
  },
  biggerFont: {
    fontSize: 20,
  },
}

export async function getStaticProps({ params }) {
  const itemData = await getData(params.id);

  return {
    props: {
      itemData
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const paths = await getAllIds();
  return {
    paths,
    fallback: false
  };
}

export default function Entry({ itemData }) {
  return (
    <Layout>
      <div style={styles.content}>
      <div style={styles.infoTextContainer}>
      <article className="card col-6">
        <div className="card-body">
          <h2 className="card-title" p={2} style={styles.biggerFont}>{itemData.post_title}</h2>
          <h6 className="card-subtitle mb-2 text-muted" p={4} style={styles.bigFont}>By {itemData.user_login}</h6>
          <div className="card-text" dangerouslySetInnerHTML={{__html: itemData.post_content}} />
        </div>
      </article>
      </div>
      </div>
    </Layout>
  );
}