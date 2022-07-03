import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

const revalidate = 180;
const formatStyle = 'MM/DD HH:mm:ss';

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


const Home: NextPage<{ createdAt: string; nextCreatedAt: string }> = ({
  createdAt,
  nextCreatedAt,
}) => {
  const ondemandRevalidate = async () => {
    await fetch('api/revalidate').catch((error) => {
      console.error('error', error);
    });
  };

  return (
    <div className={styles.container}>
      <div>
        作成時刻：{createdAt}
      </div>
      <div>
        作成時刻：{nextCreatedAt}
      </div>
      <button color="gradient" onClick={ondemandRevalidate}>
        ページ再生成
      </button>
    </div>
  )
}

export default Home
