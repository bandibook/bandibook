export default {
  logo: <img src="https://github.com/user-attachments/assets/2586cea2-d6fc-46c5-b3d2-d894796d6e33" width="80" />,
  project: {
    link: 'https://github.com/bandibook/bandibook',
  },
  head: (
    <>
      <link rel="icon" href="/favicon.ico" />
      <title>반디북 - 반디부디의 책지도</title>
    </>
  ),
  useNextSeoProps: () => {
    return {
      titleTemplate: '반디북 - 반디부디의 책지도',
      openGraph: {
        images: [{ url: 'https://bandibook.vercel.app/og_image.png' }],
      },
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
};
