import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AnotherUser from '../auth/anotherUser';

const anotherUser_id = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);


  return (
    <>
      <AnotherUser userId={id}/>
    </>
  )
};

export default anotherUser_id;