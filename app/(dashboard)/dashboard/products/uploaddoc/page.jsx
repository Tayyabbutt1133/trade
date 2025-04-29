import React from 'react';

const Page = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-white">
      <iframe 
        src="https://tradetoppers.esoftideas.com/fileupload/default.aspx" 
        className="w-full h-full border-0"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '600px'  // Provide a reasonable minimum height
        }}
        frameBorder="0"
      />
    </div>
  );
};

export default Page;