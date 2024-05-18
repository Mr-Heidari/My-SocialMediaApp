import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../button";

type Props = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
  usage: string;
  isDeleteSuccess?:boolean
};

const FileUploader = ({ fieldChange, mediaUrl, usage ,isDeleteSuccess}: Props) => {
  const [file, setFile] = useState<File[]>([]);

  const [fileUrl, setFileUrl] = useState(mediaUrl);

  useEffect(()=>{
    if(isDeleteSuccess) {
      setFileUrl("")
    } 
  },[isDeleteSuccess])
  
  //this function use usecallback hook for preventing re rendering
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  //we get input property and get property of input's container
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <>
      {usage === "postForm" ? (
        <div
          {...getRootProps()}
          className="flex flex-center flex-col bg-neutral-600 rounded-xl cursor-pointer"
        >
          <input {...getInputProps()} className="cursor-pointer" />
          {fileUrl ? (
            <>
              <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                <img src={fileUrl} alt="image" className="file_uploader-img " />
              </div>

              <p className="file_uploader-label">
                Click or drage photo to replace
              </p>
            </>
          ) : (
            <div className="file_uploader-box">
              <img
                src="/assets/icons/file-upload.svg"
                alt=""
                width={96}
                height={77}
                className="invert brightness-0 "
              />

              <h3 className="base-medium text-light-2 mb-2 mt-6">
                Drag photo here{" "}
              </h3>
              <p className="text-white/60 small-regular mb-6">SVG, JPG, PNG</p>

              <Button className="shad-button_dark_4">
                Select from computer
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="relative flex flex-center flex-col bg-neutral-600 w-36 h-36 rounded-full cursor-pointer mx-auto"
        >
          <input {...getInputProps()} className="cursor-pointer" />
          {fileUrl ? (
            <>
              <div className="flex flex-1 justify-center rounded-full absolute w-full p-1 h-full ">
                <img
                  src={fileUrl}
                  alt="image"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="bg-neutral-700 h-12 w-12 rounded-full p-2 bottom-0 right-0 absolute">
                <img
                  src="/assets/icons/edit-icone.svg"
                  alt=""
                  className="z-20 w-full h-full"
                />
              </div>
            </>
          ) : (
            <div className="file_uploader-box bg-transparent ">
              <img
                src="/assets/icons/profile-placeholder.svg"
                alt=""
                className=" w-full h-full absolute rounded-full -z-10"
              />

              <h3 className=" text-light-2 text-xs mb-2 mt-6">
                Drag photo here{" "}
              </h3>
              <p className="text-white/60 small-regular mb-6">SVG, JPG, PNG</p>

              <div className="bg-neutral-700 h-12 w-12 rounded-full p-2 bottom-0 right-0 absolute">
                <img
                  src="/assets/icons/edit-icone.svg"
                  alt=""
                  className="z-20 w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FileUploader;
