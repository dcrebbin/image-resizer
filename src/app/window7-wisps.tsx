export default function Window7Wisps() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <div className="fixed -z-5 left-0 bottom-0 w-full">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path
            className="w-full h-full"
            d={`M 0,${Math.random() * 200} 
                Q ${window.innerWidth / 2},${Math.random() * 100} 
                  ${window.innerWidth / 2},${Math.random() * 100}`}
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.5"
          />
        </svg>
      </div>
      <div className="fixed -z-5 left-0 bottom-0 w-full">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path
            className="w-full h-full"
            d={`M 0,${Math.random() * 200} 
                Q ${window.innerWidth},${Math.random() * 100} 
                  ${window.innerWidth},${Math.random() * 100}`}
            fill="none"
            stroke="white"
            strokeWidth="7"
            opacity="0.5"
          />
        </svg>
      </div>
      <div className="fixed -z-5 right-0 bottom-0 w-full opacity-50">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path
            className="w-full h-full"
            d={`M 0,${Math.random() * 200} 
                Q ${window.innerWidth / 3},${Math.random() * 100} 
                  ${window.innerWidth},${Math.random() * 100}`}
            fill="none"
            stroke="white"
            strokeWidth="7"
            opacity="0.5"
          />
        </svg>
      </div>
      <div className="fixed -z-5 right-0 bottom-0 w-full opacity-25 blur-sm">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path
            className="w-full h-full"
            d={`M 0,${Math.random() * 300} 
                Q ${window.innerWidth / 3},${Math.random() * 200} 
                  ${window.innerWidth},${Math.random() * 100}`}
            fill="none"
            stroke="white"
            strokeWidth="10"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
