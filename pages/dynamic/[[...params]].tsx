import type { GetStaticPaths, NextPage } from 'next'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

const revalidate = 300;
const formatStyle = 'MM/DD HH:mm:ss';

// The 0kb Next.js blog
// https://alistair.blog/zero-kb-nextjs-blog
export const config = { unstable_runtimeJS: false }

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['ssg'],
    fallback: 'blocking',
  }
}

export async function getStaticProps() {
  const currentTime = dayjs().tz();
  const createdAt = currentTime.format(formatStyle);
  const nextCreatedAt = currentTime.add(revalidate, 's').format(formatStyle);

  return {
    props: {
      createdAt,
      nextCreatedAt,
    },
    revalidate: revalidate,
  };
}


const Page: NextPage<{ createdAt: string; nextCreatedAt: string }> = ({
  createdAt,
  nextCreatedAt,
}) => {

  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{__html: `
window.addEventListener('DOMContentLoaded', function() {
  var btn = document.querySelector('#btn')
  btn.addEventListener('click', function() {
    fetch('api/revalidate').then(() => {
      window.location.reload();
    }).catch((error) => {
      console.error('error', error);
    });
  })
});`}}>
        </script>
      </Head>
      <div>
        <div>
          作成時刻：{createdAt}
        </div>
        <div>
          次の予定作成時刻：{nextCreatedAt}
        </div>
        <button color="gradient" id='btn'>
          強制ページ再生成
        </button>
      </div>
    </>
  )
}

export default Page
