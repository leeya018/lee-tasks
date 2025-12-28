const MusicPlayer = () => {
  return (
    <div className="rounded-lg overflow-hidden border bg-card">
      <iframe
        width="100%"
        height="80"
        src="https://www.youtube.com/embed/w8l33K5D5CI?autoplay=1&loop=1&playlist=w8l33K5D5CI"
        title="Background Music"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export { MusicPlayer };
