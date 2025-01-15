export default function Container({ children, className = "" }) {
    return <div className={`container w-[90%] max-w-7xl mx-auto ${className}`}>{children}</div>;
  }