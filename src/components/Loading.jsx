const Loading = ({ message = "Loading" }) => {
  return (
    <div className="loading-container">
      <div className="loader-ring"></div>
      <span className="loader-text">{message}...</span>
    </div>
  );
};

export default Loading;
