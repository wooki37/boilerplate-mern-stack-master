function MainImage({ image, title, text }) {
  if (!image) return null; // 안전장치

  return (
    <div
      style={{
        height: 500,
        position: 'relative',

        // ✅ 여기가 핵심: 배경 ‘이미지’는 backgroundImage에!
        // 레이어 순서: 1) gradient(위) 2) 실제 이미지(아래)
        backgroundImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0) 39%,
            rgba(0,0,0,0) 41%,
            rgba(0,0,0,0.65) 100%
          ), url(${image})`,

        // ✅ 각 레이어의 size/position/repeat은 쉼표로 대응
        backgroundSize: '100% 100%, cover',       // gradient는 컨테이너 꽉 채우기, 이미지 cover
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundColor: '#1c1c1c',               // 이미지 로드 전 배경색
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '2rem',
          right: '2rem',
          bottom: '2rem',
          maxWidth: 500,
        }}
      >
        {title && (
          <h2 style={{ color: '#fff', margin: 0 }}>
            {title}
          </h2>
        )}
        {text && (
          <p style={{ color: '#fff', fontSize: '1rem', marginTop: '.5rem' }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export default MainImage;
