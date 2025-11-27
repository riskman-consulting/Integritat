import { useState } from "react";

const UploadDocs = () => {
  const [partFiles, setPartFiles] = useState({});
  const [folderFiles, setFolderFiles] = useState([]);

  const handlePartUpload = (part, e) => {
    setPartFiles({ ...partFiles, [part]: e.target.files });
  };

  const handleFolderUpload = (e) => {
    setFolderFiles([...e.target.files]);
  };

  const handleSubmit = () => {
    console.log("Section Files:", partFiles);
    console.log("Folder Upload Files:", folderFiles);
    alert("Files Prepared For Upload \nConnect Backend to Proceed.");
  };

  return (
    <div className="p-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-3">
        Document Upload Panel
      </h1>
      <p className="text-gray-500 mb-10 text-lg">
        Upload files <b>part-wise</b> or upload an <b>entire audit folder</b> in one click.
      </p>

      {/* PART WISE UPLOAD */}
      <div className="bg-white p-8 shadow-lg rounded-xl border mb-10 hover:shadow-xl transition">
        <h2 className="font-semibold text-xl mb-5">Upload Document Parts Individually</h2>

        <div className="flex flex-col gap-4">
          {["Document A","Document B","Document C","Document D","Document E"].map((name, index) => (
            <div 
              key={index}
              className="px-4 py-2 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-700">{name}</span>

              <input
                type="file"
                multiple
                onChange={(e) => handlePartUpload(name, e)}
                className="file:bg-blue-600 file:px-4 file:py-2 file:rounded file:text-white 
                           file:border-none file:cursor-pointer hover:file:bg-blue-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* FOLDER UPLOAD */}
      <div className="bg-white p-8 shadow-lg rounded-xl border mb-10 hover:shadow-xl transition">
        <h2 className="font-semibold text-xl mb-4">Upload Full Audit Folder</h2>

        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleFolderUpload}
          className="border p-3 rounded cursor-pointer w-full file:cursor-pointer"
        />

        {folderFiles.length > 0 && (
          <p className="mt-2 text-green-700 font-medium">
            {folderFiles.length} files selected from folder
          </p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white 
                   font-semibold px-8 py-3 rounded-xl shadow-md"
      >
        Upload Now
      </button>
    </div>
  );
};

export default UploadDocs;
